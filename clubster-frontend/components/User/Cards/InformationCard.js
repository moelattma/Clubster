import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default class InformationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
  }

  componentDidMount() {
    const eventID = this.props.eventID; //eventID is hardcoded for now
    axios.get(`http://localhost:3000/api/events/${eventID}/comments`).then((comments) => {
      this.setState({
        comments: comments
      })
    })
  }

  _renderItem = () => {
    return (
      <CardItem bordered>
        <Body>
          <Text>
            NativeBase is a free and open source framework that enable
            developers to build
            high-quality mobile apps using React Native iOS and Android
            apps
            with a fusion of ES6.
          </Text>
        </Body>
      </CardItem>
    )
  }
  render() {
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem header bordered>
              <Text>Comments</Text>
            </CardItem>
            <FlatList
              data={this.state.comments}
              renderItem={this._renderItem}
              keyExtractor={comment => comment._id}
            />
            <CardItem footer bordered>
              <Text>See All</Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
