const renderPhotos = (photos) => {
    return {
        type: "RENDER_PHOTOS",
        photos
    }
}
const changeCardVisibility = (visibility) => {
    return {
        type: "CHANGE_CARDVISIBILITY",
        visibility
    }
}
const selectImageCard = (index) => {
    return {
        type: "SELECT_IMAGECARD",
        index
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

module.exports ={
    renderPhotos,
    changeCardVisibility,
    selectImageCard,
    insertPhotoWithIndex,
    deletePhoto
}