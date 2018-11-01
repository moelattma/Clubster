import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, List, ListItem } from 'react-native'
import axios from 'axios';
export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications:[
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"}
            ]
        };
    }

    componentDidMount() {
        // axios.get("http://localhost:3000/api/notifications").then((response) => {
        //     this.setState({notifications: response.data.notifications}); // Setting up state variable
        //     console.log(this.state.notifications);
        // }).catch((err) => console.log(err));
    }

    _renderItem = ({item}) => {
        
    }
        

    render() {
        console.log(this.state.notifications);
        return(
          <View>
              <FlatList 
                data = {this.state.notifications}

              />
          </View>
        );
    }
}


const styles = StyleSheet.create({
    body : {
        flex: 1,
        paddingTop: 25,
        backgroundColor: '#36485f',
        alignItems: 'stretch',
    },

    header: {
        color : 'white',
        fontWeight: 'bold',
        fontSize: 35,
        fontStyle: 'italic',
        alignSelf: 'center',
    },

    notification: {
        flex: 1,
        backgroundColor: '#36485f'
    },

    notificationText: {
        alignSelf: 'center'
    }
});
