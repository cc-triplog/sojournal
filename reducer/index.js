const initialState = {
    markers: [],
    region: {
        latitude: 35.6591246694541,
        longitude: 139.728567802469,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068,
      },
      visible: false,
}

const reducer = (state = initiaState, action) => {
    switch (action.type) {
        case "RENDER_PHOTOS": {
            const stateChanges = { photos: actions.photos };
        return {
            ...state,
            ...stateChanges
            }
        }
        default: {
            return state;
        }
    }
}