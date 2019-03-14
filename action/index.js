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

module.exports ={
    renderPhotos,
    changeCardVisibility,
    selectImageCard
}