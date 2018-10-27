import React,{ Component } from 'react';
import { NavigationRouter } from 'react-navigation';

import { ClubsterNavigator } from '../router'

export default class ClubsNavigation extends Component {
  render() {
    return (
        <ClubsterNavigator />
    );
  }
}