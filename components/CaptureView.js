import React from "react";
import { View, Image, Dimensions, TextInput } from "react-native";
import CaptureToolbar from "./CaptureToolbar";

import styles from "./styles";

export default ({ capture, trashPicture, uploadPicture, addStory }) => (
  <View>
    <Image source={{ uri: capture.uri }} style={styles.preview} />
  </View>
);
