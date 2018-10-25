import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { HomeNavigator } from './components/router'

//import Profile from './components/Profile'

export default class Clubster extends Component {
  render() {
    return (
      <HomeNavigator/>
    );
  }
}

AppRegistry.registerComponent('Clubster', () => Clubster);