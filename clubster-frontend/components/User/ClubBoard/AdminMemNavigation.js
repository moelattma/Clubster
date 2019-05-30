// navigation for a club

import React, { Component } from 'react';

import { AdminNavigator, MemberNavigator } from '../../router'

export default class AdminMemNavigation extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if(params.hideHeader == true) {
      return {
        header: null,
      };
    }
  }

  render() {
    const { screenProps, navigation } = this.props;
    const organization = navigation.getParam('item', null);
    const isAdmin = navigation.getParam('isAdmin', false);
    const _id = organization._id;
    const { clubsterNavigation } = screenProps;

    const clubBoardScreen = { _id, clubsterNavigation, clubBoardNav: navigation, isAdmin };

    if(isAdmin) {
      return (
        <AdminNavigator screenProps={clubBoardScreen} />
      );
    } else {
      return (
        <MemberNavigator screenProps={clubBoardScreen} />
      );
    }
  }
}