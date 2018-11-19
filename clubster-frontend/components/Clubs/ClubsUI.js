import React from 'react';
import { Dimensions,View, Text, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
const window = Dimensions.get('window');
const imageWidth = (window.width/3)+30;
const imageHeight = window.width/3;
const ClubsUI = ({clubs}) => (
    <ScrollView contentContainerStyle = {styles.root}>
        {clubs.map((item, i) => (
          <TouchableOpacity key={i} onPress = {this.props.home.navigate('AdminNavigation', { item })}>
          <View style={styles.meetupCard} >
            <View style={styles.meetupCardTopContainer}>
            <Image style={styles.imageHeight} source={require('../User/images/adnan.png')} />
            </View>

            <View style={styles.meetupCardBottomContainer}>
              <Text style={styles.meetupCardMetaName}>

              </Text>
              <Text style={styles.meetupCardMetaDate}>
                Mar 2m 6:00pm
              </Text>
            </View>
          </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  titleContainer: {
    flex: 0.1,
    paddingHorizontal: '2.5%',
    paddingVertical: '2.5%',
  },
  title: {
    color: '#fff',
    fontSize: 25,
  },
  contentContainer: {
    flex: 1,
  },
  imageHeight: {
    width: window.width/2,
    alignItems: 'center',
    height: imageHeight,
    borderColor: '#d6d7da'
  },
  meetupCard: {
    width: window.width/2,
    alignItems: 'center',
    height: imageHeight+5,
    marginTop: 10,
    borderColor: '#d6d7da'
  },
  meetupCardTopContainer: {
    flex: 1,
    position: 'absolute',
  },
  meetupCardTitle: {
    position: 'relative',
    color: '#0000ff'
  },
  meetupCardBottomContainer: {
    flex: 0.4,
    width: window.width/2 - 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: '2.5%',

  },
  meetupCardMetaName: {
    fontSize: 15
  },
  meetupCardMetaDate: {
    fontSize: 13
  },
});


export default ClubsUI;
