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

    constructor(props) {
        super(props);
        this.createBarChart = this.createBarChart.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.getRandomColor = this.getRandomColor.bind(this);
        this.state = {
          events: []
        }
    }

    componentDidMount() {
      console.log('Hi from events ', this.props);
      let activeMembers = 0;
      if(!this.props.club && !this.props.club.events) {
        return <Expo.AppLoading />;
      }
      this.setState({events: this.props.club.events});
      console.log('Events  ', this.props.club.events);
    }

    getRandomColor() {
        return '#' + Math.random().toString(16).substr(-6);
    }

    drawLine(startPoint, endPoint) {
        var path = d3.path.path();
        path.lineTo(startPoint, endPoint);
        return path;
    }

    createBarChart(x, y, w, h) {
        var path = d3.path.path();
        path.rect(x, y, w, h);
        return path;
    }

    render() {
        if(this.props.club.events == undefined) {
          return null;
        }
        const screen = Dimensions.get('window');
        const margin = {top: 25, right: 25, bottom: 25, left: 25}
        const width = screen.width - margin.left - margin.right
        const height = (screen.height - margin.top - margin.bottom)/3

        const x = d3.scale.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(this.props.club.events.map(d => d.name))

        const maxFrequency = max(this.props.club.events, d => d.going.length)

        const y = d3.scale.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, maxFrequency])
        if(this.props.club.events.length < 2) {
          return(
            <View><Text> Need more than 1 event to see progress! </Text></View>
          )
        }

        const firstLetterX = x(this.props.club.events[0].name)
        const secondLetterX = x(this.props.club.events[1].name)
        const lastLetterX = x(this.props.club.events[this.props.club.events.length - 1].name)
        const labelDx = (secondLetterX - firstLetterX) / 2

        const bottomAxis = [firstLetterX - labelDx, lastLetterX + labelDx]
        console.log('labeldx ', labelDx);
        const bottomAxisD = d3.shape.line()
                                .x(d => d + labelDx)
                                .y(() => 0)
                                (bottomAxis)

        const leftAxis = ticks(0, maxFrequency, 5)

        const leftAxisD = d3.shape.line()
                            .x(() => bottomAxis[0] + labelDx)
                            .y(d => y(d) - height)
                            (leftAxis)
        const notch = 5
        const labelDistance = 9
        const emptySpace = "";
        return(
            <Content>
            <Card>
            <Surface width={screen.width} height={screen.height/3+30}>
                <Group x={margin.left} y={margin.top}>
                    <Group x={0} y={height}>
                        <Group key={-1}>
                            <Shape d={bottomAxisD} stroke={colours.black} key="-1"/>
                              {
                                this.props.club.events.map((d, i) =>(
                                       <Group
                                        x={x(d.name) + labelDx}
                                        y={0}
                                        key={i + 1}
                                    >
                                        <Shape d={this.drawLine(0, notch)} y2={notch} stroke={colours.black}/>
                                        <Text
                                          y={labelDistance}
                                          fill={colours.black}
                                          font="18px helvetica"
                                        >
                                          {d.name.substring(0,2)}
                                        </Text>
                                    </Group>
                                ))
                              }
                        </Group>
                        <Group key={-2} >
                            <Shape stroke={colours.black} d={leftAxisD} key="-1"/>
                            {
                                leftAxis.map((d, i) => (
                                    <Group x={0} y={y(d)-height} key={i + 1}>
                                        <Shape d={this.drawLine(notch, 0)} stroke={colours.black}/>
                                        <Text
                                            fill={colours.black}
                                            x={-15}
                                            y={-labelDistance}
                                            font="18px helvetica"
                                        >
                                            {d + emptySpace}
                                        </Text>
                                    </Group>
                                ))
                            }
                        </Group>
                        {
                            this.props.club.events.map((d, i) => (
                                <TouchableWithoutFeedback key={i} >
                                    <Shape
                                        d={this.createBarChart(x(d.name), y(d.going.length) - height, x.bandwidth(), height - y(d.going.length))}
                                        fill={this.getRandomColor()}
                                        >
                                    </Shape>
                                </TouchableWithoutFeedback>
                            ))
                        }
                    </Group>
                </Group>
            </Surface>
            </Card>
            </Content>
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
