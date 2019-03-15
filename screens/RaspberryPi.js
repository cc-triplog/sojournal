import React from "react";
import { Picker, View, Text, ScrollView } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import TimePicker from "../components/TimePicker";
import { Button } from "react-native-elements";
import moment from "moment";
import axios from "axios";

export default class RaspberryPi extends React.Component {
  state = {
    startMethod: "startButton",
    finishMethod: "stopButton",
    interval: "",
    startTimePicked: "",
    finishTimePicked: "",
    isDateTimePickerVisible: false,
    currentlySetting: "",
    timerHours: 0,
    timerMinutes: 0,
    timerSeconds: 0,
    intervalHours: 0,
    intervalMinutes: 0,
    intervalSeconds: 0,
    startTimerHours: 0,
    startTimerMinutes: 0,
    startTimerSeconds: 0
  };

  handleUpdate = target => value => {
    console.log(target);
    this.setState({ [target]: value });
  };

  _showStartTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true, currentlySetting: "start" });
  };
  _showFinishTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: true,
      currentlySetting: "finish"
    });
  };

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    this.state.currentlySetting === "start"
      ? this.handleUpdate("startTimePicked")(date)
      : this.handleUpdate("finishTimePicked")(date);
    this._hideDateTimePicker();
  };

  timeToSeconds(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
  }

  convertConfigsBeforeUpload = () => {
    const {
      intervalHours,
      intervalMinutes,
      intervalSeconds,
      startTimePicked,
      finishTimePicked,
      timerHours,
      timerMinutes,
      timerSeconds,
      startTimerHours,
      startTimerMinutes,
      startTimerSeconds
    } = this.state;
    let data = {
      startMethod: this.state.startMethod,
      stopMethod: this.state.finishMethod,
      interval: this.timeToSeconds(
        intervalHours,
        intervalMinutes,
        intervalSeconds
      ),
      startTimeOfDay: null,
      stopTimeOfDay: null,
      stopCountdown: null,
      startCountdown: null
    };
    if (this.state.startMethod === "startTimeOfDay") {
      data.startTimeOfDay = this.timeToSeconds(
        startTimePicked.getHours(),
        startTimePicked.getMinutes(),
        startTimePicked.getSeconds()
      );
    }
    if (this.state.finishMethod === "stopTimeOfDay") {
      data.stopTimeOfDay = this.timeToSeconds(
        finishTimePicked.getHours(),
        finishTimePicked.getMinutes(),
        finishTimePicked.getMinutes()
      );
    }
    if (this.state.startMethod === "startCountdown") {
      data.startCountdown = this.timeToSeconds(
        startTimerHours,
        startTimerMinutes,
        startTimerSeconds
      );
    }
    if (this.state.finishMethod === "stopCountdown") {
      data.stopCountdown = this.timeToSeconds(
        timerHours,
        timerMinutes,
        timerSeconds
      );
    }
    return data;
  };

  uploadConfigs = () => {
    const data = this.convertConfigsBeforeUpload();
    console.log(data);
  };

  getConfigs = () => {
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `query
        {
          ReadIntervalConfig(type: {id: 1}) {
            id, startMethod, startTimeOfDay, startCountdown, stopMethod, stopTimeOfDay, stopCountdown, interval
          }
        }`
      }
    }).then(res => console.log(res));
  };

  render() {
    const {
      startTimePicked,
      finishTimePicked,
      timerHours,
      timerMinutes,
      timerSeconds,
      startMethod,
      finishMethod,
      intervalHours,
      intervalMinutes,
      intervalSeconds,
      startTimerHours,
      startTimerMinutes,
      startTimerSeconds
    } = this.state;
    return (
      <View>
        <ScrollView>
          <Text style={{ color: "grey" }}> Start Method </Text>
          <Picker
            selectedValue={this.state.startMethod}
            onValueChange={this.handleUpdate("startMethod")}
          >
            <Picker.Item label="Manual" value="startButton" />
            <Picker.Item label="Set Time" value="startTimeOfDay" />
            <Picker.Item label="Timer" value="startCountdown" />
          </Picker>

          {startMethod === "startTimeOfDay" ? (
            <React.Fragment>
              <Button
                buttonStyle={{
                  width: "50%",
                  alignSelf: "center",
                  marginBottom: 20
                }}
                type="outline"
                title={
                  startTimePicked === ""
                    ? "Select Time"
                    : moment(startTimePicked).format("HH:mm")
                }
                onPress={this._showStartTimePicker}
              />
            </React.Fragment>
          ) : null}
          {startMethod === "startCountdown" ? (
            <View>
              <Text style={{ color: "grey" }}> Start In </Text>
              <View style={{ height: 180 }}>
                <TimePicker
                  target={"startTimer"}
                  handleUpdate={this.handleUpdate}
                  selectedHours={startTimerHours}
                  selectedMinutes={startTimerMinutes}
                  selectedSeconds={startTimerSeconds}
                />
              </View>
            </View>
          ) : null}
          <Text style={{ color: "grey" }}> Finish Method </Text>
          <Picker
            selectedValue={this.state.finishMethod}
            onValueChange={this.handleUpdate("finishMethod")}
          >
            <Picker.Item label="Manual" value="stopButton" />
            <Picker.Item label="Set Time" value="stopTimeOfDay" />
            <Picker.Item label="Timer" value="stopCountdown" />
          </Picker>
          {finishMethod === "stopTimeOfDay" ? (
            <Button
              buttonStyle={{
                width: "50%",
                alignSelf: "center",
                marginBottom: 20
              }}
              type="outline"
              title={
                finishTimePicked === ""
                  ? "Select Time"
                  : moment(finishTimePicked).format("HH:mm")
              }
              onPress={this._showFinishTimePicker}
            />
          ) : null}
          <DateTimePicker
            mode="time"
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />
          {finishMethod === "stopCountdown" ? (
            <View>
              <View style={{ height: 180 }}>
                <Text style={{ color: "grey" }}> Set Timer </Text>
                <TimePicker
                  target={"timer"}
                  handleUpdate={this.handleUpdate}
                  selectedHours={timerHours}
                  selectedMinutes={timerMinutes}
                  selectedSeconds={timerSeconds}
                />
              </View>
              <Text style={{ color: "grey", marginTop: 20 }}>
                Interval Settings{" "}
              </Text>
              <View style={{ height: 180 }}>
                <TimePicker
                  target={"interval"}
                  handleUpdate={this.handleUpdate}
                  selectedHours={intervalHours}
                  selectedMinutes={intervalMinutes}
                  selectedSeconds={intervalSeconds}
                />
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ color: "grey" }}> Interval Settings </Text>
              <View style={{ height: 180 }}>
                <TimePicker
                  target={"interval"}
                  handleUpdate={this.handleUpdate}
                  selectedHours={intervalHours}
                  selectedMinutes={intervalMinutes}
                  selectedSeconds={intervalSeconds}
                />
              </View>
            </View>
          )}
          <Button
            buttonStyle={{
              width: "50%",
              alignSelf: "center",
              marginTop: 20,
              marginBottom: 20
            }}
            type="outline"
            title="Save"
            onPress={this.uploadConfigs}
          />
        </ScrollView>
      </View>
    );
  }
}
