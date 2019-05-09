import * as Actions from '../reducers/ActionTypes';

let userState = { user: null, showAdminClubs: true, notifications: [] };

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
        case Actions.USER_TOGGLECLUBS:
            if (action.payload.showAdminClubs != state.showAdminClubs)
                state = Object.assign({}, state, { showAdminClubs: action.payload.showAdminClubs })
            return state;
        case Actions.USER_NOTIFICATIONSSET:
            if (action.payload.notifications.length != state.notifications.length)
                state = Object.assign({}, state, { notifications: action.payload.notifications })
            return state;
        default:
            return state;
    }
}

export default userReducer;