import * as Actions from '../reducers/ActionTypes';

let userState = { user: null };

const userReducer = (state = userState, action) => {
    switch (action.type) {
        case Actions.USER_LOGIN:
            state = Object.assign({}, state, { user: action.payload.user } )
            return state;
        case Actions.USER_LOGOUT:
            state = Object.assign({}, state, { user: null })
            return state;
        case Actions.USER_CHANGEPROFILE:
            const { major, hobbies, biography } = action.payload;
            state = Object.assign({}, state, { user: { ...state.user, major, hobbies, biography } })
            return state;
        case Actions.USER_CHANGEPHOTO:
            state = Object.assign({}, state, { user: { ...state.user, image: action.payload.image } })
            return state;
        default:
            return state;
    }
}

export default userReducer;