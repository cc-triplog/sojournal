import React from "react";
import {
  AppRegistry,
  Animated,
  Button,
  Dimensions,
  Image,
  Platform,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import './styles'
import { Overlay } from 'react-native-elements';
import { WebBrowser, Component } from "expo";
import { getTheme } from 'react-native-material-kit';
import MapView from "react-native-maps";
import { MonoText } from "../components/StyledText";
import axios from 'axios';
import { connect } from 'react-redux';
import { renderPhotos, changeCardVisibility, selectImageCard } from '../action';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

let modalContent;


class PopupCard extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
  }

  onPressImageCard () {
    this.props.changeCardVisibility(false)
    console.log("=======is the prop changing", this.props.visible)
  }

  render() {

    return (
      <Overlay isVisible={this.props.visible} 
      windowBackgroundColor="rgba(255,255,255, .5)"
      overlayBackgroundColor="#fff"
      >
        <View>
            <View style={[theme.cardImageStyle, styles.popupContent]}>
                    <Image source={this.props.markers[this.props.selectedImage].image} style={styles.popUpImage} />
            </View>
            <TextInput style={theme.cardContentStyle} value={this.props.markers[this.props.selectedImage].title} />
            <TextInput style={theme.cardContentStyle} value={this.props.markers[this.props.selectedImage].description} />
            <Button onPress={() => {this.onPressImageCard()}} title="EXIT" color="#841584" accessibilityLabel="exit" />
        </View>
      </Overlay>
    );
  }
}

const theme = getTheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  map: {
    height: 100,
    flex: 1
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  popupCard: {
    padding: 10,
    elevation: 2,
    backgroundColor: "transparent",
    marginBottom: 80,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT * 2,
    width: CARD_WIDTH * 2,
    overflow: "visible",
  },

  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  popUpCard: {
    marginTop: 30,
  },
  popUpImage: {
    flex: 1,
  },
  popUpModal: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    width: CARD_HEIGHT * 2,
    height: CARD_HEIGHT * 2,
    overflow: "visible",
  },
  textInputPopup: {
    width: "100%",
    height: "50%"
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  enlargedPhoto: {
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignItems: 'center',
    height: "80%",
    width: "80%",
  },
})

const mapStateToProps = state => ({
  markers: state.markers,
  region: state.region,
  visible: state.visible,
  selectedImage: state.selectedImage
})

const mapDispatchToProps = dispatch => ({
    changeCardVisibility: visibility => {
        const action = changeCardVisibility(visibility)
        dispatch(action)
        },
    selectImageCard: index => {
    const action = selectImageCard(index)
    dispatch(action)
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(PopupCard)