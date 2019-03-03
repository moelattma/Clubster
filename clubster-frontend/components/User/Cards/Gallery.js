// Gallery.js
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { Font, ImagePicker, Permissions, Constants } from 'expo';
import ImageViewer from 'ImageViewer';
import GalleryImage from './GalleryImage';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { accessKeyId, secretAccessKey } from '../../../keys/keys';
import v1 from 'uuid/v1';
import axios from 'axios';
import { RNS3 } from 'react-native-aws3';

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      shown: false,
      images:[]
    };
    this.openLightbox = (index) => {
      this.setState({
        index,
        shown: true,
      });
    };
    this.hideLightbox = () => {
      this.setState({
        index: 0,
        shown: false,
      });
    };
  }

  componentDidMount() {
    let photos = this.props.eventInfo.photos;
    this.setState({images: photos})
  }

  askPermissionsAsync = async () => {
      await Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };


  onSubmit = async () => {
    await this.askPermissionsAsync();
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });
        if (result.cancelled)
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
            accessKey: accessKeyId,
            secretKey: secretAccessKey,
            successActionStatus: 201
        }
        var imageURL;
        await RNS3.put(file, options).then((response) => {
            imageURL = response.body.postResponse.key;
        }).catch((err) => { console.log(err) });
        const url = this.props.eventInfo._id;
        axios.post(`http://localhost:3000/api/events/${url}/photo`,  { imageURL: imageURL }).then((response) => {
          this.setState({images: response.data.photos});
        })
    } catch (error) { console.log(error); }

  }
  render() {
    const { images } = this.state;
    const { index, shown } = this.state;
    return (
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Text>Photos: <FontAwesome name="plus" size={18} color={'black'} onPress = {() => {this.onSubmit()}} /></Text>
          </CardItem>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {this.state.images.map((image, idx) => {
                return (<GalleryImage
                  index={idx}
                  key={idx}
                  onPress={this.showLightbox}
                  uri={'https://s3.amazonaws.com/clubster-123/' + image}
                />
              )}
            )}
            <ImageViewer
              shown={shown}
              imageUrls={images}
              onClose={this.hideLightbox}
              index={index}
            />
          </View>
        </Card>
      </Content>
    );
  }
}
Gallery.propTypes = {
  images: PropTypes.array,
};
