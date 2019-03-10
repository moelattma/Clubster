import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Body } from "native-base";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, ScrollView, ListView } from 'react-native';
import axios from 'axios';
import { ART } from 'react-native';
import Svg, { G, Line, Path, Rect, Text } from 'react-native-svg'
import { max, ticks } from 'd3-array'
import * as d3 from 'd3'

const colours = { black: 'black', blue: 'steelblue', brown: 'brown' }

const { Group, Shape, Surface } = ART;

_handleData = (item) => {
  axios.post(`http://localhost:3000/api/SideGraphs`).then((response) => {
    SideGraph.data = response.data.pipeline;
  })
}

export default class SideGraph extends React.Component {

  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.getRandomColor = this.getRandomColor.bind(this);
  };

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
    const screen = Dimensions.get('window');
    const margin = {top: 50, right: 25, bottom: 200, left: 25}
    const width = screen.width - margin.left - margin.right
    const height = screen.height - margin.top - margin.bottom

    const x = d3.scale.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map(d => d.people)) // not sure about this

    const maxLikes = max(data, d => d.Likes) // use likes since this is most likely going to to largest

    const y = d3.scale.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, maxLikes])

    const events = x(data.events)
    const likes = x(data.totalLikes)
    const comments = x(data.totalComments)
    const labelDx = (likes - events) / 2

    const bottomAxis = [events - labelDx, comments + labelDx]

    const bottomAxisD = d3.shape.line()
                            .x(d => d + labelDx)
                            .y(() => 0)
                            (bottomAxis)

    const leftAxis = ticks(0, maxLikes, 5)

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
        <Surface width={screen.width} height={screen.height}>
            <Group x={margin.left} y={margin.top}>
                <Group x={0} y={height}>
                    <Group key={-1}>
                        <Shape d={bottomAxisD} stroke={colours.black} key="-1"/>
                          {
                            data.map((d, i) =>(
                                <Group
                                    x={x(d.letter) + labelDx}
                                    y={0}
                                    key={i + 1}
                                >
                                    <Shape d={this.drawLine(0, notch)} y2={notch} stroke={colours.black}/>
                                    <Text
                                      y={labelDistance}
                                      fill={colours.black}
                                      font="18px helvetica"
                                    >
                                      {d.letter}
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
                        data.map((d, i) => (
                            <TouchableWithoutFeedback key={i} >
                                <Shape
                                    d={this.createBarChart(x(d.letter), y(d.Likes) - height, x.bandwidth(), height - y(d.Likes))}
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
