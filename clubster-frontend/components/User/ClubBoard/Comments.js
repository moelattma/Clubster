import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default class Comments extends Component {
 constructor(props) {
    super(props);

    this.state = {
      comments: [{
        text: "Happy Friday",
        user: {
          avatar: 'https://s3.amazonaws.com/clubster-123/s3/01915bc0-348c-11e9-a6d4-f9e3b1285470.jpeg'
        }
      },
      {
        text: "Go team!",
        user: {
          avatar: 'https://s3.amazonaws.com/clubster-123/s3/01915bc0-348c-11e9-a6d4-f9e3b1285470.jpeg'
        }
      },
    ]
    }
  }

  componentDidMount() {
   this.willFocus = this.props.navigation.addListener('willFocus', () => {
     if (this._mounted)
       this.getComments();
   });
  }

  getComments() {
    return;
  }

 _renderItem() {
   return this.state.comments.map((data) => {
     return (
       <ListItem avatar>
         <Left>
           <Thumbnail source={{ uri: data.user.avatar }} />
         </Left>
         <Body>
           <Text>{data.text}</Text>
         </Body>
       </ListItem>
     )
   })

  }
  render() {
    return (
      <Container>
        <Header />
        <Content>
          <List>
            {this._renderItem()}
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

}
