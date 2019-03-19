import React, {Component} from 'react';
import { StyleSheet, View, ART, Dimensions, TouchableWithoutFeedback } from 'react-native';

const {
    Surface,
    Group,
    Rectangle,
    ClippingRectangle,
    LinearGradient,
    Shape,
    Text,
    Path,
    Transform
} = ART;

import {
    max,
    ticks
} from 'd3-array'

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as format from 'd3-format';
import * as axis from 'd3-axis';
import * as path from 'd3-path';
const d3 = {
    scale,
    shape,
    format,
    axis,
    path,
};

import {
    scaleLinear,
    scaleBand,
    scaleTime
}  from 'd3-scale';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Font, AppLoading } from "expo";

import { Container, Header, Content, Card, CardItem, Body,List } from "native-base";

const colours = {
    black: 'black',
    blue: 'steelblue',
    brown: 'brown'
}

const data = [
    {frequency: 5, letter: 'a'},
    {frequency: 6, letter: 'b'},
    {frequency: 4, letter: 'c'},
    {frequency: 1, letter: 'd'},
    {frequency: 2, letter: 'e'},
    {frequency: 3, letter: 'f'}
];

export default class EventAttendance extends Component {

    render() {

        return(
          <View>
            <Text>First part and </Text>
            <Text>second part</Text>
          </View>

        )
    }
}

const styles = {
  container: {
    margin: 20,
  },
  label: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: 'normal',
  }
};
