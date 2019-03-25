import React from "react";
import Root from "./Root.js";
import { AsyncStorage } from "react-native";

export default class AuthWrapper extends React.Component {
  rerender = () => {
    this.forceUpdate();
  };
  render() {
    return <Root rerender={this.rerender} />;
  }
}
