import React, { Component } from 'react';

import { ClubsterNavigator } from '../router'

export default class ClubsterNavigation extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <ClubsterNavigator screenProps={{ clubsterNavigation: navigation }} />
    );
  }
}