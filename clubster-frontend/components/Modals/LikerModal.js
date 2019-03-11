import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield'
import axios from 'axios';
import Modal from "react-native-modal";


export default class LikerModal extends Component {
  render () {
      console.log('Why 2');
      return (
        <Modal style = {{
            backgroundColor: 'white',
            padding: 4,
            marginTop: 50,
            marginRight: 20,
            marginBottom: 30,
            marginLeft: 20,
            borderRadius: 6
        }}>
            <View style={{ flex: 1 }}>
              <Text>I am the liker modal content!</Text>
            </View>
          </Modal>
      )
    }
};
