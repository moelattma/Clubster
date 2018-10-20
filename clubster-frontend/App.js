import React, { Component } from 'react';
import { AppRegistry, 
  StyleSheet, 
  View, 
} from 'react-native';

// import Login from './components/Login';
//import SignUp from './components/SignUp';
import ClubsPage from './components/ClubsPage';
//import Boxes from './components/Boxes';

 
export default class App extends Component {
  
  render() {
    return (
      // <View style ={styles.container}>
      //   <ClubsPage></ClubsPage>
      // </View>
      <ClubsPage></ClubsPage>     

    );
  }
}

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