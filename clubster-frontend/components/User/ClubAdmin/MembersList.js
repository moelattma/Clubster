import React, { Component } from 'react';
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
      isLoading: false
    };
  }
  renderItem = ({ item }) => {
    return (
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
        {/* // Delete Button */}
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text style={styles.plus}>+</Text>
        </View>

      </TouchableOpacity>
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
    // get request-setup memberArr[]
    axios.get('http://localhost:3000/api/organizations/5bd150152632506f2c53dde1/members').then((response) => {
      this.setState({ memberArr: response.data.organization.members });
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
            keyExtractor={(item, index) => index}

            //Divider to the FlatList
            ItemSepratorComponent={this.renderSeparator}
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
  }
});
