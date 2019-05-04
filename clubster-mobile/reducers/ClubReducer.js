import * as Actions from './ActionTypes';

let clubState = { clubsAdmin: [], clubsMember: [], allClubs: [], club: null };

const clubReducer = (state = clubState, action) => {
    switch (action.type) {
        case Actions.CLUBS_SET: 
            state = Object.assign({}, state, { clubsAdmin: action.payload.clubsAdmin, clubsMember: action.payload.clubsMember } );
            return state;
        case Actions.CLUBS_CREATE:
            state = Object.assign({}, state, { clubsAdmin: state.clubsAdmin.concat(action.payload.club) } );
            return state;
        case Actions.CLUBS_SETALL:
            if (state.allClubs.length != action.payload.allClubs.length)
                state = Object.assign({}, state, { allClubs: action.payload.allClubs } );
            return state;
        case Actions.CLUBS_SETUSER:
            state = Object.assign({}, state, { club: action.payload.club } );
            return state;
        default:
            return state;
    }
}

export default clubReducer;