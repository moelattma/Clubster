import { combineReducers, createStore } from 'redux';

// import reducers
import userReducer from './UserReducer';
import clubsReducer from './ClubReducer';

const AppReducers = combineReducers({
    user: userReducer, 
    clubs: clubsReducer
});

export default store = createStore(AppReducers);
