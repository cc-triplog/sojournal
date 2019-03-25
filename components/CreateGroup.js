import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button, Card } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import axios from "axios";

//Redux
import { connect } from "react-redux";
import {
  toggleGroupDatePickerVisible,
  setGroupStartDate,
  setGroupEndDate,
  setGroupTitle,
  setGroupDescription,
  toggleCreateGroupVisible,
  loadGroupsToState
} from "../action";

class CreateGroup extends React.Component {
  state = {
    currentlySetting: ""
  };
  _showDatePicker = target => {
    this.setState({ currentlySetting: target });
    this.props.toggleGroupDatePickerVisible();
  };
  _handleDatePicked = date => {
    this.state.currentlySetting === "start"
      ? this.props.setGroupStartDate(date)
      : this.props.setGroupEndDate(date);
    this.props.toggleGroupDatePickerVisible();
  };
  handleSave = async () => {
    this.uploadGroup().then(() => {
      this.props.toggleCreateGroupVisible();
      this.resetFields();
      this.reload();
    });
  };

  resetFields = () => {
    this.props.setGroupTitle("");
    this.props.setGroupDescription("");
    this.props.setGroupEndDate("");
    this.props.setGroupStartDate("");
  };

  reload = () => {
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `query {
          ReadGroup(type: {userId: ${this.props.userId}}) {
            id, title, comment, startTime, endTime
            }
          }`
      }
    }).then(res => {
      this.props.loadGroupsToState(res.data.data.ReadGroup);
    });
  };
  uploadGroup = async () => {
    const {
      groupEndDate,
      groupStartDate,
      groupTitle,
      groupDescription,
      userId
    } = this.props;
    await axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation{
          CreateGroup(input: {
            userId: ${userId}
            title: "${groupTitle}"
            comment: "${groupDescription}"
            startTime: "${moment(groupStartDate).format("YYYY-MM-DD")}"
            endTime: "${moment(groupEndDate).format("YYYY-MM-DD")}"
            })
          }`
      }
    });
  };

  render() {
    const {
      groupEndDate,
      groupStartDate,
      setGroupTitle,
      setGroupDescription,
      toggleCreateGroupVisible
    } = this.props;
    return (
      <Card title="Create Trip">
        <Text
          onChangeText={text => setGroupTitle(text)}
          style={styles.inputTitle}
        >
          {" "}
          Title{" "}
        </Text>
        <TextInput
          style={styles.title}
          placeholder="Title"
          onChangeText={text => setGroupTitle(text)}
        />
        <Text style={styles.inputTitle}> Description </Text>
        <TextInput
          style={styles.description}
          placeholder="Description"
          multiline={true}
          onChangeText={text => setGroupDescription(text)}
        />
        <Text style={styles.inputTitle}> Date Range </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Start Date"
            buttonStyle={styles.button}
            onPress={() => this._showDatePicker("start")}
          />
          <Button
            title={
              groupStartDate
                ? moment(groupStartDate).format("MMMM DD, YYYY")
                : ""
            }
            type="outline"
            buttonStyle={styles.button}
            disabled={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="End Date"
            buttonStyle={styles.button}
            onPress={() => this._showDatePicker("end")}
          />
          <Button
            title={
              groupEndDate ? moment(groupEndDate).format("MMMM DD, YYYY") : ""
            }
            type="outline"
            buttonStyle={styles.button}
            disabled={true}
          />
        </View>
        <DateTimePicker
          mode="date"
          isVisible={this.props.groupDatePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this.props.toggleGroupDatePickerVisible}
        />
        <View style={styles.buttonContainerBottom}>
          <Button
            buttonStyle={styles.buttonBottom}
            title="Save"
            onPress={this.handleSave}
          />
          <Button
            buttonStyle={styles.buttonBottom}
            title="Cancel"
            onPress={toggleCreateGroupVisible}
          />
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 140,
    height: 40,
    marginTop: 20
  },
  buttonBottom: {
    width: 140,
    height: 40,
    marginTop: 20,
    backgroundColor: "#008080"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainerBottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50
  },
  description: {
    marginLeft: 10,
    marginBottom: 75
  },
  inputTitle: {
    fontSize: 10
  },
  title: {
    marginLeft: 10
  }
});

const mapStateToProps = state => ({
  groupDatePickerVisible: state.groupDatePickerVisible,
  groupStartDate: state.groupStartDate,
  groupEndDate: state.groupEndDate,
  groupTitle: state.groupTitle,
  groupDescription: state.groupDescription,
  userId: state.userId
});

const mapDispatchToProps = dispatch => ({
  toggleGroupDatePickerVisible: () => {
    const action = toggleGroupDatePickerVisible();
    dispatch(action);
  },
  setGroupStartDate: date => {
    const action = setGroupStartDate(date);
    dispatch(action);
  },
  setGroupEndDate: date => {
    const action = setGroupEndDate(date);
    dispatch(action);
  },
  setGroupDescription: text => {
    const action = setGroupDescription(text);
    dispatch(action);
  },
  setGroupTitle: text => {
    const action = setGroupTitle(text);
    dispatch(action);
  },
  toggleCreateGroupVisible: () => {
    const action = toggleCreateGroupVisible();
    dispatch(action);
  },
  loadGroupsToState: groups => {
    const action = loadGroupsToState(groups);
    dispatch(action);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGroup);
