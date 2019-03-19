import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body, List, ListItem, Left, Thumbnail } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Input from './Input';
import axios from 'axios';

export default class Comments extends Component {
 constructor(props) {
    super(props);

    this.state = {
      comments: []
    }
  }

  componentDidMount() {
    if(this.props && this.props.navigation.getParam('comments', null)) {
      this.setState({comments: this.props.comments});
    } else {
      axios.get(`http://localhost:3000/api/events/${this.props.navigation.getParam('eventID', null)}/comments`).then((response) => {
        this.setState({comments: response.data.comments});
      });
    }
  }

  onSub = text => {
    var comments = this.state.comments;
    axios.post(`http://localhost:3000/api/events/${this.props.navigation.getParam('eventID', null)}/comments`, {
      text:text
    }).then((response) => {
      comments.push(response.data.comment);
      this.setState({comments: comments});

    });
  }



 _renderItem() {
   return this.state.comments.map((data, i) => {
     let url = 'https://s3.amazonaws.com/clubster-123/' + data.userID.image;
     return (
       <ListItem key = {i} avatar>
         <Left>
           <Thumbnail source={{ uri:url}} />
         </Left>
         <Body>
           <Text>{data.content}</Text>
         </Body>
       </ListItem>
     )
   })

  }
  render() {
    return (
      <Container>
        <Content>
          <List>
            {this._renderItem()}
          </List>
        </Content>
        <Input onSubmit={this.onSub}/>
      </Container>

    );
  }
}

const styles = StyleSheet.create({

});
