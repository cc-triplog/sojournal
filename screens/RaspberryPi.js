import React from "react";
import {
  AsyncStorage,
  Picker,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import TimePicker from "../components/TimePicker";
import { Button } from "react-native-elements";
import moment from "moment";
import axios from "axios";

//Redux
import { connect } from "react-redux";
import { setUserId, resetState } from "../action";

class RaspberryPi extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: "Sojournal",
    headerRight: (
      <Button onPress={navigation.getParam("logOut")} title="Log Out" />
    )
  });
  state = {
    startMethod: "startButton",
    stopMethod: "stopButton",
    interval: "",
    startTimePicked: "",
    finishTimePicked: "",
    isDateTimePickerVisible: false,
    currentlySetting: "",
    stopTimerHours: 0,
    stopTimerMinutes: 0,
    stopTimerSeconds: 0,
    intervalHours: 0,
    intervalMinutes: 0,
    intervalSeconds: 0,
    startTimerHours: 0,
    startTimerMinutes: 0,
    startTimerSeconds: 0,
    newDeviceID: "",
    currentDeviceID: ""
  };

  handleUpdate = target => value => {
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
  secondsToTime(givenSeconds) {
    const hours = Math.floor(givenSeconds / 3600);
    const minutes = Math.floor((givenSeconds - hours * 3600) / 60);
    const seconds = givenSeconds % 60;
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  convertConfigsBeforeUpload = () => {
    const {
      intervalHours,
      intervalMinutes,
      intervalSeconds,
      startTimePicked,
      finishTimePicked,
      stopTimerHours,
      stopTimerMinutes,
      stopTimerSeconds,
      startTimerHours,
      startTimerMinutes,
      startTimerSeconds,
      startMethod,
      stopMethod
    } = this.state;
    let data = {
      startMethod: startMethod,
      stopMethod: stopMethod,
      interval: this.timeToSeconds(
        intervalHours,
        intervalMinutes,
        intervalSeconds
      ),
      startTimeOfDay: 0,
      stopTimeOfDay: 0,
      stopCountdown: 0,
      startCountdown: 0
    };
    if (this.state.startMethod === "startTimeOfDay") {
      data.startTimeOfDay = this.timeToSeconds(
        startTimePicked.getHours(),
        startTimePicked.getMinutes(),
        startTimePicked.getSeconds()
      );
    }
    if (this.state.stopMethod === "stopTimeOfDay") {
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
    if (this.state.stopMethod === "stopCountdown") {
      data.stopCountdown = this.timeToSeconds(
        stopTimerHours,
        stopTimerMinutes,
        stopTimerSeconds
      );
    }
    return data;
  };

  uploadConfigs = () => {
    const data = this.convertConfigsBeforeUpload();
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation
          {UpdateIntervalConfig(
            input:{
              id: 1
              startMethod:"${data.startMethod}"
              stopMethod: "${data.stopMethod}"
              startCountdown: ${data.startCountdown}
              stopCountdown: ${data.stopCountdown}
              stopTimeOfDay: ${data.stopTimeOfDay}
              startTimeOfDay: ${data.startTimeOfDay}
              interval: ${data.interval}
          })}`
      }
    }).catch(err => console.log(err));
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
    }).then(res => {
      this.convertConfigsFromServer(res.data.data.ReadIntervalConfig[0]);
    });
  };

  getDevice = () => {
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `{
            ReadDevice(type: {
              userId: ${this.props.userId}
              }){
              deviceSerial
            }
          }`
      }
    }).then(res =>
      this.setState({
        currentDeviceID: res.data.data.ReadDevice[0]
          ? res.data.data.ReadDevice[0]["deviceSerial"]
          : ""
      })
    );
  };

  convertConfigsFromServer = res => {
    this.setState({
      startMethod: res.startMethod,
      stopMethod: res.stopMethod,
      intervalHours: this.secondsToTime(res.interval)["hours"],
      intervalMinutes: this.secondsToTime(res.interval)["minutes"],
      intervalSeconds: this.secondsToTime(res.interval)["seconds"]
    });
    if (res.startMethod === "startCountdown") {
      this.setState({
        startTimerHours: this.secondsToTime(res.startCountdown)["hours"],
        startTimerMinutes: this.secondsToTime(res.startCountdown)["minutes"],
        startTimerSeconds: this.secondsToTime(res.startCountdown)["seconds"]
      });
    }
    if (res.stopMethod === "stopCountdown") {
      this.setState({
        stopTimerHours: this.secondsToTime(res.stopCountdown)["hours"],
        stopTimerMinutes: this.secondsToTime(res.stopCountdown)["minutes"],
        stopTimerSeconds: this.secondsToTime(res.stopCountdown)["seconds"]
      });
    }
  };
  logOut = () => {
    this.props.screenProps.logOut();
    this.props.resetState();
  };
  pairDevice = () => {
    console.log(this.state.newDeviceID, this.props.userId);
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation{
            CreateDevice(input: {
              userId: ${this.props.userId}
              deviceSerial: "${this.state.newDeviceID}"
            })
          }`
      }
    }).then(() => this.getDevice());
  };

  unregisterDevice = () => {
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation {
            DestroyDevice(input: {
            userId: ${this.props.userId}
            deviceSerial: "${this.state.currentDeviceID}"
            })
          }`
      }
    }).then(() => this.getDevice());
  };
  async componentDidMount() {
    this.props.navigation.setParams({
      logOut: this.logOut
    });
    await AsyncStorage.getItem("id")
      .then(res => {
        this.props.setUserId(res);
      })
      .then(() => {
        this.getConfigs();
        this.getDevice();
      });
  }

  render() {
    const {
      startTimePicked,
      finishTimePicked,
      stopTimerHours,
      stopTimerMinutes,
      stopTimerSeconds,
      startMethod,
      stopMethod,
      intervalHours,
      intervalMinutes,
      intervalSeconds,
      startTimerHours,
      startTimerMinutes,
      startTimerSeconds,
      currentDeviceID
    } = this.state;
    return (
      <View style={{ marginTop: 20, marginRight: 15, marginLeft: 15 }}>
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
            selectedValue={this.state.stopMethod}
            onValueChange={this.handleUpdate("stopMethod")}
          >
            <Picker.Item label="Manual" value="stopButton" />
            <Picker.Item label="Set Time" value="stopTimeOfDay" />
            <Picker.Item label="Timer" value="stopCountdown" />
          </Picker>
          {stopMethod === "stopTimeOfDay" ? (
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
          {stopMethod === "stopCountdown" ? (
            <View>
              <View style={{ height: 180 }}>
                <Text style={{ color: "grey" }}> Set Timer </Text>
                <TimePicker
                  target={"stopTimer"}
                  handleUpdate={this.handleUpdate}
                  selectedHours={stopTimerHours}
                  selectedMinutes={stopTimerMinutes}
                  selectedSeconds={stopTimerSeconds}
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
          <Text style={{ fontSize: 16 }}>Your Device</Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "grey",
              marginTop: 10
            }}
          >
            <TextInput
              value={currentDeviceID}
              editable={false}
              style={{ marginLeft: 10, height: 40 }}
              onChangeText={text => {
                this.setState({ deviceID: text });
              }}
            />
          </View>
          <Button
            buttonStyle={{
              width: "50%",
              alignSelf: "center",
              marginBottom: 40,
              marginTop: 20
            }}
            type="outline"
            title="Unregister"
            onPress={this.unregisterDevice}
          />
          <Text style={{ fontSize: 16 }}>Pair New Device:</Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "grey",
              marginTop: 10
            }}
          >
            <TextInput
              style={{ marginLeft: 10, height: 40 }}
              placeholder="Enter device ID"
              onChangeText={text => {
                this.setState({ newDeviceID: text });
              }}
            />
          </View>
          <Button
            buttonStyle={{
              width: "50%",
              alignSelf: "center",
              marginBottom: 40,
              marginTop: 20
            }}
            type="outline"
            title="Pair"
            onPress={this.pairDevice}
          />
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
          <View style={{ height: 220 }} />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.userId
});

const mapDispatchToProps = dispatch => ({
  setUserId: id => {
    const action = setUserId(id);
    dispatch(action);
  },
  resetState: () => {
    const action = resetState();
    dispatch(action);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RaspberryPi);
