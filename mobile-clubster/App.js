import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AdminNavigator, LoginNavigator } from './components/router';

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.SafeAreaView}>
        <LoginNavigator/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
