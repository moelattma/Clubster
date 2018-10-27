import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { HomeNavigator } from './components/router'

export default class Clubster extends Component {
  render() {
    return (
      <HomeNavigator/>
    );
  }
}

AppRegistry.registerComponent('Clubster', () => Clubster);