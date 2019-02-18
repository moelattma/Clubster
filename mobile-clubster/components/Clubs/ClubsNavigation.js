import React,{ Component } from 'react';

import { ClubsNavigator } from '../router'

export default class ClubsNavigation extends Component {
  render() {
    const { home } = this.props.screenProps;

    return (
        <ClubsNavigator screenProps={{ home }} />
    );
  }
}