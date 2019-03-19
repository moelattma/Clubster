// GalleryImage.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { Button } from 'native-base';
import { Image } from 'react-native-animatable';
const WIDTH = Dimensions.get('window').width;
export default class GalleryImage extends Component {
  render() {
    const { uri, index, onPress } = this.props;

    //  console.log('GallerImage. uri, index, onPress ', uri, index, onPress);
    return (
      <Button
        onPress={() => onPress(index)}
        style={{
          backgroundColor: 'transparent',
          borderRadius: 0,
          height: 160,
          width: WIDTH / 3 - 10,
        }}
      >
        <Image
          animation={'bounceIn'}
          delay={100 * index}
          duration={500}
          source= {{uri: uri}}
          style={{
            height: 160,
            position: 'absolute',
            resizeMode: 'cover',
            width: WIDTH / 3,
          }}
        />
      </Button>
    );
  }
}
GalleryImage.propTypes = {
  uri: PropTypes.string,
  index: PropTypes.number,
  onPress: PropTypes.func,
};
