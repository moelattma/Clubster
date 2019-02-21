import React, { Component }  from 'react';
import PhotoGrid from 'react-native-image-grid';
import { Dimensions,AsyncStorage, View, ScrollView, StyleSheet, Image, TouchableOpacity, Button, TextInput, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Text, Body,List } from "native-base";

export default class PhotoCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={ styles.itemStyle} >
        <Card>
            <CardItem>
              <Image source= {{uri: 'https://s3.amazonaws.com/clubster-123/s3/01915bc0-348c-11e9-a6d4-f9e3b1285470.jpeg'}} />
            </CardItem>
          </Card>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  itemStyle: {
    width: 150,
    height: 100
  }
});
