import { combineReducers, createStore } from 'redux';

// import reducers
import userReducer from './UserReducer';
import clubsReducer from './ClubReducer';
import eventReducer from './EventReducer';

const AppReducers = combineReducers({
    user: userReducer, 
    clubs: clubsReducer,
    events: eventReducer
});

export default store = createStore(AppReducers);
