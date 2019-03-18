import os
import socket
from datetime import datetime
import urllib2
import json
import redis
from graphqlclient import GraphQLClient
from gps3 import gps3

# redis settings
r = redis.Redis(host='localhost', port=6379, db=0)

GRAPHQL_URL = os.environ['URL_LOCAL']
# default timeout is about 1 min.
socket.setdefaulttimeout(10)


def getRaspiConfig():
    client = GraphQLClient(GRAPHQL_URL)
    try:
        result = client.execute(
            """query{ReadRasppiConfig(type:{id:1}){
                id,
                gpsInterval,
                selectedInterval
            }}"""
        )
    except urllib2.URLError as err:
        if err.reason.strerror == 'nodename nor servname provided, or not known':
            config = json.loads(r.get('gpsconfig'))
            pass
        elif err.reason.message == 'timed out':
            config = json.loads(r.get('gpsconfig'))
            pass
        elif err.reason.errno == 51:
            config = json.loads(r.get('gpsconfig'))
            pass
        print(err.reason)
    if result is not None:
        config = json.loads(result)["data"]["ReadRasppiConfig"]
        if len(config) != 0:
            config = config[0]
            r.set('gpsconfig', json.dumps(config))
        else:
            config = r.get('gpsconfig')
    return config


def get_gps(data_stream, gps_socket, config):
    global lastLatLon
    gps_info = {}
    counter = 0
    for newdata in gps_socket:
        print(newdata)
        if counter <= 5:
            counter += 1
            continue
        if newdata:
            data_stream.unpack(newdata)

        if data_stream.TPV['time'] != 'n/a':
            print 'time : ', data_stream.TPV['time']
            gps_info['time'] = data_stream.TPV['time']
        if data_stream.TPV['lat'] != 'n/a' and data_stream.TPV['lon'] != 'n/a':
            print 'lat : ', data_stream.TPV['lat']
            gps_info['lat'] = data_stream.TPV['lat']
            print 'lon : ', data_stream.TPV['lon']
            gps_info['lon'] = data_stream.TPV['lon']
            lastLatLon = (gps_info['lat'], gps_info['lon'])
        if data_stream.TPV['alt'] != 'n/a':
            print 'alt : ', data_stream.TPV['alt']
            gps_info['alt'] = data_stream.TPV['alt']
        if data_stream.TPV['track'] != 'n/a':
            print 'track : ', data_stream.TPV['track']
            gps_info['track'] = data_stream.TPV['track']
            break
        break
    return gps_info


def upload_server(timestr, gps_info):
    if gps_info != {} and gps_info['lon'] is not None and gps_info['lat'] is not None and gps_info['alt'] is not None and gps_info['track'] is not None:
        try:
            query = 'mutation{CreatePhoto(input: {imageFile: \"\"\"' +
            base64 + '\"\"\", title: \"' + timestr + '\", longitude: ' +
            str(gps_info['lon']) + ', latitude: ' +
            str(gps_info['lat']) + ', deviceId: 2, altitude: ' +
            str(gps_info['alt']) + ', bearing: ' +
            str(gps_info['track']) + '})}'
            result = client.execute(
                query
            )
        except urllib2.URLError as err:
            if err.reason.strerror == 'nodename nor servname provided, or not known':
                failed.append(query)
                pass
            elif err.reason.errno == 51:
                failed.append(query)
                pass
        print(result)


if __name__ == "__main__":
    gps_socket = gps3.GPSDSocket()
    data_stream = gps3.DataStream()
    gps_socket.connect()
    gps_socket.watch()
    while True:
        config = getRaspiConfig()
        timestr = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        print "starting get gps info"
        gps_info = get_gps(data_stream, gps_socket, config)
        print "finish get gps info"
        print "starting upload photo"
        upload_server(timestr, gps_info)
        print "finish upload gps data"
