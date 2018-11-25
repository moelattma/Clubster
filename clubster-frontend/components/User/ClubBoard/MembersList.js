import React, { Component } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


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


export default class MemberList extends Component {
  constructor() {
    //calling react's constructor, configures this key word 
    super();
    this.state = {
      memberArr: [],
      adminCount: 1,
      isLoading: false
    };
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}
          onPress={() => ToastAndroid.show(item.book_title, ToastAndroid.SHORT)}>
          <Image style={{ width: 80, height: 80, margin: 5 }}
            source={{ uri: item.avatar }} />
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 5 }}>
            <Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 16, color: 'red' }}>
              {item.username}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.btn} onPress={() => { this.deleteUser(item._id) }}>
          <MaterialIcons
            name="delete-forever"
            size={35}
            color={'black'}
          />
        </TouchableOpacity>

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
    const orgID = this.props.screenProps._id;
    // get request-setup memberArr[]
    axios.get(`http://localhost:3000/api/organizations/${orgID}/members`).then((response) => {
      const { members, adminCount } = response.data;
      this.setState({ memberArr: members, adminCount: adminCount });
      console.log(this.state.memberArr);
    });
  }

  deleteUser = (idDeleted) => {
    const orgID = this.props.screenProps._id;

    // post request - we delete user by sending the id of user thats going to be deleted to the backend
    axios.post(`http://localhost:3000/api/organizations/${orgID}/${idDeleted}`).then((response) => {
      var arr = this.state.memberArr.filter(function(id) {
        return id !== idDeleted;
      });
      this.setState({memberArr: arr});
      console.log(this.state.memberArr);
    });
  }

  render() {
    return (
      this.state.isLoading
        ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#330066" animating />
        </View>
        :
        <View style={styles.container}>
          <FlatList
            data={this.state.memberArr}
            renderItem={this.renderItem}
            // the keyExtractor prop to specify which piece of data should be used as key
            keyExtractor={member => member._id}

            //Divider to the FlatList
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: 60,
    paddingRight: 60
  },
  btn: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 30,
    //borderColor: 'black',
    bottom: 35,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
