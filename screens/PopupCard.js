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
      console.log("====================whole thing ", result.data.data.ReadPhoto)
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
    this.props.replaceAllMarkers(mapResult)
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
    })
    // .then(result => {
    //   const newPhotoData = {
    //     coordinate: {
    //       latitude: this.props.markers[this.props.selectedImageIndex].latitude,
    //       longitude: this.props.markers[this.props.selectedImageIndex].longitude,
    //     },
    //     title: this.changedTitle,
    //     description: this.changedDescription,
    //     image: this.props.markers[this.props.selectedImageIndex].image,
    //     id: this.props.markers[this.props.selectedImageIndex].id
    //   }
      // const copyOfNewState = this.props.markers.map(photo => {
      //   if(photo.id === this.props.markers[this.props.selectedImageIndex].id) {
      //     photo = newPhotoData
      //   }
      // })
      // this.props.insertPhotoWithIndex(newPhotoData);
      // this.props.deletePhoto(this.props.selectedImageIndex);
      // this.props.reflectStateChange(!(this.props.stateChanged))
    // }).then(console.log("========after axios call", this.props.markers))
    this.callDatabase()
    this.props.changeCardVisibility(false);
}

  render() {

    return (
      <Overlay
      isVisible={this.props.visible} 
      windowBackgroundColor="rgba(255,255,255, .5)"
      overlayBackgroundColor="#fff"
      fullScreen={false}
      style={styles.overlay}
      >
      {
        this.props.stateChanged
        ? <View style={styles.card}>
        <View style={[theme.cardImageStyle, styles.popupContent]}>
                <Image source={this.props.markers[this.props.selectedImageIndex].image} style={styles.popUpImage} />
        </View>
        <TextInput 
        style={[theme.cardContentStyle, styles.textTitle]}
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
    : <View style={styles.card}>
    <View style={[theme.cardImageStyle, styles.popupContent]}>
            <Image source={this.props.markers[this.props.selectedImageIndex].image} style={styles.popUpImage} />
    </View>
    <TextInput 
    style={[theme.cardContentStyle, styles.textTitle]}
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
      }
        {/* <View style={styles.card}>
            <View style={[theme.cardImageStyle, styles.popupContent]}>
                    <Image source={this.props.markers[this.props.selectedImageIndex].image} style={styles.popUpImage} />
            </View>
            <TextInput 
            style={[theme.cardContentStyle, styles.textTitle]}
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
        </View> */}
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
    position: "absolute",
    bottom: 20
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
  overlay: {
    height: 60
  },
  textInputPopup: {
    width: "100%",
    height: "50%"
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