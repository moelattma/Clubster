import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native'; 

export default class Profile extends Component {
    render() {
        return(
            <View style={styles.body}>
                <Text style={styles.header}> Profile </Text>

                <Image/>                
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
        alignSelf: 'center'
    },

    pictureBox: {

    }
});