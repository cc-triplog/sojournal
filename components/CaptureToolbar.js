import React from "react";
import { Col, Row, Grid } from "react-native-easy-grid";
import { TouchableOpacity } from "react-native";

import styles from "./styles";
import { Octicons } from "react-native-vector-icons";

export default ({ trashPicture, uploadPicture, addStory }) => (
  <Grid style={styles.bottomToolbar}>
    <Row>
      <Col style={styles.alignCenter}>
        <TouchableOpacity onPress={() => uploadPicture()}>
          <Octicons name="cloud-upload" color="white" size={40} />
        </TouchableOpacity>
      </Col>
      <Col style={styles.alignCenter}>
        <TouchableOpacity onPress={() => addStory()}>
          <Octicons name="pencil" color="white" size={40} />
        </TouchableOpacity>
      </Col>
      <Col style={styles.alignCenter}>
        <TouchableOpacity onPress={() => trashPicture()}>
          <Octicons name="trashcan" color="white" size={40} />
        </TouchableOpacity>
      </Col>
    </Row>
  </Grid>
);
