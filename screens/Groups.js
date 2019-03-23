import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import GroupCard from "../components/GroupCard";
import CreateGroup from "../components/CreateGroup";
import axios from "axios";
import moment from "moment";

//Redux
import { connect } from "react-redux";
import { toggleCreateGroupVisible, loadGroupsToState } from "../action";

class Groups extends React.Component {
  timeConvert = time => {
    const epoch = Number(time);
    return moment(epoch).format("MMM DD YY");
  };
  loadGroups = async () => {
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

  async componentDidMount() {
    this.loadGroups().then(() => console.log(this.props.pictureGroups));
  }
  render() {
    return (
      <ScrollView>
        {this.props.createGroupVisible ? (
          <CreateGroup toggleVisible={this.props.toggleCreateGroupVisible} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={styles.button}
              title="Create New"
              onPress={this.props.toggleCreateGroupVisible}
            />
          </View>
        )}
        {this.props.pictureGroups.reverse().map(group => (
          <GroupCard
            key={group.id}
            groupTitle={group.title}
            groupDescription={group.comment}
            groupStartDate={this.timeConvert(group.startTime)}
            groupEndDate={this.timeConvert(group.endTime)}
          />
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 40,
    backgroundColor: "#008080",
    marginTop: 10,
    borderRadius: 50
  },
  buttonContainer: {
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  createGroupVisible: state.createGroupVisible,
  userId: state.userId,
  pictureGroups: state.pictureGroups
});

const mapDispatchToProps = dispatch => ({
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
)(Groups);
