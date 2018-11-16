import EventsUI from './EventsUI';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';


export class DummyEventsUI extends React.Component {
    constructor() {
        super();
        this.state =  {
            events: [
                {
                    id: 1,
                    name: "Adnan",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to bring your friends and rate the event!"
                },
                {
                    id: 2,
                    name: "Maryam",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to rate the event!"
                },
                {
                    id: 3,
                    name: "Olus",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to rate the event!"
                },
                {
                    id: 4,
                    name: "Mohamed",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to rate the event!"
                },
                {
                    id: 5,
                    name: "Maryam",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to rate the event!"
                },
                {
                    id: 6,
                    name: "Olus",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to rate the event!"
                },
                {
                    id: 7,
                    name: "Mohamed",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to rate the event!"
                },
                {
                    id: 8,
                    name: "Maryam",
                    date: "10/30/2018",
                    time: "6:00 pm",
                    description: "Have fun with your peers tonight! Remember to rate the event!"
                }
            ]
        }
    }
    render() {
        return(
        <EventsUI events = {this.state.events} />
        );
    }
}

