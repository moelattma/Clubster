import React, { Component } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {  Card, CardItem, Thumbnail } from 'native-base';
import { connect } from 'react-redux'

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
import { DefaultImg } from '../../Utils/Defaults';


export class MembersList extends Component {
  renderTrash = (item) => {
    if (!item.isAdmin && !item.isPresident && this.props.userIsPresident) {
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
    var url = (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg);
    return (
      <Card>
        <CardItem style={styles.cardStyle}>
          <TouchableOpacity>
            <Thumbnail large style={styles.img} source={{ uri: url }} />
          </TouchableOpacity>
          <Text style={styles.nm}>
                {item.name}
          </Text>
          {item.isPresident ? 
            <Text style={styles.memberText} >President</Text> :
            (item.isAdmin) ? 
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

  deleteUser = (idDeleted) => {
    const orgID = this.props._id;

    var membersArr = this.state.memberArr;
    for(var i = 0; i < membersArr.length; i++) {
      if(membersArr[i]._id == idDeleted)
        break;
    }

    // post request - we delete user by sending the id of user thats going to be deleted to the backend
    axios.post(`http://localhost:3000/api/organizations/${orgID}/${idDeleted}`).then((response) => {
      // do a delete user thing in redux
    });
  }

  render() {
    return (
      <FlatList
        data={this.props.members.slice(0, 10)}
        renderItem={this.renderItem}
        keyExtractor={member => member._id}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { admins, members } = state.clubs.club;
  var mems = [];
  var adminIDs = [];
  if (admins && admins.length > 0) {
    mems.push(Object.assign(admins[0].admin, { isPresident: true }));
    adminIDs.push(admins[0].admin._id);
    admins.shift();
    if (admins.length > 0) {
      admins.map(admin => { 
        mems.push(Object.assign(admin.admin, { isAdmin: true }))
        adminIDs.push(admin.admin._id);
      });
    }
  }
  members.map(member => { 
    if (!adminIDs.includes(member.member._id))
      mems.push(member.member);
  });
  return { members: mems, userIsPresident: (adminIDs.length > 0 ? adminIDs[0] == state.user.user._id : false ) }
}

export default connect(mapStateToProps, null)(MembersList);

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
