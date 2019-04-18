import React from 'react';
import { Content, Card, CardItem, Text, Body, List, ListItem, Left, Thumbnail } from "native-base";
import axios from 'axios';
import { DefaultImg } from '../../Utils/Defaults';

export default class CommentCard extends React.Component {
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
       let url = (data.userID.image ? 'https://s3.amazonaws.com/clubster-123/' + data.userID.image : DefaultImg);
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
          </Card>
        </Content>
    );
  }
}
