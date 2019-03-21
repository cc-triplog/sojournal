import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button, Card } from "react-native-elements";

export default () => (
  <Card title="Create Trip">
    <Text style={styles.inputTitle}> Title </Text>
    <TextInput style={styles.title} placeholder="Title" />
    <Text style={styles.inputTitle}> Description </Text>
    <TextInput
      style={styles.description}
      placeholder="Description"
      multiline={true}
    />
    <Text style={styles.inputTitle}> Date Range </Text>
    <View style={styles.buttonContainer}>
      <Button title="Start Date" buttonStyle={styles.button} />
      <Button type="outline" buttonStyle={styles.button} disabled={true} />
    </View>
    <View style={styles.buttonContainer}>
      <Button title="End Date" buttonStyle={styles.button} />
      <Button type="outline" buttonStyle={styles.button} disabled={true} />
    </View>
  </Card>
);

const styles = StyleSheet.create({
  button: {
    width: 140,
    height: 40,
    marginTop: 20
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  description: {
    marginLeft: 10,
    marginBottom: 75
  },
  inputTitle: {
    fontSize: 10
  },
  title: {
    marginLeft: 10
  }
});
