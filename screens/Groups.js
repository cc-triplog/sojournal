import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Image,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import GroupCard from "../components/GroupCard";
import CreateGroup from "../components/CreateGroup";
import axios from "axios";
import moment from "moment";
import { SimpleLineIcons } from "react-native-vector-icons";

//Redux
import { connect } from "react-redux";
import {
  setUserId,
  toggleCreateGroupVisible,
  loadGroupsToState,
  resetState
} from "../action";

class Groups extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <Image
        style={{ width: 100, height: 40, marginLeft: 20 }}
        source={require("../assets/images/sojournal_black.png")}
      />
    ),
    headerRight: (
      <TouchableOpacity onPress={navigation.getParam("logOut")}>
        <SimpleLineIcons
          name="logout"
          size={30}
          style={{ marginRight: 30, marginTop: 8 }}
        />
      </TouchableOpacity>
    )
  });

  deleteGroup = async id => {
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation{
            DestroyGroup(input: {
            id: ${id}
            userId: ${this.props.userId}
            })
          }`
      }
    }).then(() => this.loadGroups());
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

  logOut = () => {
    this.props.screenProps.logOut();
    this.props.resetState();
  };

  renderOnMapFiltered = (title, startDate, endDate, groupId) => {
    this.props.navigation.navigate("Map", {
      title,
      startDate,
      endDate,
      groupId
    });
  };

  renderOnMapAll = () => {
    this.props.navigation.navigate("Map", {
      title: "All Pictures",
      startDate: null,
      endDate: null,
      groupId: null
    });
  };

  timeConvert = time => {
    const epoch = Number(time);
    return moment(epoch).format("MMM DD YY");
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
            onPress={() => this.renderOnMapAll()}
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
            deleteGroup={() => {
              this.deleteGroup(group.id);
            }}
            groupTitle={group.title}
            groupDescription={group.comment}
            groupStartDate={this.timeConvert(group.startTime)}
            groupEndDate={this.timeConvert(group.endTime)}
            renderOnMapFiltered={() =>
              this.renderOnMapFiltered(
                group.title,
                group.startTime,
                group.endTime,
                group.id
              )
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
  logOutButton: {
    marginRight: 10
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
