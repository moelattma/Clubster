import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native'; 

export default class Profile extends Component {

    
    render() {
        return (
           
            <View style={styles.background}>
                <View style = {styles.header}>

                    <View style = {styles.profilePicWrap}>
                        <Image style = {styles.profilepic} source ={require('../images/adnan.png')}/>
                    </View>
                        
                    <Text style={styles.name}> Adnan Yunus </Text>
                    <Text style={styles.major}> Major: Undecided </Text>
                </View>
    

            {/* Profile Bar */}
            
                <View style={styles.bar}>

                    <View style={styles.barItem}>
                        <Text style={styles.barTop}>22</Text>
                        <Text style={styles.barBottom}>Clubs Joined</Text>
                    </View>

                    <View style={[styles.barItem, styles.barSeparator]}>
                        <Text style={styles.barTop}>11</Text>
                        <Text style={styles.barBottom}>Events Attended</Text>
                    </View>

                </View>

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
        fontSize: 16,
        color: '#fff',
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