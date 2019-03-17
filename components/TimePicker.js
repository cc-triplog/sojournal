import React from "react";
import { Picker, View, Text } from "react-native";
import { Button } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";

import styles from "./styles";

export default ({
  selectedHours,
  selectedMinutes,
  selectedSeconds,
  updateHours,
  updateMinutes,
  updateSeconds,
  target,
  handleUpdate
}) => (
  <View>
    <Grid>
      <Col style={{ alignItems: "center" }}>
        <Text style={{ marginTop: 14, fontSize: 17, color: "grey" }}>
          Hours
        </Text>
        <Text style={{ marginTop: 26, fontSize: 17, color: "grey" }}>
          Minutes
        </Text>
        <Text style={{ marginTop: 26, fontSize: 17, color: "grey" }}>
          Seconds
        </Text>
      </Col>
      <Col>
        <Picker
          selectedValue={selectedHours}
          onValueChange={handleUpdate(target + "Hours")}
          prompt="Hours"
          mode="dropdown"
          style={styles.picker}
        >
          {[...Array(25).keys()].map(num => (
            <Picker.Item label={num.toString()} value={num} key={num} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMinutes}
          onValueChange={handleUpdate(target + "Minutes")}
          prompt="Minutes"
          mode="dropdown"
          style={styles.picker}
        >
          {[...Array(60).keys()].map(num => (
            <Picker.Item label={num.toString()} value={num} key={num} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedSeconds}
          onValueChange={handleUpdate(target + "Seconds")}
          prompt="Seconds"
          mode="dropdown"
          style={styles.picker}
        >
          {[...Array(60).keys()].map(num => (
            <Picker.Item label={num.toString()} value={num} key={num} />
          ))}
        </Picker>
      </Col>
    </Grid>
  </View>
);
