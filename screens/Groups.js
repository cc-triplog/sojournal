import React from "react";
import { ScrollView, StyleSheet, View, Text, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import GroupCard from "../components/GroupCard";
import CreateGroup from "../components/CreateGroup";
import axios from "axios";
import moment from "moment";
import { Auth } from "aws-amplify";

//Redux
import { connect } from "react-redux";
import {
  setUserId,
  toggleCreateGroupVisible,
  loadGroupsToState,
  resetState
} from "../action";

class Groups extends React.Component {
  // static navigationOptions = () => {
  //   headerTitle: "Sojournal",
  //   headerRight: (
  //     <Button onPress={navigation.getParam("logOut")} title="Log Out" />
  //   )
  // };

  static navigationOptions = ({ navigation }) => ({
    headerTitle: "Sojournal",
    headerRight: (
      <Button onPress={navigation.getParam("logOut")} title="Log Out" />
    )
  });

  logOut = () => {
    Auth.signOut().then(() => {
      this.forceUpdate();
    });
  };
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
  renderOnMap = (title, startDate, endDate) => {
    this.props.navigation.navigate("Map", {
      title,
      startDate,
      endDate
    });
  };

  logOut = () => {
    this.props.screenProps.logOut();
    this.props.resetState();
  };

  async componentDidMount() {
    this.props.navigation.setParams({
      logOut: this.logOut
    });
    await AsyncStorage.getItem("id")
      .then(res => {
        this.props.setUserId(res);
      })
      .then(() => this.loadGroups());
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.viewAllButton}
            title="All Memories"
            onPress={() => this.props.navigation.navigate("Map")}
          />
          <Text style={styles.myTripsHeader}> My Trips </Text>
        </View>
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
            renderOnMap={() =>
              this.renderOnMap(group.title, group.startTime, group.endTime)
            }
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
  },
  viewAllButton: {
    width: 150,
    height: 40,
    backgroundColor: "#BA55D3",
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 50
  },
  myTripsHeader: {
    fontSize: 16,
    marginBottom: 20
  }
});

const mapStateToProps = state => ({
  createGroupVisible: state.createGroupVisible,
  userId: state.userId,
  pictureGroups: state.pictureGroups
});

const mapDispatchToProps = dispatch => ({
  setUserId: id => {
    const action = setUserId(id);
    dispatch(action);
  },
  toggleCreateGroupVisible: () => {
    const action = toggleCreateGroupVisible();
    dispatch(action);
  },
  loadGroupsToState: groups => {
    const action = loadGroupsToState(groups);
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
)(Groups);
