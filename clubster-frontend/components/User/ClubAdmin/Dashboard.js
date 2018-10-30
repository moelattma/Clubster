import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

export default class Dashboard extends Component {  
  render() {
    const { screenProps } = this.props;
    console.log('hello');
    console.log(    screenProps.organization      );
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#36485f',
    paddingLeft: 60,
    paddingRight: 60
  }
});
