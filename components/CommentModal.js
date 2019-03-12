import React from "react";
import { TouchableOpacity, View, Modal, TextInput } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Entypo } from "react-native-vector-icons";

import styles from "./styles";

export default class CommentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }
  render() {
    const { modalVisible, setModalVisible, setComment, saved } = this.props;
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
          <View style={styles.commentInput}>
            <TextInput
              multiline={true}
              autocapitalize={"sentences"}
              placeholder="Tell your story here ..."
              onChangeText={text => this.setState({ text })}
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
                <TouchableOpacity onPress={() => setComment(this.state.text)}>
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
