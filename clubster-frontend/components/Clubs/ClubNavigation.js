import React,{ Component } from 'react';

import { ClubsterNavigator } from '../router'

export default class ClubsNavigation extends Component {
  render() {
    const { home } = this.props.screenProps;

    return (
        <ClubsterNavigator screenProps={{ home }} />
    );
  }
}