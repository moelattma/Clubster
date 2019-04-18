import { connect } from 'react-redux';

import { USER_LOGIN, USER_LOGOUT } from './ActionTypes';

export const userLogin = (userID) => {
    return {
        type: USER_LOGIN,
        payload: userID
    }
}

export const userLogout = () => {
    return {
        type: USER_LOGOUT
    }
}
