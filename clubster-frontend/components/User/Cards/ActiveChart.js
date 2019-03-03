import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Pie from 'react-native-pie'

export default class ActiveChart extends Component {
    constructor(props) {
      super(props);
      this.state = {
        chart: []
      };
    }

    componentDidMount() {
    }

    render() {
      <View>
          <Pie
            radius={50}
            innerRadius={45}
            series={[60]}
            colors={['#f00']}
            backgroundColor='#ddd' />
          <View style={styles.gauge}>
            <Text style={styles.gaugeText}>60%</Text>
          </View>
        </View>
    }
}
