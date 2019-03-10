import React from "react";
import { View, Text, TouchableHighlight, Alert, Modal } from "react-native";
import { Camera, Permissions, Location } from "expo";

import styles from "../components/styles";
import Toolbar from "../components/CameraToolbar";
import CaptureView from "../components/CaptureView";
import CaptureToolbar from "../components/CaptureToolbar";

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    captures: [],
    flashMode: Camera.Constants.FlashMode.off,
    autofocus: Camera.Constants.AutoFocus.on,
    capturing: null,
    cameraType: Camera.Constants.Type.back,
    hasCameraPermission: null,
    hasLocationPermission: null,
    capture: {},
    imageView: false
  };

  setFlashMode = flashMode => this.setState({ flashMode });
  setCameraType = cameraType => this.setState({ cameraType });
  handleCaptureIn = () => this.setState({ capturing: true });
  handleShortCapture = async () => {
    const photoData = await this.camera.takePictureAsync({
      base64: true
    });
    const location = await Location.getCurrentPositionAsync({});

    photoData.geolocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
    photoData.timestamp = location.timestamp;

    this.setState({
      capturing: false,
      capture: photoData,
      imageView: true
    });
  };

  trashPicture = () => {
    this.setState({ imageView: false, capture: {} });
  };

  uploadPicture = () => {
    console.log(this.state.capture);
  };

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const hasCameraPermission = camera.status === "granted";

    const location = await Permissions.askAsync(Permissions.LOCATION);
    const hasLocationPermission = location.status === "granted";

    this.setState({ hasCameraPermission, hasLocationPermission });
  }

  render() {
    const {
      hasCameraPermission,
      hasLocationPermission,
      flashMode,
      cameraType,
      capturing,
      capture,
      autofocus,
      imageView
    } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    }

    if (hasLocationPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to location has been denied.</Text>;
    }

    return imageView ? (
      <React.Fragment>
        <Modal style={{ height: 100, width: 100 }} isVisible={true}>
          <View>
            <Text>I am the modal content!</Text>
          </View>
        </Modal>

        <CaptureView capture={capture} />

        <CaptureToolbar
          trashPicture={this.trashPicture}
          uploadPicture={this.uploadPicture}
          addStory={this.addStory}
        />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <View>
          <Camera
            type={cameraType}
            flashMode={flashMode}
            autoFocus={autofocus}
            style={styles.preview}
            ref={camera => (this.camera = camera)}
          />
        </View>
        {/* {captures.length > 0 && <Gallery captures={captures} />} */}
        <Toolbar
          capturing={capturing}
          flashMode={flashMode}
          cameraType={cameraType}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onCaptureIn={this.handleCaptureIn}
          onCaptureOut={this.handleCaptureOut}
          onLongCapture={this.handleLongCapture}
          onShortCapture={this.handleShortCapture}
        />
      </React.Fragment>
    );
  }
}

// import React from "react";
// import { Button, Image, View } from "react-native";
// import { ImagePicker, Permissions } from "expo";
// import { requestPermissionsAsync } from "expo-location";

// export default class ImagePickerExample extends React.Component {
//   state = {
//     image: null
//   };

//   render() {
//     let { image } = this.state;

//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Button
//           title="Pick an image from camera roll"
//           onPress={this._pickImage}
//         />
//         {image && (
//           <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
//         )}
//       </View>
//     );
//   }

//   _pickImage = async () => {
//     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
//     if (status === "granted") {
//       ImagePicker.launchImageLibraryAsync({
//         allowsEditing: true,
//         aspect: [1, 1],
//         exif: true,
//         base64: true
//       })
//         .then(selectedImage => {
//           if (!selectedImage.cancelled) {
//             console.log(JSON.stringify(selectedImage.exif));
//           }
//         })
//         .catch(err => console.log(err));
//     }
//   };
// }
