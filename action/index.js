const renderPhotos = (photos) => {
    return {
        type: "RENDER_PHOTOS",
        photos
    }
}

module.exports ={
    renderPhotos
}