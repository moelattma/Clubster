import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { AdminNavigator, LoginNavigator } from './components/router';
import MemberList from './components/User/ClubAdmin/MembersList';
import ClubsFlatList from './components/Clubs/ClubsFlatList';


export default class Clubster extends Component {
  render() {
    return (
      <LoginNavigator/>
    );
  }
}

AppRegistry.registerComponent('Clubster', () => Clubster);