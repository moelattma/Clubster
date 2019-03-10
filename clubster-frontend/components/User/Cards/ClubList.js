import React, { Component } from 'react';
import { Text, Body, ListItem, Left, Thumbnail, Right } from "native-base";
import { StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

export default class ClubList extends Component {
  constructor(props) {
    super(props);

    this.allClubs = props.userClubs;
  }

  _renderItem = ({ item }) => {
    return (
      <ListItem thumbnail>
        <Left>
          <Thumbnail source={{ uri: item.image }} />
        </Left>
        <Body>
          <Text>{item.name}</Text>
        </Body>
        <Right>
          <Text>{item.isAdmin ? 'Admin' : 'Member'}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <FlatList
        data={this.allClubs.slice(0, 40)}
        renderItem={this._renderItem}
        horizontal={false}
        keyExtractor={club => club._id}
      />
    );
  }
}
