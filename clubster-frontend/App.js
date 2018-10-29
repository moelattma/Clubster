import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { AdminNavigator } from './components/router'

export default class Clubster extends Component {
  render() {
    return (
      <AdminNavigator/>
    );
  }
}

AppRegistry.registerComponent('Clubster', () => Clubster);