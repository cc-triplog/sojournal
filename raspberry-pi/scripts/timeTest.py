from pynput import keyboard
import time
import math
from datetime import datetime
from pynput import keyboard
import threading
import os
from graphqlclient import GraphQLClient
import json
import redis
import urllib2
import socket
import psutil

today = datetime.now()
midnight = datetime(year=today.year, month=today.month,
                    day=today.day, hour=0, minute=0, second=0)
startFlag = False
escapeFlag = False

# redis settings
r = redis.Redis(host='localhost', port=6379, db=0)

#GRAPHQL_URL = os.environ['URL_LOCAL']
GRAPHQL_URL = "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql"

# default timeout is about 1 min.
socket.setdefaulttimeout(10)


def get_interval_config():
    client = GraphQLClient(GRAPHQL_URL)
    try:
        result = client.execute(
            """query{ReadIntervalConfig(type:{id: 2}){
            id,
            deviceId,
            startMethod,
            startTimeOfDay,
            startCountdown,
            stopMethod,
            stopTimeOfDay,
            startCountdown,
            interval
        }} """)

    except urllib2.URLError as err:
        if err.reason.strerror == 'nodename nor servname provided, or not known':
            config = json.loads(r.get('config'))
            pass
        elif err.reason.message == 'timed out':
            config = json.loads(r.get('config'))
            pass
        elif err.reason.errno == 51:
            config = json.loads(r.get('config'))
            pass

        print(err.reason)
    if result is not None:
        config = json.loads(result)["data"]["ReadIntervalConfig"]
        if len(config) != 0:
            config = config[0]
            r.set('config', json.dumps(config))
        else:
            config = r.get('config')
    return config


def datetime_to_epoch(d):
    return int(time.mktime(d.timetuple()))


def epoch_to_datetime(epoch):
    return datetime(*time.localtime(epoch)[:6])


def take_photo_with_gps(interval_config):
    global startFlag
    count = 0
    if interval_config["startMethod"] == "startTimeOfDay":
        lasttime = interval_config["startTimeOfDay"]
    else:
        lasttime = (datetime.now() - midnight).seconds

    while True:
        currenttime = datetime.now()
        deltatime = (currenttime - midnight).seconds
        if interval_config["startMethod"] == "startTimeOfDay":
            if (deltatime - lasttime) >= interval_config["interval"]:
                print "Try taking photo"
                count += 1
            if startFlag == False:
                break
        else:
            if (deltatime - lasttime) >= interval_config["interval"]:
                print "Try taking() photo"
                count += 1
            if startFlag == False:
                break
        disk_usage = psutil.disk_usage('/')
        print disk_usage
        if disk_usage.percent >= 95:
            raise Exception

        time.sleep(1)


def on_press(key):
    print threading.current_thread().name
    global startFlag
    global escapeFlag
    if startFlag == False:
        if key == keyboard.Key.tab:
            startFlag = True
            return False
        if key == keyboard.Key.esc:
            escapeFlag = True
            return False
    else:
        if key == keyboard.Key.tab:
            startFlag = False
            return False
        if key == keyboard.Key.esc:
            escapeFlag = True
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


# interval_config = {
#     "startMethod": "TIMER",
#     "startTimeOfDay": 1552533308,
#     "startCountdown": 10,
#     "stopMethod": "TIMER",
#     "stopTimeOfDay": 5,
#     "stopCountdown": 30,
#     "interval": 5
# }


if __name__ == "__main__":
    # for debugging
    currenttime = datetime.now()
    deltatime = (currenttime - midnight).seconds
    print deltatime
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
            # print "starttime: " + \
            #     str(starttime) + ", deltatime: " + \
            #     str(deltatime) + ", endtime: " + str(endtime)
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
            if (interval_config["stopMethod"] == "stopCountdown"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"

        if interval_config["startMethod"] == "startButton":
            with keyboard.Listener(
                    on_press=on_press) as listener:
                listener.join()
            print "startflag is " + str(startFlag)
            if (startFlag):
                thread.start()
                print "start thread"
            if (interval_config["stopMethod"] == "stopTimeOfDay"):
                if (deltatime - endtime == 0):
                    startFlag == False
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
            if (interval_config["stopMethod"] == "stopCountdown"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"
        if interval_config["startMethod"] == "startCountdown":
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
                    startFlag == False
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
            if (interval_config["stopMethod"] == "stopCountdown"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"
        if escapeFlag == True:
            break
        time.sleep(1)

        # if interval_config["intervalStartMethod"] == "DATETIME":
        #     starttime = interval_confi            g["intervalStartEpoch"]
        #     endtime = interval_config["intervalEndEpoch"]
        #     currenttime = int(ti  nme.time())
        #     if (starttime - currenttime == 0):
        #         print "Start taking phonto"
        #         flag = take_photo_datetime(interval_config)
        #         if flag == True:
        #             break
