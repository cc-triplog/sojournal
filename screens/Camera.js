import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  Image
} from "react-native";
import { Permissions, Location, ImagePicker } from "expo";
//Styling
import { AntDesign, SimpleLineIcons } from "react-native-vector-icons";

import axios from "axios";

//Components
import CaptureView from "../components/CaptureView";
import CaptureToolbar from "../components/CaptureToolbar";
import CommentModal from "../components/CommentModal";

//Redux
import { connect } from "react-redux";
import {
  setCapture,
  setUserId,
  reflectStateChange,
  resetState
} from "../action";

class CameraPage extends React.Component {
  camera = null;

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
  state = {
    imageView: false,
    modalVisible: false,
    isLoading: false
  };

  getDateFromCamera = input => {
    const separators = new RegExp("[: ]", "g");
    if (!input) return new Date().getTime();
    const separatedDate = [...input.split(separators)].map(input =>
      parseInt(input)
    );
    separatedDate[1] = separatedDate[1] - 1;
    const output = new Date(...separatedDate).getTime();
    return output;
  };

  launchCamera = async () => {
    this.setState({ isLoading: true });
    await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL,
      Permissions.LOCATION
    )
      .then(async res => {
        if (res.status !== "granted") {
          return alert(
            "The application needs access to your camera and current location in order to take photos and geo-locate them for your use."
          );
        } else {
          await ImagePicker.launchCameraAsync({
            base64: true,
            exif: true
          }).then(async res => {
            let capture;
            if (res.cancelled) {
              this.setState({ isLoading: false });
            }
            if (!res.cancelled) {
              const location = await Location.getCurrentPositionAsync({});
              latitude = res.exif.GPSLatitude || location.coords.latitude;
              longitude = res.exif.GPSLongitude || location.coords.longitude;
              capture = {
                latitude: res.exif.GPSLatitude || location.coords.latitude,
                longitude: res.exif.GPSLongitude || location.coords.latitude,
                base64: res.base64,
                timestamp: this.getDateFromCamera(res.exif.DateTime),
                uri: res.uri
              };
              this.props.setCapture(capture);
              this.setState({ imageView: true, isLoading: false });
            }
          });
        }
      })
      .catch(error => {
        throw error;
      });
  };

  launchLibrary = async () => {
    this.setState({ isLoading: true });
    await Permissions.askAsync(Permissions.CAMERA_ROLL).then(async res => {
      if (res.status === "granted") {
        await ImagePicker.launchImageLibraryAsync({
          type: "Images",
          base64: true,
          exif: true
        }).then(async res => {
          let capture;
          if (res.cancelled) {
            this.setState({ isLoading: false });
          }
          if (!res.cancelled) {
            if (Platform.OS === "ios") {
              const location = await Location.getCurrentPositionAsync({});
              capture = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                base64: res.base64,
                timestamp: this.getDateFromCamera(res.exif.DateTimeDigitized),
                uri: res.uri
              };
            } else {
              capture = {
                latitude: res.exif.GPSLatitude,
                longitude: res.exif.GPSLongitude,
                base64: res.base64,
                timestamp: this.getDateFromCamera(res.exif.DateTime),
                uri: res.uri
              };
              console.log(capture.timestamp);
            }
            this.props.setCapture(capture);
            this.setState({ imageView: true, isLoading: false });
          }
        });
      } else {
        alert("Access to the library is required in order to upload a photo.");
      }
    });
  };

  trashPicture = () => {
    this.props.setCapture({});
    this.setState({ imageView: false, isLoading: false });
  };

  uploadPicture = async () => {
    const { capture } = this.props;
    this.setState({ isLoading: true });

    axios({
      url:
        "http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql",
      method: "post",
      data: {
        query: `mutation
          {CreatePhoto(
            input:{
              userId: ${this.props.userId}
              imageFile:${JSON.stringify(capture.base64)}
              longitude:${capture.longitude}
              latitude: ${capture.latitude}
              createdAt: "${capture.timestamp}"
              comment: "${capture.comment || "Comment your picture"}"
              title: "${capture.title || "Name your picture"}"
          })}`
      }
    }).then(() => {
      this.setState({ imageView: false, isLoading: false });
      this.props.screenProps.rerender();
    });
  };

  addStory = () => {
    this.setModalVisible();
  };
  setModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  setComment = comment => {
    const current = this.props.capture;
    current.comment = comment;
    this.props.setCapture(current);
    this.setModalVisible();
  };
  logOut = () => {
    this.props.screenProps.logOut();
    this.props.resetState();
  };

  async componentDidMount() {
    this.props.navigation.setParams({
      logOut: this.logOut
    });
    await AsyncStorage.getItem("id").then(res => {
      this.props.setUserId(res);
    });
  }

  render() {
    const { capture } = this.props;
    const { imageView, modalVisible, isLoading } = this.state;

    return imageView === true ? (
      isLoading ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size={100} color="#82bfff" />
        </View>
      ) : (
          <React.Fragment>
            <CaptureView capture={capture} />

            <CaptureToolbar
              trashPicture={this.trashPicture}
              uploadPicture={this.uploadPicture}
              addStory={this.addStory}
            />
            {modalVisible ? (
              <CommentModal
                modalVisible={modalVisible}
                setModalVisible={this.setModalVisible}
              />
            ) : null}
          </React.Fragment>
        )
    ) : isLoading ? (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size={100} color="#82bfff" />
      </View>
    ) : (
          <View style={styles.choicePage}>
            <TouchableOpacity
              style={styles.choiceButtons}
              onPress={this.launchCamera}
            >
              <AntDesign name="camera" color="black" size={100} />
              <Text style={styles.commandText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.choiceButtons}
              onPress={this.launchLibrary}
            >
              <AntDesign name="picture" color="black" size={100} />
              <Text style={styles.commandText}>Pick Photo</Text>
            </TouchableOpacity>
          </View>
        );
  }
}

const { width: winWidth, height: winHeight } = Dimensions.get("window");
const styles = StyleSheet.create({
  choicePage: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",
    height: winHeight,
    width: winWidth
  },
  choiceButtons: {
    justifyContent: "center",
    backgroundColor: "#82bfff",
    width: 150,
    height: 150,
    alignItems: "center",
    borderRadius: 50
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  commandText: {
    fontWeight: "bold"
  }
});

const mapStateToProps = state => ({
  capture: state.capture,
  userId: state.userId
});

const mapDispatchToProps = dispatch => ({
  setCapture: capture => {
    const action = setCapture(capture);
    dispatch(action);
  },
  setUserId: id => {
    const action = setUserId(id);
    dispatch(action);
  },
  reflectStateChange: change => {
    const action = reflectStateChange(change);
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
)(CameraPage);
