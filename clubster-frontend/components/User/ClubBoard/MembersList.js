import React, { Component } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import converter from 'base64-arraybuffer';
import { Container, Card, CardItem, Thumbnail, Form, Content, Item, Icon, Left, Body, Right, Input } from 'native-base';

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';

import axios from 'axios';
import { DefaultImg } from '../../router';


export default class MembersList extends Component {
  constructor() {
    //calling react's constructor, configures this key word
    super();
    this.state = {
      memberArr: [],
      admins: [],
      idOfUser: '',
      isLoading: true,
      president: ''
    };
  }

  renderTrash = (item) => {
    if (this.state.admins.indexOf(`${item.member._id}`) == -1 && this.state.idOfUser == this.state.president) {
      return (
        <TouchableOpacity style={styles.btn} onPress={() => { this.deleteUser(item.member._id) }}>
          <MaterialIcons
            name="delete-forever"
            size={35}
            color={'black'}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  renderItem = ({ item }) => {
    var url = (item.member.image ? 'https://s3.amazonaws.com/clubster-123/' + item.member.image : DefaultImg);
    return (
      <Card>
        <CardItem style={styles.cardStyle}>
          <TouchableOpacity>
            <Thumbnail large style={styles.img} source={{ uri: url }} />
          </TouchableOpacity>
          <Text style={styles.nm}>
                {item.member.name}
          </Text>
          {this.state.president == item.member._id ? 
            <Text style={styles.memberText} >President</Text> :
            (this.state.admins.indexOf(item.member._id) > -1) ? 
              <Text style={styles.memberText}>Admin</Text> : 
              <Text style={styles.memberText}>Member</Text>
          }
          {this.renderTrash(item)}
        </CardItem>
      </Card>
    )
  }

  // item seprator using black color line in between
  renderSeparator = () => {
    return (
      <View
        style={{ height: 1, width: '100%', backgroundColor: 'black' }}>
      </View>
    )
  }

  componentWillMount() {
    const orgID = this.props._id;
    // get request-setup memberArr[]
    axios.get(`http://localhost:3000/api/organizations/${orgID}/members`)
    .then((response) => {
      const { members, idOfUser, admins, president } = response.data;
      this.setState({ 
        memberArr: members,
         idOfUser, 
         admins, 
         isLoading: false,
         president 
        });
    });
  }

  deleteUser = (idDeleted) => {
    const orgID = this.props._id;

    var membersArr = this.state.memberArr;
    for(var i = 0; i < membersArr.length; i++) {
      if(membersArr[i]._id == idDeleted)
        break;
    }

    // post request - we delete user by sending the id of user thats going to be deleted to the backend
    axios.post(`http://localhost:3000/api/organizations/${orgID}/${idDeleted}`).then((response) => {
      membersArr.splice(i, 1);
      this.setState({ memberArr: membersArr });
    });
  }

  render() {
    if (this.state.isLoading) return null;
    return (
      <FlatList
        data={this.state.memberArr}
        renderItem={this.renderItem}
        keyExtractor={member => member._id}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nm: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 20,
  },
  img: {
    height: 80,
    width: 80
  },
  cardStyle:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 82, 
    width: null
  },
  memberText:{
    fontSize: 16, 
    color: 'black', 
    marginLeft: 10
  }
});
