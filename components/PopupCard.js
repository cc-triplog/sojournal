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
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import './styles'
import { Button, Overlay } from 'react-native-elements';
import { WebBrowser, Component } from "expo";
import { getTheme } from 'react-native-material-kit';
import MapView from "react-native-maps";
import axios from 'axios';
import { connect } from 'react-redux';
import {
  renderPhotos,
  changeCardVisibility,
  selectImageCard,
  insertPhotoWithIndex,
  deletePhoto,
  reflectStateChange,
  replaceAllMarkers,
  updateImageFullScreen,
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
    this.state = {
      title: null,
      description: null,
      midSizeImage: null,
      displayImageFull: false,
    }
  }
  componentDidMount() {
    const copyImageUrl = this.props.markers[this.props.selectedImageIndex].image.uri.slice(0);
    const replaceTarget = /.jpg/gi;
    const midSizeImageUrl = copyImageUrl.replace(replaceTarget, '-mid.jpg');
    this.setState({ midSizeImage: { uri: `${midSizeImageUrl}` } })
  }

  onChangeTextTitle(text) {
    this.setState({ title: text })
  }
  onChangeTextDescription(text) {
    this.setState({ description: text })
  }
  onPressDelete() {
    axios({
      url: 'http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql',
      method: 'post',
      data: {
        query: `
        mutation {DestroyPhoto(input: {
          userId:${this.props.userId}
          id:${this.props.markers[this.props.selectedImageIndex].id}
        })
      }
        `
      }
    }).then(result => {
      this.props.changeCardVisibility(false)
      this.props.deletePhoto(this.props.selectedImageIndex);
    })
  }
  onPressExit() {
    this.props.changeCardVisibility(false)
  }
  onPressImage() {
    this.setState({ ImageFullScreen: true })
  }
  onPressUpload() {
    const updateTitle = this.state.title === null ? this.props.markers[this.props.selectedImageIndex].title : this.state.title
    const updateDescription = this.state.description === null ? this.props.markers[this.props.selectedImageIndex].description : this.state.description

    axios({
      url: 'http://ec2-54-199-164-132.ap-northeast-1.compute.amazonaws.com:4000/graphql',
      method: 'post',
      data: {
        query: `
        mutation {UpdatePhoto(input: {
          userId:${this.props.userId}
          id:${this.props.markers[this.props.selectedImageIndex].id}
          title: "${updateTitle}"
          comment: "${updateDescription}"
        })
      }
        `
      }
    }).then(result => {
      const updateTitle = this.state.title === null ? this.props.markers[this.props.selectedImageIndex].title : this.state.title
      const updateDescription = this.state.description === null ? this.props.markers[this.props.selectedImageIndex].description : this.state.description
      const newPhotoData = {
        coordinate: {
          latitude: this.props.markers[this.props.selectedImageIndex].coordinate.latitude,
          longitude: this.props.markers[this.props.selectedImageIndex].coordinate.longitude,
        },
        title: updateTitle,
        description: updateDescription,
        image: this.props.markers[this.props.selectedImageIndex].image,
        id: this.props.markers[this.props.selectedImageIndex].id
      }
      this.props.insertPhotoWithIndex(newPhotoData);
      this.props.changeCardVisibility(false)
    })
      .catch(err => console.log("==================error", err))
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
        <View key={this.props.selectedImageIndex} style={styles.card}>
          <View style={styles.popupContent}>
            <Image source={this.state.midSizeImage} style={styles.popUpImage} />
          </View>
          <TextInput
            style={styles.textTitle}
            onChangeText={(text) => { this.onChangeTextTitle(text) }}
            defaultValue={this.props.markers[this.props.selectedImageIndex].title} />
          <View style={styles.textDescription}>
            <TextInput
              multiline={true}
              style={theme.cardContentStyle}
              onChangeText={(text) => { this.onChangeTextDescription(text) }}
              defaultValue={this.props.markers[this.props.selectedImageIndex].description} />
          </View>
          <View style={styles.alignButtons}>
            <View style={styles.buttonUpload}>
              <Button
                onPress={() => { this.onPressUpload() }}
                title="UPDATE"
                type="outline"
                accessibilityLabel="update" />
            </View>
            <View style={styles.buttonDelete}>
              <Button
                onPress={() => { this.onPressDelete() }}
                title="DELETE"
                type="outline"
                accessibilityLabel="delete" />
            </View>
            <View style={styles.buttonExit}>
              <Button
                onPress={() => { this.onPressExit() }}
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
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  buttonDelete: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonExit: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonUpload: {
    flex: 1,
    marginHorizontal: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'space-between',
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: '100%',
    width: '100%',
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  popUpImage: {
    maxWidth: "100%",
    height: "100%",
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
    flex: 6,
  },
  textTitle: {
    flex: 1,
  },
  textDescription: {
    flex: 4,
  },
})

const mapStateToProps = state => ({
  displayImageFull: state.displayImageFull,
  markers: state.markers,
  region: state.region,
  visible: state.visible,
  selectedImageIndex: state.selectedImageIndex,
  stateChanged: state.stateChanged,
  userId: state.userId
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
  },
  updateImageFullScreen: boolean => {
    const action = updateImageFullScreen(boolean)
    dispatch(action)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PopupCard);