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

module.exports ={
    renderPhotos,
    changeCardVisibility
}