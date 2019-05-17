import React from 'react';
import { Container, Content, Text, Body, List, ListItem, Left, Thumbnail } from "native-base";
import { StyleSheet } from 'react-native';
import Input from '../EventsUtils/Input';
import axios from 'axios';
import { DefaultImg } from '../../Utils/Defaults';

export default class Comments extends React.Component {
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
      axios.get(`https://clubster-backend.herokuapp.com/api/events/${this.props.navigation.getParam('eventID', null)}/comments`).then((response) => {
        this.setState({comments: response.data.comments});
      });
    }
  }

  onSub = text => {
    var comments = this.state.comments;
    axios.post(`https://clubster-backend.herokuapp.com/api/events/${this.props.navigation.getParam('eventID', null)}/comments`, {
      text:text
    }).then((response) => {
      comments.push(response.data.comment);
      this.setState({comments: comments});
    });
  }



 _renderItem() {
   return this.state.comments.map((data, i) => {
     let url = (data.userID.image ? 'https://s3.amazonaws.com/clubster-123/' + data.userID.image : DefaultImg);
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

