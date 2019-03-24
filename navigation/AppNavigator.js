import React from "react";
import { AsyncStorage } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";

import { connect } from "react-redux";
import { setUserId } from "../action";

const AppNavigator = createAppContainer(
  createSwitchNavigator({
    Main: MainTabNavigator
  })
);

class AppContainer extends React.Component {
  async componentDidMount() {
    await AsyncStorage.getItem("id").then(res => {
      this.props.setUserId(res);
    });
  }
  render() {
    return <AppNavigator />;
  }
}

const mapDispatchToProps = dispatch => ({
  setUserId: id => {
    const action = setUserId(id);
    dispatch(action);
  }
});

export default connect(
  null,
  mapDispatchToProps
)(AppContainer);
