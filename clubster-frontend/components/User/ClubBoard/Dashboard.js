import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

export default class Dashboard extends Component {
  render() {
    const { screenProps } = this.props;
    
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});
