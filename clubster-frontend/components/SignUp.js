import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class SignUp extends Component {
  render() {
    return (
      <View style={styles.regForm}>
        <View>
          <Text style={styles.header}>
            Register for Clubster
          </Text>
        </View> 
      
        <TextInput 
          style={styles.textinput} 
          placeholder="Email" 
          underlineColorAndroid={'transparent'} />

        <TextInput 
          style={styles.textinput} 
          placeholder="Username" 
          underlineColorAndroid={'transparent'} />

        <TextInput 
          style={styles.textinput} 
          placeholder="Password" 
          secureTextEntry={true} 
          underlineColorAndroid={'transparent'} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.btntext}>
            Sign Up
         </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  regForm: {
    alignSelf: 'stretch'
  },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textinput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',
    marginTop: 30
  },
  btntext: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25
  }
});