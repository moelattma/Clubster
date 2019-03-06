import React, { Component } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import converter from 'base64-arraybuffer';
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
    if (this.state.admins.indexOf(`${item._id}`) == -1 && this.state.idOfUser == this.state.president) {
      return (
        <TouchableOpacity style={styles.btn} onPress={() => { this.deleteUser(item._id) }}>
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
    if (item.member.image)
      url = 'https://s3.amazonaws.com/clubster-123/' + item.member.image;
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', flex: .85 }}>
          <View>
            <TouchableOpacity onPress={() => ToastAndroid.show(item.book_title, ToastAndroid.SHORT)}>
              <Image style={styles.img} source={{ uri: url }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => ToastAndroid.show(item.book_title, ToastAndroid.SHORT)}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', }}>
              <View >
                <Text style={styles.nm}>
                  {item.member.name}
                </Text>
              </View>
              <View >
                {this.state.president == item._id ? 
                  <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }} >President</Text> :
                  (this.state.admins.indexOf(item._id) > -1) ? 
                    <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>Admin</Text> : 
                    <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>Member</Text>
                }
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderTrash(item)}
      </View>
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
      console.log('memberlist response', response.data)
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
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'lightgrey',
    height: 80,
    width: 80
  }
});
