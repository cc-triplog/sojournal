import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import GroupCard from "../components/GroupCard";
import CreateGroup from "../components/CreateGroup";

//Redux
import { connect } from "react-redux";
import { toggleCreateGroupVisible } from "../action";

class Groups extends React.Component {
  render() {
    return (
      <ScrollView>
        {this.props.createGroupVisible ? (
          <CreateGroup toggleVisible={this.props.toggleCreateGroupVisible} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={styles.button}
              title="Create New"
              onPress={this.props.toggleCreateGroupVisible}
            />
          </View>
        )}
        <GroupCard />
        <GroupCard />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 40,
    backgroundColor: "#008080",
    marginTop: 10,
    borderRadius: 50
  },
  buttonContainer: {
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  createGroupVisible: state.createGroupVisible
});

const mapDispatchToProps = dispatch => ({
  toggleCreateGroupVisible: () => {
    const action = toggleCreateGroupVisible();
    dispatch(action);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);
