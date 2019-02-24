import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default class EventAttendance extends Component {
    constructor(props) {
      super(props);
      this.state = {
        attendance: []
      };
    }

    componentDidMount() {
        // grab going count of each event and graph it
    }

    render() {}
}