import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native'

export default class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false
        };
    }

    render() {
        return(
            <View style={styles.body}>
                <Text style={styles.header}> Notifications </Text>
                <TouchableOpacity style={styles.notification}>

                </TouchableOpacity>
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