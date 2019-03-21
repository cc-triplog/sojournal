const changeCardVisibility = visibility => {
  return {
    type: "CHANGE_CARDVISIBILITY",
    visibility
  };
};
const changeTitle = title => {
  return {
    type: "CHANGE_TITLE",
    title
  };
};
const changeDescription = description => {
  return {
    type: "CHANGE_DESCRIPTION",
    description
  };
};
const insertPhotoWithIndex = photo => {
  return {
    type: "INSERT_PHOTOWITHINDEX",
    photo
  };
};
const deletePhoto = index => {
  return {
    type: "DELETE_PHOTO",
    index
  };
};
const renderGPS = GPS => {
  return {
    type: "RENDER_GPS",
    GPS
  };
};
<<<<<<< HEAD
const renderPhotos = photos => {
  return {
    type: "RENDER_PHOTOS",
    photos
  };
};
const renderPhoto = photo => {
  return {
    type: "RENDER_PHOTOS",
    photo
  };
=======
const renderPhotos = (photos) => {
  return {
    type: "RENDER_PHOTOS",
    photos
  }
};
const renderPhoto = (photo) => {
  return {
    type: "RENDER_PHOTOS",
    photo
  }
>>>>>>> 8c74ee60e42c0010650c392db679d422062ebb0b
};
const selectImageCard = index => {
  return {
    type: "SELECT_IMAGECARD",
    index
  };
};
const reflectStateChange = change => {
  return {
    type: "REFLECT_STATECHANGE",
    change
  };
};
const replaceAllMarkers = photos => {
  return {
    type: "REPLACE_ALLMARKERS",
    photos
  };
};

const setCapture = capture => {
  return {
    type: "SET_CAPTURE",
    capture
  };
};

const setUserId = id => {
  return {
    type: "SET_USER_ID",
    id
  };
};

const toggleCreateGroupVisible = () => {
  return {
    type: "TOGGLE_CREATE_GROUP_VISIBLE"
  };
};

module.exports = {
  renderPhotos,
  changeCardVisibility,
  selectImageCard,
  insertPhotoWithIndex,
  deletePhoto,
  reflectStateChange,
  replaceAllMarkers,
  renderGPS,
  setCapture,
  setUserId,
  toggleCreateGroupVisible
};
