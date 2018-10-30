import React, { Component } from 'react';

import { HomeNavigator } from '../router'

export default class HomeNavigation extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <HomeNavigator screenProps={{ home: navigation }} />
    );
  }
}