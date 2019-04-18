import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import Pie from 'react-native-pie';

export default class ActiveChart extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activePercentage: 0
    }
  }

  componentDidMount() {
    let activeMembers = 0;
    if(!this.props.club.members) {
      return <Expo.AppLoading />;
    }
    for(let i = 0;i<this.props.club.members.length;i++) {
      if(this.props.club.events.length != 0 && this.props.club.members[i].activeScore >= 0.6*this.props.club.events.length) {
        activeMembers++;
      }
    }
    let percentage = Math.floor((activeMembers / this.props.club.members.length) * 100);
    this.setState({activePercentage: percentage});

  }
  render() {
    let percentage = this.state.activePercentage;
    return (
      <View style={styles.container}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold', fontSize:18 }} >Member Activity</Text>
        <View>
          <Pie
            radius={50}
            innerRadius={45}
            series={[percentage]}
            colors={['#f00']}
            backgroundColor='#ddd' />
          <View style={styles.gauge}>
            <Text style={styles.gaugeText}>{percentage}%</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  gauge: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
})
