import React from "react";
import {
  AppRegistry,
  Animated,
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
import { Button, Overlay } from 'react-native-elements';
import { WebBrowser, Component } from "expo";
import { getTheme } from 'react-native-material-kit';
import MapView from "react-native-maps";
import { MonoText } from "../components/StyledText";
import axios from 'axios';
import { connect } from 'react-redux';
import { 
  renderPhotos, 
  changeCardVisibility, 
  selectImageCard, 
  insertPhotoWithIndex, 
  deletePhoto,
  reflectStateChange,
  replaceAllMarkers 
} from '../action';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

let changedTitle
let changedDescription


class PopupCard extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
  }

  callDatabase() {
    axios({
      url: 'http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql',
      method: 'post',
      data: {
        query: `
        query {ReadPhoto(type: {
        }) {
         title, latitude, longitude, comment, imageFile, id
        }
      }
        `
      }
    }).then(result => {
      const http = "http://"
      const mapResult = result.data.data.ReadPhoto.map(object => (
      {
        coordinate: {
          latitude: Number(object.latitude),
          longitude: Number(object.longitude),
        },
        title: `${object.title}`,
        description: `${object.comment}`,
        image: { uri: `${http + object.imageFile}` },
        id: object.id,
      }
    ));
    return mapResult
    }).then(result => {
      this.props.replaceAllMarkers(result)
    }).then(result => {
      console.log("===============markers after upload",this.props.markers)
      this.props.changeCardVisibility(false);
    })
  }
  onChangeTextTitle (text) {
    this.changedTitle = text
  }
  onChangeTextDescription (text) {
    this.changedDescription = text
  }
  onPressExit () {
    this.props.changeCardVisibility(false)
    console.log("=======is the prop changing", this.props.visible)
  }
  onPressUpload () {
    axios({
      url: 'http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql',
      method: 'post',
      data: {
        query: `
        mutation {UpdatePhoto(input: {
          id:${this.props.markers[this.props.selectedImageIndex].id}
          title: "${this.changedTitle}",
          comment: "${this.changedDescription}"
        })
      }
        `
      }
    }).then(result => {
      const newPhotoData = {
        coordinate: {
          latitude: this.props.markers[this.props.selectedImageIndex].coordinate.latitude,
          longitude: this.props.markers[this.props.selectedImageIndex].coordinate.longitude,
        },
        title: this.changedTitle,
        description: this.changedDescription,
        image: this.props.markers[this.props.selectedImageIndex].image,
        id: this.props.markers[this.props.selectedImageIndex].id
      }
      const copyOfNewState = this.props.markers.map(photo => {
        if(photo.id === this.props.markers[this.props.selectedImageIndex].id) {
          photo = newPhotoData
        }
      })
      this.props.insertPhotoWithIndex(newPhotoData);
      this.props.deletePhoto(this.props.selectedImageIndex);
      this.props.reflectStateChange(!(this.props.stateChanged))
      this.props.changeCardVisibility(false)
    }).then(console.log("========after axios call", this.props.markers))
    
    // this.callDatabase()
}

  render() {

    return (
      <Overlay
      key={this.props.selectedImageIndex}
      isVisible={this.props.visible} 
      windowBackgroundColor="rgba(255,255,255, .5)"
      overlayBackgroundColor="#fff"
      fullScreen={false}
      style={styles.overlay}
      >
        <View style={styles.card}>
            <View style={styles.popupContent}>
                    <Image source={this.props.markers[this.props.selectedImageIndex].image} style={styles.popUpImage} />
            </View>
            <TextInput 
            style={styles.textTitle}
            onChangeText={(text) => {this.onChangeTextTitle(text)}} 
            defaultValue={this.props.markers[this.props.selectedImageIndex].title} />
            <View style={styles.textDescription}>
              <TextInput 
              multiline={true}
              style={theme.cardContentStyle}
              onChangeText={(text) => {this.onChangeTextDescription(text)}} 
              defaultValue={this.props.markers[this.props.selectedImageIndex].description} />
            </View>
            <View style={styles.alignButtons}>
              <View style={styles.buttonUpload}>
                <Button 
                  onPress={() => {this.onPressUpload()}} 
                  title="UPLOAD"
                  type="outline"  
                  accessibilityLabel="upload" />
              </View>
              <View style={styles.buttonExit}>
                <Button 
                  onPress={() => {this.onPressExit()}} 
                  title="EXIT" 
                  type="outline"
                  accessibilityLabel="exit" />
              </View>
            </View>
        </View>
      </Overlay>
    );
  }
}

const theme = getTheme();

const styles = StyleSheet.create({
  alignButtons: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
  },
  buttonExit: {
    flex: 1,
  },
  buttonUpload: {
    flex:1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  card: {
    display: "flex",
    flexDirection:"column",
    padding: 10,
    elevation: 2,
    marginBottom: 80,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT * 2,
    width: CARD_WIDTH * 2,
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
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
  popupContent: {
    flex: 4,
  },
  textTitle: {
    flex: 1,
  },
  textDescription: {
    flex: 6,
  },
})

const mapStateToProps = state => ({
  markers: state.markers,
  region: state.region,
  visible: state.visible,
  selectedImageIndex: state.selectedImageIndex,
  stateChanged: state.stateChanged
})

const mapDispatchToProps = dispatch => ({
    changeCardVisibility: visibility => {
        const action = changeCardVisibility(visibility)
        dispatch(action)
        },
    selectImageCard: index => {
    const action = selectImageCard(index)
    dispatch(action)
    },
    insertPhotoWithIndex: photo => {
      const action = insertPhotoWithIndex(photo)
      dispatch(action)
    },
    deletePhoto: index => {
      const action = deletePhoto(index)
      dispatch(action)
    },
    reflectStateChange: change => {
      const action = reflectStateChange(change)
      dispatch(action)
    },
    renderPhotos: photos => {
      const action = renderPhotos(photos);
      dispatch(action)
    },
    replaceAllMarkers: photos => {
      const action = replaceAllMarkers(photos)
      dispatch(action)
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(PopupCard)