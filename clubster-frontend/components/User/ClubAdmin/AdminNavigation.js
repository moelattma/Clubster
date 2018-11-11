import React, { Component } from 'react';

import { AdminNavigator } from '../../router'

export default class AdminNavigation extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    console.log(params.hideHeader);
    if(params.hideHeader == true) {
      return {
        header: null,
      };
    }
  }

  render() {
    const { screenProps, navigation } = this.props;
    const organization = navigation.getParam('item', null);
    const _id = organization._id;
    const { clubsterNavigation } = screenProps;

    return (
      <AdminNavigator screenProps={{ _id, clubsterNavigation, adminNavigation: navigation }} />
    );
  }
}