import { combineReducers, createStore } from 'redux';

// import reducers
import userReducer from './UserReducer';

const AppReducers = combineReducers({
    userReducer, 
});

export default store = createStore(AppReducers);
