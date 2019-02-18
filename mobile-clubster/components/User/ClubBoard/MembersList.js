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


export default class MemberList extends Component {
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
    var url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';
    console.log(item.avatar.img.data.data == null);
    if (item.avatar && item.avatar.img)
      url = 'data:image/jpeg;base64,' + converter.encode(item.avatar.img.data.data);
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
                  {item.name}
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
    const orgID = this.props.screenProps._id;
    // get request-setup memberArr[]
    axios.get(`http://localhost:3000/api/organizations/${orgID}/members`).then((response) => {
      const { members, idOfUser, admins, president } = response.data;
      this.setState({ memberArr: members, idOfUser, admins, isLoading: false, president });
    });
  }

  deleteUser = (idDeleted) => {
    const orgID = this.props.screenProps._id;

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
