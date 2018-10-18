import React from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Text, View, Dimensions } from 'react-native';
import Login from './Login'

const { width:WIDTH } = Dimensions.get('window');
export default class App extends React.Component {
  render() {
    return (
      <Login></Login>
    );
  }
}