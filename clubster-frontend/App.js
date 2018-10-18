import React from 'react';
import{AppRegistry, StyleSheet, Text, View } from 'react-native';


import SignUp from './components/Component1/SignUp';

// const { width:WIDTH } = Dimensions.get('window');


export default class App extends React.Component {
  render() {

    return (
       <View style ={styles.container}>
        <SignUp></SignUp>
      </View>
      // <Login></Login>

    );
  }
}
AppRegistry.registerComponent('App', ()=> App);

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: '#36485f',
    paddingLeft: 60,
    paddingRight:60,
  }
})