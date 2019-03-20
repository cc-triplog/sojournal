const initialState = {
    markers: [],
    region: {
        latitude: 35.6591246694541,
        longitude: 139.728567802469,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068,
      },
      GPS: [],
      visible: false,
      selectedImageIndex: null,
      stateChanged: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "RENDER_PHOTO": {
            const stateChanges = { markers: action.photo };
        return {
            ...state,
            markers: [...state.markers, action.photo]
            };
        }
        case "RENDER_PHOTOS": {
            const stateChanges = { markers: action.photos }
            return {
                ...state,
                ...stateChanges
            };
        }
        case "CHANGE_CARDVISIBILITY": {
            const stateChanges = { visible: action.visibility };
            return {
                ...state,
                ...stateChanges
            }
        }
        case "SELECT_IMAGECARD": {
            const stateChanges = { selectedImageIndex: action.index }
            return {
                ...state,
                ...stateChanges
            }
        }
        case "INSERT_PHOTOWITHINDEX": {
            const stateChanges = { markers: [ 
                ...state.markers.slice(0, state.selectedImageIndex - 1),
                action.photo,
                ...state.markers.slice(state.selectedImageIndex)
             ] }
            return {
                ...state,
                ...stateChanges
            }
        }
        case "DELETE_PHOTO": {
            const stateChanges = { markers: [
                ...state.markers.slice(0, action.index),
                ...state.markers.slice(action.index + 1)
            ] }
            return {
                ...state,
                ...stateChanges
            }
        }
        case "REFLECT_STATECHANGE": {
            const stateChanges = { stateChanged: action.change }
            return {
                ...state,
                ...stateChanges
            }
        }
        case "REPLACE_ALLMARKERS": {
            const stateChanges = { markers: action.photos}
            return {
                ...state,
                ...stateChanges
            }
        }
        case "RENDER_GPS": {
            const stateChanges = { GPS: action.GPS }
            return {
                ...state,
                GPS: [...state.GPS, action.GPS]
                }
        }
        default: {
            return state;
        }
    }
}

export default reducer;