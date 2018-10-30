import React,{ Component } from 'react';

import { AdminNavigator } from '../../router'

export default class AdminNavigation extends Component {
  render() {
    const { navigation } = this.props;
    const organization = navigation.getParam('item', null);

    return (
        <AdminNavigator screenProps={{ organization }} />
    );
  }
}