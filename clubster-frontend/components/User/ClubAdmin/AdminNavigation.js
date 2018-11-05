import React,{ Component } from 'react';

import { AdminNavigator } from '../../router'

export default class AdminNavigation extends Component {
  render() {
    const { navigation } = this.props;
    const organization = navigation.getParam('item', null);
    const _id = organization._id;

    return (
        <AdminNavigator screenProps={{ _id }} />
    );
  }
}