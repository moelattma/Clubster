import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default class InformationCard extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  returnEventInfo(event) {
    return(
      <Content padder>
        <Card>

          <CardItem>
            <Text>Name: {event.name}</Text>
          </CardItem>
          <CardItem>
            <Text>Description: {event.description}</Text>
          </CardItem>
          <CardItem>
            <Text>Location: {event.location}</Text>
          </CardItem>
          <CardItem>
            <Text>Date: {event.date}</Text>
          </CardItem>

        </Card>
      </Content>
    )
  }

  returnUserInfo(user) {
    return(
      <Content padder>
        <Card>

          <CardItem>
            <Text>Name: {user.name}</Text>
          </CardItem>
          <CardItem>
            <Text>Major: {user.major}</Text>
          </CardItem>
          <CardItem>
            <Text>Hobbies: {user.hobbies}</Text>
          </CardItem>
          <CardItem>
            <Text>Bio: {user.biography}</Text>
          </CardItem>

        </Card>
      </Content>
    )
  }

  render() {
    let info = (this.props.eventInfo) ? (this.props.eventInfo) : (this.props.userInfo);
    let eventNum = (info == this.props.eventInfo) ? 1: 0;
    if(eventNum) {
      return(
        <Content padder>
          <Card>
            <CardItem>
              <Text>Name: {info.name}</Text>
            </CardItem>
            <CardItem>
              <Text>Description: {info.description}</Text>
            </CardItem>
            <CardItem>
              <Text>Location: {info.location}</Text>
            </CardItem>
            <CardItem>
              <Text>Date: {info.date}</Text>
            </CardItem>
          </Card>
        </Content>
      )
    } else {
      return(
        <Content padder>
          <Card>

            <CardItem>
              <Text>Name: {info.name}</Text>
            </CardItem>
            <CardItem>
              <Text>Major: {info.major}</Text>
            </CardItem>
            <CardItem>
              <Text>Hobbies: {info.hobbies}</Text>
            </CardItem>
            <CardItem>
              <Text>Bio: {info.biography}</Text>
            </CardItem>

          </Card>
        </Content>
      )
    }
  }
}
