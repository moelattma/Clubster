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
      <Container>
        <Content >
          <Card>
            <CardItem header bordered>
              <Text>Name: {event.name}</Text>             
            </CardItem>
            <CardItem bordered>
              <Text>Description: {event.description}</Text>
            </CardItem>
            <CardItem bordered>
              <Text>Location: {event.location}</Text>
            </CardItem>
            <CardItem bordered>
              <Text>Date: {event.date}</Text> 
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
