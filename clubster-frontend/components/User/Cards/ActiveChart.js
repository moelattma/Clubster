import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default class ActiveChart extends Component {
    constructor(props) {
      super(props);
      this.state = {
        chart: []
      };
    }

    componentDidMount() {
        // retrieve percentages for active v inactive via get request; active = person attended 5 recent events 
    }

    render() {}
}