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
import pyexif
from fractions import Fraction


def take_photo(filename, gps_info):
    with picamera.PiCamera() as camera:
        camera.resolution = (1024, 768)
        camera.start_preview()
        camera.led = False
        if gps_info is not None:
            lat_deg = to_deg(gps_info['lat'], ["S", "N"])
            lng_deg = to_deg(gps_info['lon'], ["W", "E"])

            exiv_lat = (change_to_rational(lat_deg[0]), change_to_rational(
                lat_deg[1]), change_to_rational(lat_deg[2]))
            exiv_lng = (change_to_rational(lng_deg[0]), change_to_rational(
                lng_deg[1]), change_to_rational(lng_deg[2]))
            camera.exif_tags['GPS.GPSLatitudeRef'] = lat_deg[3]
            camera.exif_tags['GPS.GPSLatitude'] = exiv_lat
            camera.exif_tags['GPS.GPSLongitudeRef'] = lng_deg[3]
            camera.exif_tags['GPS.GPSLongitude'] = exiv_lng
            camera.exif_tags['GPS.GPSTimeStamp'] = gps_info['time']
            camera.exif_tags['GPS.GPSAltitudeRef'] = 1
            camera.exif_tags['GPS.GPSAltitude'] = change_to_rational(
                round(gps_info['alt']))
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


def to_deg(value, loc):
    """convert decimal coordinates into degrees, munutes and seconds tuple
    Keyword arguments: value is float gps-value, loc is direction list ["S", "N"] or ["W", "E"]
    return: tuple like (25, 13, 48.343 ,'N')
    """
    if value < 0:
        loc_value = loc[0]
    elif value > 0:
        loc_value = loc[1]
    else:
        loc_value = ""
    abs_value = abs(value)
    deg = int(abs_value)
    t1 = (abs_value-deg)*60
    min = int(t1)
    sec = round((t1 - min) * 60, 5)
    return (deg, min, sec, loc_value)


def change_to_rational(number):
    """convert a number to rantional
    Keyword arguments: number
    return: tuple like (1, 2), (numerator, denominator)
    """
    f = Fraction(str(number))
    return (f.numerator, f.denominator)


def upload_server(filename, gps_info):
    with open('./photos/' + filename, 'rb') as f:
        data = f.read()
        base64 = data.encode('base64')

        client = GraphQLClient('http://169.254.236.41:4000/graphql')
        print type(base64) is str

        if gps_info is not None:
            result = client.execute(
                "mutation{CreatePhoto(input: {imageFile: \"\"\"" +
                base64 + "\"\"\", longitude: " +
                str(gps_info['lon']) + ", latitude: " +
                str(gps_info['lat']) + ", deviceId: 2, altitude: " +
                str(gps_info['alt']) + ", bearing: " +
                str(gps_info['track']) + "})}"
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
