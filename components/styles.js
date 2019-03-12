import { StyleSheet, Dimensions } from "react-native";

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default StyleSheet.create({
  choicePage: {
    backgroundColor: "purple",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column"
  },
  choiceButtons: {
    justifyContent: "center",
    backgroundColor: "white",
    width: 150,
    height: 150,
    opacity: 0.5,
    alignItems: "center",
    borderRadius: 50
  },
  alignCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  preview: {
    height: winHeight,
    width: winWidth,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  bottomToolbar: {
    width: winWidth,
    position: "absolute",
    height: 100,
    bottom: 0
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
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: "#FFFFFF"
  },
  captureBtnActive: {
    width: 80,
    height: 80
  },
  captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: "red",
    borderColor: "transparent"
  },
  galleryContainer: {
    bottom: 100
  },
  galleryImageContainer: {
    width: 75,
    height: 75,
    marginRight: 5
  },
  galleryImage: {
    width: 75,
    height: 75
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
  commentInput: {
    alignItems: "center",
    fontSize: 30,
    width: 250,
    margin: 40,
    marginBottom: 80
  }
});
