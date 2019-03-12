import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Permissions, Location, ImagePicker } from "expo";
import { AntDesign } from "react-native-vector-icons";

import axios from "axios";

import styles from "../components/styles";
import CaptureView from "../components/CaptureView";
import CaptureToolbar from "../components/CaptureToolbar";
import CommentModal from "../components/CommentModal";

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    capture: null,
    imageView: false,
    modalVisible: false
  };

  checkPermissions = async () => {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const hasCameraPermission = camera.status === "granted";

    const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const hasCameraRollPermission = cameraRoll.status === "granted";

    const location = await Permissions.askAsync(Permissions.LOCATION);
    const hasLocationPermission = location.status === "granted";

    return (
      hasCameraPermission && hasCameraRollPermission && hasLocationPermission
    );
  };

  getDateFromAndroidCamera = input => {
    const separators = new RegExp("[: ]", "g");
    return new Date(...input.split(separators)).getTime();
  };

  launchCamera = async () => {
    if (this.checkPermissions) {
      await ImagePicker.launchCameraAsync({
        base64: true,
        exif: true
      }).then(res => {
        if (!res.cancelled) {
          let capture = {
            latitude: res.exif.GPSLatitude,
            longitude: res.exif.GPSLongitude,
            base64: res.base64,
            timestamp: this.getDateFromAndroidCamera(res.exif.DateTime),
            uri: res.uri
          };
          this.setState({ capture, imageView: true });
        }
      });
    }
  };

  launchLibrary = async () => {
    if (this.checkPermissions) {
      await ImagePicker.launchImageLibraryAsync({
        type: "Images",
        base64: true,
        exif: true
      }).then(res => {
        if (!res.cancelled) {
          let capture = {
            latitude: res.exif.GPSLatitude,
            longitude: res.exif.GPSLongitude,
            base64: res.base64,
            timestamp: this.getDateFromAndroidCamera(res.exif.DateTime),
            uri: res.uri
          };
          this.setState({ capture, imageView: true });
        }
      });
    }
  };

  trashPicture = () => {
    this.setState({ imageView: false, capture: {} });
  };

  uploadPicture = async () => {
    const { capture } = this.state;

    axios({
      url: "http://192.168.10.95:4000/graphql",
      method: "post",
      data: {
        query: `mutation
          {CreatePhoto(
            input:{
              imageFile:${JSON.stringify(capture.base64)}
              longitude:${capture.longitude}
              latitude: ${capture.latitude}
              createdAt: "${capture.timestamp}"
              comment: "${capture.comment}"
          })}`
      }
    }).then(() => this.setState({ imageView: false }));
  };

  addStory = () => {
    this.setModalVisible();
  };
  setModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  setComment = comment => {
    const current = this.state.capture;
    current.comment = comment;
    this.setState({ capture: current });
    this.setModalVisible();
  };

  async componentDidMount() {}

  render() {
    const { capture, imageView, modalVisible } = this.state;
    return imageView === true ? (
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
            setComment={this.setComment}
            saved={this.state.capture.comment}
          />
        ) : null}
      </React.Fragment>
    ) : (
      <View style={styles.choicePage}>
        <TouchableOpacity
          style={styles.choiceButtons}
          onPress={this.launchCamera}
        >
          <AntDesign name="camera" color="white" size={100} />
          <Text>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.choiceButtons}
          onPress={this.launchLibrary}
        >
          <AntDesign name="picture" color="white" size={100} />
          <Text>Pick Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
