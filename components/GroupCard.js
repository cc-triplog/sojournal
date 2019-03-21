import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Card, Button } from "react-native-elements";

export default class GroupCard extends React.Component {
  render() {
    return (
      <View>
        <Card containerStyle={styles.card} title="Trip to North Korea">
          <View style={styles.dateContainer}>
            <Text style={styles.date}>Mar 12, 2015 to Mar 19, 2015</Text>
            <TouchableOpacity onPress={() => console.log("change date")}>
              <Text style={styles.changeDate}>Change</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.description}
            defaultValue={"I was not deported"}
            onChangeText={text => {
              console.log("state is being updated");
            }}
          />
          <View style={styles.buttonContainer}>
            <Button
              backgroundColor="#03A9F4"
              buttonStyle={styles.button}
              title="View"
            />
            <Button
              backgroundColor="#03A9F4"
              buttonStyle={styles.button}
              title="Save"
            />
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: "#F5F5F5"
  },
  description: { marginBottom: 10 },
  date: {
    fontSize: 12,
    marginBottom: 10,
    color: "grey"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  button: {
    width: 100,
    height: 40
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  changeDate: {
    fontSize: 12,
    marginBottom: 10,
    color: "grey",
    textDecorationLine: "underline"
  }
});
