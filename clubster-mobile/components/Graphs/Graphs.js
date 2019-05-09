import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux'
import { Container } from 'native-base';
import axios from 'axios';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from '../../node_modules/react-native-svg-charts/node_modules/d3-scale';

import SideGraph from './SideGraph';
import ActiveChart from './ActiveChart';

export class Graphs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      club: [],
      name: '',
      description: '',
      date: '',
      location: '',
      time: '',
      data: [6],
      names: []
    }
  }

  componentWillMount() {
    this.getOrgData();
  }

  getOrgData() {
    let eventLengths = [];
    let eventNames = [];
    const { club } = this.props;
    for (let i = 0; i < club.events.length; i++) {
      eventLengths.push(club.events[i].going.length);
      eventNames.push(club.events[i].name ? club.events[i].name.substring(0, 2) : 'DNE');
    }
    this.setState({ data: eventLengths, names: eventNames });
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }

    return (
      <Container>
        <Header
          backgroundColor={'transparent'}
          leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.navigate('HomeNavigation') }}
        />
        <SideGraph club={this.props.club} />
        <ActiveChart club={this.props.club} />
        {(this.state.data != null && this.state.data.length != 0) ?
          <View style={{ height: 200, padding: 20 }}>
            <BarChart
              style={{ flex: 1 }}
              data={this.state.data}
              gridMin={0}
              svg={{ fill: 'rgb(134, 65, 244)' }}
            />
            <XAxis
              style={{ marginTop: 10 }}
              data={this.state.names}
              xAccessor={({ index }) => index}
              scale={scale.scaleBand}
              formatLabel={(_, index) => this.state.names[index]}
              labelStyle={{ color: 'black' }}
            />
          </View> :
          null
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { club: state.clubs.club }
}

export default connect(mapStateToProps, null)(Graphs);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    color: '#CCC',
  },
  text: {
    color: '#3F51B5',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
