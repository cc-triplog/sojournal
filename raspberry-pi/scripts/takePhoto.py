import picamera
import time
from datetime import datetime
from gps3 import gps3
import time
from urllib import urlencode
import urllib2
import boto3
from graphqlclient import GraphQLClient
import json


def take_photo(filename, gps_info):
    with picamera.PiCamera() as camera:
        camera.resolution = (1024, 768)
        camera.start_preview()
        camera.led = False
        if gps_info is not None:
            camera.exif_tags['GPS.GPSLatitude'] = gps_info['lat']
            camera.exif_tags['GPS.GPSLongitude'] = gps_info['lon']
            camera.exif_tags['GPS.GPSTimeStamp'] = gps_info['time']
            camera.exif_tags['GPS.GPSAltitude'] = gps_info['alt']
            camera.exif_tags['GPS.GPSTrack'] = gps_info['track']
        # camera warm-up time
        time.sleep(2)
        camera.capture('./photos/' + filename)


def upload_s3(filename):
    bucket_name = 'trip-logger-bucket'
    s3 = boto3.resource('s3')
    s3.Bucket(bucket_name).upload_file('./photos/'+filename, filename)
    print "done"


def get_gps(data_stream, gps_socket):
    gps_info = None
    for newdata in gps_socket:
        print(newdata)
        if newdata:
            data_stream.unpack(newdata)
        print(data_stream.TPV['lat'])
        if data_stream.TPV['lat'] != 'n/a':
            print 'time : ', data_stream.TPV['time']
            print 'lat : ', data_stream.TPV['lat']
            print 'lon : ', data_stream.TPV['lon']
            print 'alt : ', data_stream.TPV['alt']
            print 'track : ', data_stream.TPV['track']
            gps_info = data_stream.TPV
            break
        break
    return gps_info


def upload_server(filename, gps_info):
    with open('./photos/' + filename, 'rb') as f:
        data = f.read()
        base64 = data.encode('base64')

        client = GraphQLClient('http://192.168.10.99:4000/graphql')
        print type(base64) is str

        if gps_info is not None:
            result = client.execute(
                "mutation{CreatePhoto(input: {imageFile: \"\"\"" +
                base64 + "\"\"\", longitude: " +
                gps_info['lon'] + ", latitude: " +
                gps_info['lat'] + ", deviceId: 2, altitude: " +
                gps_info['alt'] + ", bearing: " + gps_info['track'] + "})}"
            )
            print(result)
        else:
            result = client.execute(
                "mutation{CreatePhoto(input: {imageFile: \"\"\"" +
                base64 + "\"\"\", deviceId: 2})}"
            )
            print(result)


gps_socket = gps3.GPSDSocket()
data_stream = gps3.DataStream()
gps_socket.connect()
gps_socket.watch()
while True:
    timestr = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = timestr + '.jpg'
    print "starting get gps info"
    gps_info = get_gps(data_stream, gps_socket)
    print "finish get gps info"
    print "starting take photo " + filename
    take_photo(filename, gps_info)
    print "finish take photo " + filename
    print "starting upload photo " + filename
    upload_server(filename, gps_info)
    # upload_s3(filename)
    print "finish upload photo " + filename
    time.sleep(10)
