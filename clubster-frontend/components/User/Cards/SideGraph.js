import React, { Component } from 'react';
import {
  PropTypes,
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Font, AppLoading } from "expo";

export default class SideGraph extends Component {
  constructor (props) {
    super(props)
    const width = {members: 0, comments: 0, likes:0};
    this.state = {
      members: new Animated.Value(width.members),
      comments: new Animated.Value(width.comments),
      likes: new Animated.Value(width.likes)
    }
  }

  componentDidMount() {
    console.log('Hi', this.props);
    if(!this.props.club.members) {
      return <Expo.AppLoading />;
    }
    this.setState({members: this.props.club.members.length});
    this.setState({comments: this.props.club.totalComments});
    this.setState({likes: this.props.club.totalLikes});

  }

  render () {
   const { members, comments, likes } = this.state;
   if(members == NaN) {
     console.log('Hi!');
     return <Expo.AppLoading />;
   }
   if(members == NaN) {
     this.setState({members:0});
     this.setState({comments:0});
     this.setState({likes:0});
   }

   return (
     <View style={styles.container}>

       <View style={styles.item}>
         <Text style={styles.label}>Members: </Text>
         <View style={styles.data}>
           {(members) ? <Animated.View style={[styles.bar, styles.rebounds, {width: members}]} /> : <Animated.View style={[styles.bar, styles.rebounds, {width: 0}]} />
           }
         </View>
       </View>
       <View style={styles.item}>
         <Text style={styles.label}>Comments: </Text>
         <View style={styles.data}>
           {(comments) ? <Animated.View style={[styles.bar, styles.rebounds, {width: comments}]} /> : <Animated.View style={[styles.bar, styles.rebounds, {width: 0}]} />
           }
         </View>
       </View>
       <View style={styles.item}>
         <Text style={styles.label}>Likes </Text>
         <View style={styles.data}>
           {(likes) ? <Animated.View style={[styles.bar, styles.rebounds, {width: 1}]} /> : <Animated.View style={[styles.bar, styles.rebounds, {width: 0}]} />
           }
         </View>
       </View>

       </View>
   )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 6,
    height: Dimensions.get('window').height/2
  },
  // Item
  item: {
    flexDirection: 'column',
    marginBottom: 35,
    marginTop: 20,
    paddingHorizontal: 10
  },
  label: {
    color: '#CBCBCB',
    fontSize: 12,
    top: 2,
    marginBottom:10
  },
  data: {
    flex: 2,
    flexDirection: 'row'
  },
  dataNumber: {
    color: '#CBCBCB',
    fontSize: 11
  },
  // Bar
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    top: 15,
    height: 38,
    marginRight: 5
  },
  points: {
    backgroundColor: '#F55443'
  },
  assists: {
    backgroundColor: '#FCBD24'
  },
  rebounds: {
    backgroundColor: '#59838B'
  },
  steals: {
    backgroundColor: '#4D98E4'
  },
  blocks: {
    backgroundColor: '#418E50'
  },
  turnovers: {
    backgroundColor: '#7B7FEC'
  },
  minutes: {
    backgroundColor: '#3ABAA4'
  },
  // controller
  controller: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  button: {
    flex: 1,
    position: 'relative',
    top: -1
  },
  chevronLeft: {
    alignSelf: 'flex-end',
    height: 28,
    marginRight: 10,
    width: 28
  },
  chevronRight: {
    alignSelf: 'flex-start',
    height: 28,
    marginLeft: 10,
    width: 28
  },
  date: {
    color: '#6B7C96',
    flex: 1,
    fontSize: 22,
    fontWeight: '300',
    height: 28,
    textAlign: 'center'
  }

})
