import React, { Component } from 'react';
import { AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import ClubsPage from './components/ClubsPage';
import { StackNavigator } from 'react-navigation';
import Login from './components/Login';
import SignUp from './components/SignUp';
export default class App extends Component {

  render() {
    return (
      <AppNavigator/>
    );
  }
}

const AppNavigator = StackNavigator({
  LoginScreen: { screen: Login },
  SignUp: { screen: SignUp },
  ClubsPage: {
    screen: ClubsPage,
    navigationOptions: {
      title: "ClubsPage"
    }
  }
});


AppRegistry.registerComponent('App', () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#36485f',
    paddingLeft: 60,
    paddingRight: 60
  }
})
