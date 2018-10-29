import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';


export default class MemberList extends Component {
  constructor(){
    //calling react's constructor, configures this key word 
    super(); 
    this.state={
      memberArr:[]
    };
  }
  componentWillMount(){
    // get request-setup memberArr[]
    axios.get('http://localhost:3000/api/organizations/5bd150152632506f2c53dde1/members').then((response) =>{
      this.setState({memberArr: response.data.organization.members});
      console.log(this.state.memberArr);
    });
  }

  render() {
    //Populate memberArr with ytube vid and customize. Try to be done by end of tuesday
    
    // adb reverse tcp:3000 tcp:3000 if network error occurs in terminal, do in backend
   /* Unhandled promise rejection: Error: Request failed with status code 400]
- node_modules/axios/lib/core/createError.js:16:24 in createError
- node_modules/axios/lib/core/settle.js:19:6 in settle
- ... 11 more stack frames from framework internals*/

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
