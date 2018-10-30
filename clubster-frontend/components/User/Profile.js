import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'; 

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            show:false
        }
    }
    
    render() {
        return (
           
            <View style={styles.background}>
                <View style = {styles.header}>

                    <View style = {styles.profilePicWrap}>
                       <Image style = {styles.profilepic} source ={require('../../images/adnan.png')}/>
                    </View>
                        
                    <Text style={styles.name}> Aimal Khan </Text>
                    <Text style={styles.major}> Major: Econ </Text>
                </View>
                <TouchableOpacity style={styles.btn} onPress={() => { this.setState({ show: true }); }}><Text style={styles.plus}>+</Text></TouchableOpacity>

            </View>
            
        ); 
    }
}

const styles = StyleSheet.create({
    background : {
        flex: 1,
       // width: undefined,
      //  height: undefined,
      //  alignSelf: 'stretch',
    },

    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 150,
        backgroundColor: 'skyblue',

      },
    profilePicWrap: {
        width: 180,
        height: 180,
        borderRadius: 100,
        borderColor: 'rgba(0,0,0, 0.4)',
        borderWidth: 16,
    },

    profilepic: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 4,
        //justifyContent: 'center',
    },
    name: {
        marginTop: 20,
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    major: {
        fontSize: 14,
        color: 'black',
        fontStyle: 'italic',
    },

    // CSS for Bar
    bar: {
        borderTopColor: '#fff',
        borderTopWidth: 4,
        backgroundColor: 'black',
        flexDirection: 'row'
    },
    barSeparator:{
        borderRightWidth: 4,
    },
    barTop: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    btn: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: '#03A9F4',
        borderRadius: 30,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plus: {
        fontSize: 40,
        color: 'white'
    },
    barBottom: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    barItem: {
        flex: 1,
        padding: 18,
        alignItems: 'center'
    },


});