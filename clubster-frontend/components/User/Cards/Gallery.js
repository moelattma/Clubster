// Gallery.js
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import ImageViewer from 'ImageViewer';
import GalleryImage from './GalleryImage';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      shown: false,
      images:[
        'http://scimg.jb51.net/allimg/160815/103-160Q509544OC.jpg',
        'http://img.sc115.com/uploads1/sc/jpgs/1508/apic22412_sc115.com.jpg',
        'http://h.hiphotos.baidu.com/zhidao/pic/item/0df431adcbef7609bca7d58a2adda3cc7cd99e73.jpg',
        'http://facebook.github.io/react/img/logo_og.png',
        'http://scimg.jb51.net/allimg/160815/103-160Q509544OC.jpg'
      ]
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

  render() {
    const { images } = this.state;
    const { index, shown } = this.state;
    return (
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Text>Photos: <FontAwesome name="plus" size={18} color={'black'} onPress = {() => {this.photoSubmit()}} /></Text>
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
                  uri={image}
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
