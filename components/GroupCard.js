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
    const {
      groupTitle,
      groupDescription,
      groupStartDate,
      groupEndDate
    } = this.props;

    return (
      <View>
        <Card containerStyle={styles.card} title={groupTitle}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {groupStartDate + " to " + groupEndDate}
            </Text>
            <TouchableOpacity onPress={() => console.log("change date")}>
              <Text style={styles.changeDate}>Change</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.description}
            defaultValue={groupDescription}
            onChangeText={text => {
              console.log("state is being updated");
            }}
          />
          <View style={styles.buttonContainer}>
            <Button
              backgroundColor="#03A9F4"
              buttonStyle={styles.button}
              title="View"
              onPress={this.props.renderOnMapFiltered}
            />
            <Button
              backgroundColor="#03A9F4"
              buttonStyle={styles.button}
              title="Delete"
              onPress={this.props.deleteGroup}
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
