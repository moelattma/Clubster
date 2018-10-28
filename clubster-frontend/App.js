import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { LoginNavigator } from './components/router'

export default class Clubster extends Component {
  render() {
    return (
      <LoginNavigator/>
    );
  }
}

AppRegistry.registerComponent('Clubster', () => Clubster);