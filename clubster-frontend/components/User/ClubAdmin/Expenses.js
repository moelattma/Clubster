import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import axios from 'axios';

export default class Expenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expenses:[]

        };
    }

    componentDidMount() {
        axios.get("http://localhost:3000/api/5bd3fac350f9b629004dea0f/expenses").then((response) => {
            this.setState({expenses: response.data.expenses}); // Setting up state variable
        }).catch((err) => console.log(err));
    }

    render() {
        return(
          <Text>Hello</Text>
        )
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
