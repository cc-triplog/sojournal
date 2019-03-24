import React from "react";
import {
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  TextInput,
  Text,
  Dimensions
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Entypo } from "react-native-vector-icons";

//Redux:
import { connect } from "react-redux";
import { setTitle, setComment } from "../action";

class CommentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comment: "", title: "" };
  }
  setCommentAndTitle = () => {
    this.props.setComment(this.state.comment);
    this.props.setTitle(this.state.title);
    this.props.setModalVisible();
  };

  render() {
    const { modalVisible, setModalVisible } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View elevation={5} style={styles.commentBox}>
          <View style={styles.inputCard}>
            <Text style={styles.inputTitle}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Name your story here ..."
              onChangeText={title => this.setState({ title })}
            />
            <Text style={styles.inputTitle}>Comment</Text>
            <TextInput
              style={styles.input}
              multiline={true}
              autocapitalize={"sentences"}
              placeholder="Tell your story here ..."
              onChangeText={comment => this.setState({ comment })}
            />
          </View>
          <Grid style={styles.commentToolbar}>
            <Row>
              <Col style={styles.alignCenter}>
                <TouchableOpacity onPress={setModalVisible}>
                  <Entypo name="cross" color="black" size={40} />
                </TouchableOpacity>
              </Col>
              <Col style={styles.alignCenter}>
                <TouchableOpacity onPress={() => this.setCommentAndTitle()}>
                  <Entypo name="check" color="black" size={35} />
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        </View>
      </Modal>
    );
  }
}

const { width: winWidth, height: winHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  inputCard: {
    marginTop: 20,
    width: "80%"
  },
  inputTitle: {
    color: "grey"
  },
  input: {
    fontSize: 16,
    marginBottom: 10
  },
  commentBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: winHeight * 0.6,
    minHeight: winHeight * 0.4,
    width: winWidth * 0.75,
    marginLeft: winWidth * 0.125,
    marginRight: winWidth * 0.125,
    marginTop: winHeight * 0.125,
    marginBottom: winHeight * 0.275,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 25
  },
  commentToolbar: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    height: 100,
    bottom: 0
  },
  alignCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setTitle: title => {
    const action = setTitle(title);
    dispatch(action);
  },
  setComment: comment => {
    const action = setComment(comment);
    dispatch(action);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentModal);
