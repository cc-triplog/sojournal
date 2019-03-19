import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import reducer from "./reducer/index";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import axios from "axios";

import { withAuthenticator } from "aws-amplify-react-native";
import Amplify from "@aws-amplify/core";
import config from "./aws-exports";
Amplify.configure(config);

const store = createStore(reducer);

class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  userExists = async user => {
    let exists = null;
    await axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `query
        {
          ReadUser(type: {email: "${user}"}) {
          id
          }
      }`
      }
    }).then(res => {
      exists = res.data.data.ReadUser.length > 0;
    });
    return exists;
  };

  createUser = async (email, name) => {
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation
          {CreateUser(
            input:{
              email:"${email}"
              name:"${name}"
          })}`
      }
    });
  };

  async componentDidMount() {
    if (this.props.authState === "signedIn") {
      const exists = await this.userExists(
        this.props.authData.attributes.email
      );
      if (!exists) {
        await this.createUser(
          this.props.authData.attributes.email,
          this.props.authData.attributes.sub
        );
      } else return;
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

export default withAuthenticator(App, { includeGreetings: true });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
