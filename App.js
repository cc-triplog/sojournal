import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import reducer from "./reducer/index";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import axios from "axios";

import { withAuthenticator } from "aws-amplify-react-native";
import Amplify from "@aws-amplify/core";
import { Auth } from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

const logger = createLogger({
  predicate,
  collapsed,
  level = 'console',
  colors = ColorsObject,
  titleFomatter,
  logger = console,
})
const store = createStore(reducer, applyMiddleware(logger));

class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  getUser = async user => {
    let exists = false;
    let id = null;
    await axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `query
        {
          ReadUser(type: {cognitoId: "${user}"}) {
          id
          }
      }`
      }
    }).then(res => {
      if (res.data.data.ReadUser.length > 0) {
        exists = true;
        id = res.data.data.ReadUser[0]["id"];
      }
    });
    return { exists, id };
  };

  createUser = async cognitoId => {
    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation
          {CreateUser(
            input:{
              cognitoId:"${cognitoId}"
          })}`
      }
    });
  };

  createUserAndGetId = async cognitoId => {
    let id;
    await this.createUser(cognitoId)
      .then(async () => {
        const response = await this.getUser(cognitoId);
        return response.id;
      })
      .then(async res => {
        await AsyncStorage.setItem("id", JSON.stringify(res));
      });
  };

  async componentWillMount() {
    const currentUserInfo = await Auth.currentUserInfo();
    if (this.props.authState === "signedIn") {
      const loggedInUser = await this.getUser(currentUserInfo.attributes.sub);
      loggedInUser["exists"]
        ? await AsyncStorage.setItem("id", JSON.stringify(loggedInUser["id"]))
        : this.createUserAndGetId(this.props.authData.attributes.sub);
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

export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
