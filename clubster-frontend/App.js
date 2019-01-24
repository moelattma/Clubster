import React, { Component } from 'react';
import { AppRegistry, StyleSheet } from 'react-native';
import {SafeAreaView} from 'react-navigation';
import { AdminNavigator, LoginNavigator } from './components/router';

export default class Clubster extends Component {
  render() {
    return (
      <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.SafeAreaView}>

      <LoginNavigator/>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  SafeAreaView: {
      flex: 1,
      backgroundColor: '#ddd'
  }
})

AppRegistry.registerComponent('Clubster', () => Clubster);
