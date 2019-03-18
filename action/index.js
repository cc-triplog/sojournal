const changeCardVisibility = (visibility) => {
    return {
        type: "CHANGE_CARDVISIBILITY",
        visibility
    }
}
const changeTitle = (title) => {
    return {
        type: "CHANGE_TITLE",
        title
    }
}
const changeDescription = (description) => {
    return {
        type: "CHANGE_DESCRIPTION",
        description
    }
}
const insertPhotoWithIndex = (photo) => {
    return {
        type: "INSERT_PHOTOWITHINDEX",
        photo
    }
}
const deletePhoto = (index) => {
    return {
        type: "DELETE_PHOTO",
        index
    }
}
const renderGPS = (GPS) => {
    return {
        type: "RENDER_GPS",
        GPS
    }
}
const renderPhotos = (photos) => {
    return {
        type: "RENDER_PHOTOS",
        photos
    }
}
const selectImageCard = (index) => {
    return {
        type: "SELECT_IMAGECARD",
        index
    }
}
const reflectStateChange = (change) => {
    return {
        type: "REFLECT_STATECHANGE",
        change
    }
}
const replaceAllMarkers = (photos) => {
    return {
        type: "REPLACE_ALLMARKERS",
        photos
    }
}

module.exports ={
    renderPhotos,
    changeCardVisibility,
    selectImageCard,
    insertPhotoWithIndex,
    deletePhoto,
    reflectStateChange,
    replaceAllMarkers,
    renderGPS
}