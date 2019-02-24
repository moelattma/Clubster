import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield'
import axios from 'axios';
import Modal from "react-native-modal";


export default class AttendingModal extends Component {
    render () {
        return (
          <View>
            <Modal>
              <View style={{ flex: 1 }}>
                <Text>I am the modal content!</Text>
              </View>
            </Modal>
          </View>
        )
      }
};