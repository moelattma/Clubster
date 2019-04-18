import * as Actions from '../actions/ActionTypes';

let userState = { userID: null };

const userReducer = (state = userState, action) => {
    switch (action.type) {
        case Actions.USER_LOGIN:
            state = Object.assign({}, state, { userID: action.payload } )
            return state;
        case Actions.USER_LOGOUT:
            state = Object.assign({}, state, { userID: null })
            return state;
        default:
            return state;
    }
}

export default userReducer;