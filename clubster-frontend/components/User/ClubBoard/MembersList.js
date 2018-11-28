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
      adminCount: 1,
      isLoading: false
    };
  }

  renderTrash = ({item}) => {
    if(this.state.admins.indexOf(this.state.idOfUser) == -1) {
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
    if(item.avatar && item.avatar.img) {
      url = 'data:image/jpeg;base64,' + converter.encode(item.avatar.img.data.data);
    }
    return (
      <View>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}
          onPress={() => ToastAndroid.show(item.book_title, ToastAndroid.SHORT)}>
          <Image style={{ width: 80, height: 80, marginLeft: 1, marginTop: 9, marginRight: 9,borderColor: "white",borderRadius: 100,alignSelf: 'center',position: 'relative' }} source={{ uri: url }} />
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
      }

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
      const { members, adminCount, idOfUser, admins } = response.data;
      this.setState({ memberArr: members, adminCount: adminCount, idOfUser: idOfUser, admins:admins  });
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
