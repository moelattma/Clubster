import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body, List, ListItem, Left, Thumbnail } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Comments from '../ClubBoard/Comments';
export default class CommentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
  }

  componentDidMount() {
    const eventID = this.props.eventInfo._id; //eventID is hardcoded for now
    axios.get(`http://localhost:3000/api/events/${eventID}/comments`).then((response) => {
      this.setState({comments: response.data.comments});
    });
  }


   _renderItem = () => {
     return (
       this.state.comments.map((data) => {
       let url = 'https://s3.amazonaws.com/clubster-123/' + data.userID.image;
      //  console.log(data);
       return (
         <ListItem avatar key={data._id}>
           <Left>
             <Thumbnail source={{ uri:url}} />
           </Left>
           <Body>
             <Text>{data.content}</Text>
           </Body>
         </ListItem>
       )
     })
   )}

  render() {
    let commentTruncated = this.state.comments;
    commentTruncated.length = 3;
    return (
        <Content padder>
          <Card>
            <CardItem header bordered>
              <Text>Comments</Text>
            </CardItem>
            <List>
              {this._renderItem()}
            </List>
            <CardItem footer bordered onPress={() => this.props.navigation.navigate('Comments', { comments: this.state.comments })}>
              <Text>See All</Text>
            </CardItem>
          </Card>
        </Content>
    );
  }
}
