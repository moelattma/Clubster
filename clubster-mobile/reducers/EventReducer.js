import * as Actions from './ActionTypes';

let eventState = { allEvents: [], userEvents: [], clubEvents: [], thisEvent: null };

const eventReducer = (state = eventState, action) => {
    switch (action.type) {
        case Actions.EVENTS_SETALL: 
            if (action.payload.allEvents.length != state.allEvents.length)
                state = Object.assign({}, state, { allEvents: action.payload.allEvents } );
            return state;
        case Actions.EVENTS_SETUSER:
            if (action.payload.userEvents.length != state.userEvents.length)
                state = Object.assign({}, state, { userEvents: action.payload.userEvents } );
            return state;
        case Actions.EVENTS_SETCLUB:
            if (action.payload.events.length != state.clubEvents.length)
                state = Object.assign({}, state, { clubEvents: action.payload.events } );
            return state;
        case Actions.EVENTS_SETCURRENT:
            state = Object.assign({}, state, { thisEvent: action.payload.thisEvent } );
            return state;
        case Actions.EVENTS_CREATE: 
            const { event } = action.payload;
            if (event && event != null) {
                var { allEvents, clubEvents, userEvents } = state;
                allEvents.unshift(event);
                clubEvents.unshift(event);
                userEvents.unshift(event);  
                state = Object.assign({}, state, { allEvents, userEvents, clubEvents } );
                return state;
            }
            return state;
        case Actions.EVENTS_HANDLEGOING:
            var { corrID, going } = action.payload;
            var { clubEvents } = state;
            for (var i = 0; i < clubEvents.length; i++) {
                if (clubEvents[i]._id === corrID)
                    break;
            }
            clubEvents[i].going = going;
            state = Object.assign({}, state, { clubEvents: clubEvents });
            return state;
        case Actions.EVENTS_HANDLELIKE:
            var { corrID, likers } = action.payload;
            var { clubEvents } = state;
            for (var i = 0; i < clubEvents.length; i++) {
                if (clubEvents[i]._id === corrID)
                    break;
            }
            clubEvents[i].likers = likers;
            state = Object.assign({}, state, { clubEvents: clubEvents });
            return state;
        default:
            return state;
    }
}

export default eventReducer;