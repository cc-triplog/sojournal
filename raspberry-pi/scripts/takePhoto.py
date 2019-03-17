import os
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
import math
from pynput import keyboard
import threading
import json


GRAPHQL_URL = os.environ['URL_LOCAL']
today = datetime.now()
midnight = datetime(year=today.year, month=today.month,
                    day=today.day, hour=0, minute=0, second=0)
startFlag = False


def get_interval_config():
    client = GraphQLClient(GRAPHQL_URL)
    try:
        result = client.execute(
            """query{ReadIntervalConfig(type:{id: 1}){
                id,
                deviceId,
                startMethod,
                startTimeOfDay,
                startCountdown,
                stopMethod,
                stopTimeOfDay,
                stopCountdown,
                interval
            }}"""
        )
    except urllib2.URLError as err:
        print(err.reason)
    config = json.loads(result)["data"]["ReadIntervalConfig"][0]
    return config


def datetime_to_epoch(d):
    return int(time.mktime(d.timetuple()))


def epoch_to_datetime(epoch):
    return datetime(*time.localtime(epoch)[:6])


def take_photo(camera, filename, gps_info, lastLatLonExif):
    if lastLatLonExif is None:
        camera.exif_tags['GPS.GPSLatitude'] = "35/1,39/1,2905527/100000"
        camera.exif_tags['GPS.GPSLongitude'] = "139/1,43/1,2017163/50000"
    else:
        camera.exif_tags['GPS.GPSLatitude'] = lastLatLonExif[0]
        camera.exif_tags['GPS.GPSLongitude'] = lastLatLonExif[1]
    if gps_info != {}:
        lat_deg = to_deg(gps_info['lat'], ["S", "N"])
        lng_deg = to_deg(gps_info['lon'], ["W", "E"])

        exiv_lat = change_to_rational(lat_deg[0]) + "," + change_to_rational(
            lat_deg[1]) + "," + change_to_rational(lat_deg[2])
        exiv_lng = change_to_rational(lng_deg[0]) + "," + change_to_rational(
            lng_deg[1]) + "," + change_to_rational(lng_deg[2])
        camera.exif_tags['GPS.GPSLatitude'] = exiv_lat
        # camera.exif_tags['GPS.GPSLatitudeRef'] = str(lat_deg[3])
        # camera.exif_tags['GPS.GPSLongitudeRef'] = str(lng_deg[3])
        camera.exif_tags['GPS.GPSLongitude'] = exiv_lng
        camera.exif_tags['GPS.GPSTimeStamp'] = str(gps_info['time'])
        # camera.exif_tags['GPS.GPSAltitudeRef'] = str(1)
        camera.exif_tags['GPS.GPSAltitude'] = str(gps_info['alt'])
        camera.exif_tags['GPS.GPSTrack'] = str(gps_info['track'])
        print "lattitude is " + exiv_lat
        print "longitude is " + exiv_lng
    # camera warm-up time
    # time.sleep(2)
    camera.capture('./photos/' + filename)


def upload_s3(filename):
    bucket_name = 'trip-logger-bucket'
    s3 = boto3.resource('s3')
    s3.Bucket(bucket_name).upload_file('./photos/'+filename, filename)
    print "done"


def get_gps(data_stream, gps_socket, lastLatLon):
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
    return str(f.numerator) + "/" + str(f.denominator)


def upload_server(filename, timestr, gps_info, lastLatLon):
    with open('./photos/' + filename, 'rb') as f:
        data = f.read()
        base64 = data.encode('base64')

        client = GraphQLClient(GRAPHQL_URL)
        print type(base64) is str

        if lastLatLon is None:
            lastLatLon = (35.657995, 139.727666)

        if gps_info != {} and gps_info['lon'] is not None and gps_info['lat'] is not None and gps_info['alt'] is not None and gps_info['track'] is not None:
            result = client.execute(
                "mutation{CreatePhoto(input: {imageFile: \"\"\"" +
                base64 + "\"\"\", title: \"" + timestr + "\", longitude: " +
                str(gps_info['lon']) + ", latitude: " +
                str(gps_info['lat']) + ", deviceId: 2, altitude: " +
                str(gps_info['alt']) + ", bearing: " +
                str(gps_info['track']) + "})}"
            )
            print(result)
        else:
            result = client.execute(
                "mutation{CreatePhoto(input: {imageFile: \"\"\"" +
                base64 + "\"\"\", title: \"" + timestr +
                "\", latitude: " +
                str(lastLatLon[0]) + ", longitude: " +
                str(lastLatLon[1]) + ", deviceId: 2})}"
            )
            print(result)


def take_photo_with_gps(interval_config):
    global startFlag
    starttime = datetime.now()
    count = 0
    lastLatLon = None
    lastLatLonExif = None
    gps_socket = gps3.GPSDSocket()
    data_stream = gps3.DataStream()
    gps_socket.connect()
    gps_socket.watch()
    camera = picamera.PiCamera()
    camera.resolution = (1024, 768)
    camera.start_preview()
    camera.led = False
    while True:
        currenttime = datetime.now()
        deltatime = (currenttime - midnight).seconds
        if interval_config["startMethod"] == "startTimeOfDay":
            if (deltatime - interval_config["startTimeOfDay"]) % interval_config["interval"] == 0:
                count += 1
                timestr = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
                filename = timestr + '.jpg'
                print "starting get gps info"
                gps_info = get_gps(data_stream, gps_socket, lastLatLon)
                print "finish get gps info"
                print "starting take photo " + filename
                take_photo(camera, filename, gps_info, lastLatLonExif)
                print "finish take photo " + filename
                print "starting upload photo " + filename
                upload_server(filename, timestr, gps_info, lastLatLon)
                # upload_s3(filename)
                print "finish upload photo " + filename
            if startFlag == False:
                print "uploaded: " + str(count)
                break
        else:
            if (currenttime - starttime).seconds % interval_config["interval"] == 0:
                count += 1
                timestr = datetime.now().strftime('%Y%m%d%H%M%S')
                filename = timestr + '.jpg'
                print "starting get gps info"
                gps_info = get_gps(data_stream, gps_socket, lastLatLon)
                print "finish get gps info"
                print "starting take photo " + filename
                take_photo(camera, filename, gps_info, lastLatLonExif)
                print "finish take photo " + filename
                print "starting upload photo " + filename
                upload_server(filename, timestr, gps_info, lastLatLon)
                # upload_s3(filename)
                print "finish upload photo " + filename
            if startFlag == False:
                break
        time.sleep(1)


def on_press(key):
    print threading.current_thread().name
    global startFlag
    if startFlag == False:
        if key == keyboard.Key.tab:
            startFlag = True
            return False
    else:
        if key == keyboard.Key.tab:
            startFlag = False
            return False


class StoppableThread(threading.Thread):
    """Thread class with a stop() method. The thread itself has to check
    regularly for the stopped() condition."""

    def __init__(self, *args, **kwargs):
        super(StoppableThread, self).__init__(*args, **kwargs)
        self._stop_event = threading.Event()

    def stop(self):
        self._stop_event.set()
        self.join()

    def stop_timeofday(self):
        self._stop_event.set()

    def stopped(self):
        return self._stop_event.is_set()


if __name__ == "__main__":
    while True:
        interval_config = get_interval_config()
        thread = StoppableThread(target=take_photo_with_gps,
                                 args=([interval_config]))
        #print threading.current_thread().name
        if interval_config["startMethod"] == "startTimeOfDay":
            starttime = interval_config["startTimeOfDay"]
            endtime = interval_config["stopTimeOfDay"]
            currenttime = datetime.now()
            deltatime = (currenttime - midnight).seconds
            #print starttime - deltatime
            if (starttime - deltatime == 0):
                print "Start Thread"
                startFlag = True
                thread.start()
            if (interval_config["stopMethod"] == "stopTimeOfDay"):
                if (deltatime - endtime == 0):
                    startFlag = False
                    print "startflag is " + str(startFlag)
                    thread.stop_timeofday()
                    print "Stop Thread"
            if (interval_config["stopMethod"] == "stopButton"):
                with keyboard.Listener(
                        on_press=on_press) as listener:
                    listener.join()
                print "startflag is " + str(startFlag)
                if (startFlag == False):
                    thread.stop()
                    print "stop thread"
            if (interval_config["stopMethod"] == "stopCountDown"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"

        if interval_config["startMethod"] == "startButton":
            print "waiting input"
            with keyboard.Listener(
                    on_press=on_press) as listener:
                listener.join()
            print "startflag is " + str(startFlag)
            if (startFlag):
                thread.start()
                print "start thread"
            if (interval_config["stopMethod"] == "stopTimeOfDay"):
                if (deltatime - endtime == 0):
                    startFlag = False
                    print "startflag is " + str(startFlag)
                    thread.stop()
                    print "Stop Thread"
            if (interval_config["stopMethod"] == "stopButton"):
                with keyboard.Listener(
                        on_press=on_press) as listener:
                    listener.join()
                print "startflag is " + str(startFlag)
                if (startFlag == False):
                    thread.stop()
                    print "stop thread"
            if (interval_config["stopMethod"] == "stopCountDown"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"
        if interval_config["startMethod"] == "startCountDown":
            with keyboard.Listener(
                    on_press=on_press) as listener:
                listener.join()
            print "startflag is " + str(startFlag)
            if (startFlag):
                print "waiting :" + \
                    str(interval_config["startCountdown"]) + " seconds..."
                time.sleep(interval_config["startCountdown"])
                thread.start()
                print "start thread"
            if (interval_config["stopMethod"] == "stopTimeOfDay"):
                if (deltatime - endtime == 0):
                    startFlag = False
                    print "startflag is " + str(startFlag)
                    thread.stop()
                    print "Stop Thread"
            if (interval_config["stopMethod"] == "stopButton"):
                with keyboard.Listener(
                        on_press=on_press) as listener:
                    listener.join()
                print "startflag is " + str(startFlag)
                if (startFlag == False):
                    thread.stop()
                    print "stop thread"
            if (interval_config["stopMethod"] == "stopCountDown"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"
        time.sleep(1)
