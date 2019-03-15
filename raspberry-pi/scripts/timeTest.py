from pynput import keyboard
import time
import math
from datetime import datetime
from pynput import keyboard
import threading

global startFlag
global midnight
today = datetime.now()
midnight = datetime(year=today.year, month=today.month,
                    day=today.day, hour=0, minute=0, second=0)
startFlag = False


def datetime_to_epoch(d):
    return int(time.mktime(d.timetuple()))


def epoch_to_datetime(epoch):
    return datetime(*time.localtime(epoch)[:6])


# def take_photo_timeofday(interval_config):
#     count = 0
#     while True:
#         currenttime = datetime.now()
#         deltatime = (currenttime - midnight).seconds
#         if (deltatime - interval_config["startTimeOfDay"]) % interval_config["interval"] == 0:
#             print "Try taking photo"
#             count += 1
#         # if interval_config["stopMethod"] == "DATETIME":
#         #     if (interval_config["stopTimeOfDay"] - currenttime) == 0:
#         #         print "Finish taking photo: " + str(count)
#         #         return True
#         # if interval_config["intervalEndMethod"] == "MANUAL":
#         #     print "aaa"
#         time.sleep(1)


def take_photo_with_gps(interval_config):
    global startFlag
    count = 0
    while True:
        currenttime = datetime.now()
        deltatime = (currenttime - midnight).seconds
        if (deltatime - interval_config["startTimeOfDay"]) % interval_config["interval"] == 0:
            print "Try taking photo"
            count += 1
        # if interval_config["stopMethod"] == "DATETIME":
        #     if (interval_config["stopTimeOfDay"] - currenttimeEpoch) == 0:
        #         print "Finish taking photo: " + str(count)
        #         return True
        # if interval_config["stopMethod"] == "MANUAL":
        #     print threading.current_thread().name
        #     if startFlag == False:
        #         break
        if startFlag == False:
            break
        time.sleep(1)

# def on_press(key):
#     try:
#         print('alphanumeric key {0} pressed'.format(
#             key.char))
#     except AttributeError:
#         print('special key {0} pressed'.format(
#             key))


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

    def stopped(self):
        return self._stop_event.is_set()


interval_config = {
    "startMethod": "TIMER",
    "startTimeOfDay": 1552533308,
    "startCountdown": 10,
    "stopMethod": "TIMER",
    "stopTimeOfDay": 5,
    "stopCountdown": 30,
    "interval": 5
}


if __name__ == "__main__":
    while True:
        thread = StoppableThread(target=take_photo_with_gps,
                                 args=([interval_config]))
        print threading.current_thread().name
        if interval_config["startMethod"] == "TIMEOFDAY":
            starttime = interval_config["startTimeOfDay"]
            endtime = interval_config["stopTimeOfDay"]
            currenttime = datetime.now()
            deltatime = (currenttime - midnight).seconds
            if (starttime - deltatime == 0):
                print "Start Thread"
                startFlag == True
                thread.start()
            if (interval_config["stopMethod"] == "TIMEOFDAY"):
                if (deltatime - endtime == 0):
                    startFlag == False
                    print "startflag is " + str(startFlag)
                    thread.stop()
                    print "Stop Thread"
            if (interval_config["stopMethod"] == "MANUAL"):
                with keyboard.Listener(
                        on_press=on_press) as listener:
                    listener.join()
                print "startflag is " + str(startFlag)
                if (startFlag == False):
                    thread.stop()
                    print "stop thread"
            if (interval_config["stopMethod"] == "TIMER"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"

        if interval_config["startMethod"] == "MANUAL":
            with keyboard.Listener(
                    on_press=on_press) as listener:
                listener.join()
            print "startflag is " + str(startFlag)
            if (startFlag):
                thread.start()
                print "start thread"
            if (interval_config["stopMethod"] == "TIMEOFDAY"):
                if (deltatime - endtime == 0):
                    startFlag == False
                    print "startflag is " + str(startFlag)
                    thread.stop()
                    print "Stop Thread"
            if (interval_config["stopMethod"] == "MANUAL"):
                with keyboard.Listener(
                        on_press=on_press) as listener:
                    listener.join()
                print "startflag is " + str(startFlag)
                if (startFlag == False):
                    thread.stop()
                    print "stop thread"
            if (interval_config["stopMethod"] == "TIMER"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"
        if interval_config["startMethod"] == "TIMER":
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
            if (interval_config["stopMethod"] == "TIMEOFDAY"):
                if (deltatime - endtime == 0):
                    startFlag == False
                    print "startflag is " + str(startFlag)
                    thread.stop()
                    print "Stop Thread"
            if (interval_config["stopMethod"] == "MANUAL"):
                with keyboard.Listener(
                        on_press=on_press) as listener:
                    listener.join()
                print "startflag is " + str(startFlag)
                if (startFlag == False):
                    thread.stop()
                    print "stop thread"
            if (interval_config["stopMethod"] == "TIMER"):
                time.sleep(interval_config["stopCountdown"])
                print startFlag
                startFlag = False
                thread.stop()
                print "stop thread"

        # if interval_config["intervalStartMethod"] == "DATETIME":
        #     starttime = interval_confi            g["intervalStartEpoch"]
        #     endtime = interval_config["intervalEndEpoch"]
        #     currenttime = int(ti  nme.time())
        #     if (starttime - currenttime == 0):
        #         print "Start taking phonto"
        #         flag = take_photo_datetime(interval_config)
        #         if flag == True:
        #             break
