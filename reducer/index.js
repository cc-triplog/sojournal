const initialState = {
    markers: [],
    region: {
        latitude: 35.6591246694541,
        longitude: 139.728567802469,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068
    },
    GPS: [],
    visible: false,
    selectedImageIndex: null,
    stateChanged: false,
    capture: null,
    userId: null,
    createGroupVisible: false
};

const reducer = (state = initialState, action) => {
    console.log("==================action=================", action)
    console.log("==================state before=================", state)

    switch (action.type) {
        case "RENDER_PHOTO": {
            const stateChanges = { markers: action.photo };
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                markers: [...state.markers, action.photo]
            };
        }
        case "RENDER_PHOTOS": {
            const stateChanges = { markers: action.photos }
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                ...stateChanges
            };
        }
        case "CHANGE_CARDVISIBILITY": {
            const stateChanges = { visible: action.visibility };
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                ...stateChanges
            }
        }
        case "SELECT_IMAGECARD": {
            const stateChanges = { selectedImageIndex: action.index }
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                ...stateChanges
            }
        }
        case "INSERT_PHOTOWITHINDEX": {
            const stateChanges = {
                markers: [
                    ...state.markers.slice(0, state.selectedImageIndex),
                    action.photo,
                    ...state.markers.slice(state.selectedImageIndex + 1)
                ]
            }
            console.log("=====================stateChanges================", stateChanges)
            return {
                ...state,
                ...stateChanges
            }
        }
        case "DELETE_PHOTO": {
            const stateChanges = {
                markers: [
                    ...state.markers.slice(0, action.index),
                    ...state.markers.slice(action.index + 1)
                ]
            }
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                ...stateChanges
            }
        }
        case "REFLECT_STATECHANGE": {
            const stateChanges = { stateChanged: action.change }
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                ...stateChanges
            }
        }
        case "REPLACE_ALLMARKERS": {
            const stateChanges = { markers: action.photos }
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                ...stateChanges
            }
        }
        case "RENDER_GPS": {
            const stateChanges = { GPS: action.GPS }
            console.log("=====================stateChanges================", stateChanges)

            return {
                ...state,
                GPS: [...state.GPS, action.GPS]
            }
        }
        case "SET_CAPTURE": {
            const stateChanges = { capture: action.capture };
            console.log("=====================stateChanges================", stateChanges)

            return { ...state, ...stateChanges };
        }
        case "SET_USER_ID": {
            const stateChanges = { userId: action.id };
            console.log("=====================stateChanges================", stateChanges)

            return { ...state, ...stateChanges };
        }
        default: {
            return state;
        }
    }
}

export default reducer;
