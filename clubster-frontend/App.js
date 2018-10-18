import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';

import Login from './components/Login';

export default class App extends Component {
  render() {
    return (
      <View style ={styles.container}>
        <Login></Login>
      </View>
    );
  }
}

AppRegistry.registerComponent('App', () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: '#36485f',
    paddingLeft: 60,
    paddingRight: 60
  }
})