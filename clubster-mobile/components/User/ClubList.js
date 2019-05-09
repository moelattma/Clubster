import React, { Component } from 'react';
import { Text, Body, ListItem, Left, Thumbnail, Right } from "native-base";
import { FlatList } from 'react-native';
import { DefaultImg } from '../Utils/Defaults';

const TYPE_MEMBER = "Member";
const TYPE_ADMIN = "Admin";
const TYPE_PRESIDENT = "President";

export default class ClubList extends Component {
  constructor(props) {
    super(props);

    var name = props.name;
    var clubs = [];
    var toAdd = [];
    toAdd = props.adminClubs;
    toAdd.map(club => {
      if (!club.empty && club.president === name) {
        club.type = TYPE_PRESIDENT;
        clubs.push(club);
      }
    });
    toAdd.map(club => {
      if (!club.empty && club.president != name) {
        club.type = TYPE_ADMIN;
        clubs.push(club);
      }
    });
    toAdd = props.memberClubs;
    toAdd.map(club => {
      if (!club.empty) {
        club.type = TYPE_MEMBER;
        clubs.push(club);
      }
    });
    this.allClubs = clubs;
  }

  _renderItem = ({ item }) => {
    const img = item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg;
    return (
      <ListItem thumbnail>
        <Left>
          <Thumbnail source={{ uri: img }} />
        </Left>
        <Body>
          <Text>{item.name}</Text>
        </Body>
        <Right>
          <Text>{item.type}</Text>
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
