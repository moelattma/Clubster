import React, { Component }  from 'react';
import PhotoGrid from 'react-native-image-grid';
import { Dimensions,AsyncStorage, View, ScrollView, StyleSheet, Image, TouchableOpacity, Button, TextInput, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, Text, Body,List } from "native-base";
import PhotoCard from '../PhotoCard/PhotoCard';
import { ImagePicker, Permissions, Constants } from 'expo';

class ImageGrid extends Component {

  constructor(props) {
    super(props);
    this.state = { photos: [] };
  }

  componentDidMount() {
    const eventID = this.props.eventID;
    axios.get(`http://localhost:3000/api/${eventID}/photos`).then((data) => {
      this.setState({photos: data.photos});
    });
    this.setState({photos:[{id:1},{id:2}]});
  }

  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

  async photoSubmit() {
    const eventID = this.props.eventID;
    await this.askPermissionsAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          base64: false,
      });
      if(result.cancelled)
        return;
      const key = `${v1()}.jpeg`;
      const file = {
          uri: result.uri,
          type: 'image/jpeg',
          name: key
      };
      const options = {
        keyPrefix: 's3/',
        bucket: 'clubster-123',
        region: 'us-east-1',
        accessKey:accessKeyId,
        secretKey: secretAccessKey,
        successActionStatus:201
      }
      var imageURL;
      const fileUpload = await RNS3.put(file,options).then((response)=> {
         console.log(response.body.postResponse.key);
         imageURL = response.body.postResponse.key;
      }).catch((err) => {console.log(err)});
      const data = new FormData();
      data.append('imageURL', imageURL);
      await axios.post(`http://localhost:3000/api/${eventID}/photos`).then((data) => {
        this.setState({photos: data.photos});
      });
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    return(
      <Container>
        <Content padder>
          <Card>
            <CardItem header bordered>
              <Text>Photos: <FontAwesome name="plus" size={18} color={'black'} onPress = {() => {this.photoSubmit()}} /></Text>
            </CardItem>
            <List
              dataArray={this.state.photos}
              renderRow={(rowData) =>
              <PhotoCard
                key={rowData.id}
              />}
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start'}}
              />
          </Card>
        </Content>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        width: Dimensions.get('window').width * 0.5,
        height: 100,
        borderWidth: 1,
        borderColor: "lightgray",
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemIcon: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    itemTitle: {
        marginTop: 16,
    },
});

export default ImageGrid;
