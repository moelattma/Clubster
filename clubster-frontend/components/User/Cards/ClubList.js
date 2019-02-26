import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body, List } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default class ClubList extends Component {
 constructor(props) {
    super(props);

    this.state = {
      allClubs: [],
      loading: false
    }
  }

  componentDidMount() {
       this.getClubs();
  }

  getClubs() {
    const _id = '5bcad6a3345dcf92dc99ec8f';
    axios.get(`http://localhost:3000/api/${_id}/organizations`).then((organizations) => {
      const { arrayClubsAdmin, arrayClubsMember } = response.data;
      getClubsAdmin = arrayClubsAdmin;
      for (var i = 0; i < arrayClubsAdmin.length; i++) {
        if (getClubsAdmin[i].image)
          url = 'https://s3.amazonaws.com/clubster-123/' + getClubsAdmin[i].image;
        else
          url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';
        getClubsAdmin[i].image = url;
        getClubsAdmin[i].isAdmin = true;
      };

      for (var i = 0; i < arrayClubsMember.length; i++) {
        var club = arrayClubsMember[i];
        club.image = url;
        club.isAdmin = false;
        getClubsMember.push(club);
      };
      var allClubs = getClubsAdmin.concat(getClubsMember);
      this.setState({ allClubs:allClubs, loading: false }); // Setting up state variable
    }).catch((err) => {
      this.setState({ loading: false });
    });
  }

 _renderItem() {
   return this.state.allClubs.map((data) => {
     return (
       <ListItem avatar>
         <Left>
           <Thumbnail source={{ uri: data.image }} />
         </Left>
         <Body>
           <Text>{data.name}</Text>
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

})
