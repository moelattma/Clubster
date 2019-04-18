import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import App from './components/router';

import { Provider } from 'react-redux';
import store from './reducers/index';

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

export default class Clubster extends Component {
  render() {
    return (
        <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.SafeAreaView}>
            <Provider store={store}>
              <App />
            </Provider> 
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  SafeAreaView: {
      flex: 1,
      backgroundColor: '#E0E0E0'
  }
})
