import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Platform, TouchableOpacity } from "react-native";

import styles from "./styles";
import { Octicons } from "react-native-vector-icons";

export default ({ trashPicture, uploadPicture, addStory }) => (
  <Grid style={styles.bottomToolbar}>
    <Row>
      <Col style={styles.alignCenter}>
        <TouchableOpacity onPress={() => uploadPicture()}>
          <Ionicons
            name={
              Platform.OS === "ios" ? "ios-cloud-upload" : "md-cloud_upload"
            }
            color="white"
            size={40}
          />
        </TouchableOpacity>
      </Col>
      <Col style={styles.alignCenter}>
        <TouchableOpacity onPress={() => addStory()}>
          <Octicons name="pencil" color="white" size={50} />
        </TouchableOpacity>
      </Col>
      <Col style={styles.alignCenter}>
        <TouchableOpacity onPress={() => trashPicture()}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-trash" : "md-delete"}
            color="white"
            size={40}
          />
        </TouchableOpacity>
      </Col>
    </Row>
  </Grid>
);
