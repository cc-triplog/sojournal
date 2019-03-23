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

const setTitle = title => {
  return {
    type: "SET_IMAGE_TITLE",
    title
  };
};

const setComment = comment => {
  return {
    type: "SET_IMAGE_COMMENT",
    comment
  };
};

const toggleGroupDatePickerVisible = () => {
  return {
    type: "TOGGLE_GROUP_DATE_PICKER_VISIBLE"
  };
};

const setGroupStartDate = date => {
  return {
    type: "SET_GROUP_START_DATE",
    date
  };
};

const setGroupEndDate = date => {
  return {
    type: "SET_GROUP_END_DATE",
    date
  };
};

const setGroupTitle = title => {
  return {
    type: "SET_GROUP_TITLE",
    title
  };
};

const setGroupDescription = description => {
  return {
    type: "SET_GROUP_DESCRIPTION",
    description
  };
};

const loadGroupsToState = groups => {
  return {
    type: "LOAD_GROUPS",
    groups
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
  toggleCreateGroupVisible,
  setComment,
  setTitle,
  toggleCreateGroupVisible,
  toggleGroupDatePickerVisible,
  setGroupStartDate,
  setGroupEndDate,
  setGroupTitle,
  setGroupDescription,
  loadGroupsToState
};
