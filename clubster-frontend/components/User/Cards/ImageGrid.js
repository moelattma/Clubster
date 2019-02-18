import React, { Component }  from 'react';
import PhotoGrid from 'react-native-image-grid';
import { Dimensions,AsyncStorage, View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Button, TextInput, Linking } from 'react-native';

class ImageGrid extends Component {

  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  componentDidMount() {
    // Build an array of 60 photos
    let items = Array.apply(null, Array(6)).map((v, i) => {
      return { id: i, src: 'http://placehold.it/200x200?text='+(i+1) }
    });
    this.setState({ items });
  }

  render() {
    return(
      <ScrollView vertical >
          <View style={styles.container}>
            {
              this.state.items.map((image, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.item}
                    onPress={() => {}}
                  >
                    <Image
                      style={styles.itemIcon}
                      source={{uri: image.src}}
                    />
                    <Text style={styles.itemTitle}>
                      Hello!
                    </Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </ScrollView>
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
