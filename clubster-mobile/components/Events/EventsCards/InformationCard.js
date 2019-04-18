import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default class InformationCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let info = (this.props.eventInfo) ? (this.props.eventInfo) : (this.props.userInfo) ? (this.props.userInfo): (this.props.clubInfo);
    let eventNum = (info == this.props.eventInfo) ? 1 : (info == this.props.clubInfo) ? 2: 0;
    if(eventNum === 1) {
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
    } else if (eventNum === 2) {
      return  (
        <Content padder>
          <Card>
            <CardItem>
              <Text>Name: {info.name}</Text>
            </CardItem>
            <CardItem>
              <Text>President: {info.president}</Text>
            </CardItem>
            <CardItem>
              <Text>Description: {info.description}</Text>
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
