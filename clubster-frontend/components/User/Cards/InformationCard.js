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

  render() {
    const event = this.props.eventInfo;

    return (
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
    );
  }
}
