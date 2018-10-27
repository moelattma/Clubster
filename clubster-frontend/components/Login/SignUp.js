import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
export default class SignUp extends Component {
  state = {                                     //state initilaization
    email: '',
    password: '',
    name: '',
    username: ''
  };
  handleEmailChange = email => this.setState({ email });      //ES6 functions that keep track of vars
  handlePasswordChange = password => this.setState({password});
  handleNameChange = name => this.setState({name});
  handleUserNameChange = username => this.setState({username});
  submitData = () => {
    const {email, password, name, username} = this.state;
    axios.post('http://localhost:3000/api/register', {          //POST with payload
      email,
      password,
      username,
      name
    }).then(response => {
      if(response.status == 201) {
        this.props.navigator.pop();                           //Pop off signjup once done
      }
    }).catch(err => console.log(err));
  };


  render() {
    return (
      <View style={styles.regForm}>
        <View>
          <Text style={styles.header}>
            Register for Clubster
          </Text>
        </View>

        <TextInput                                            // TextInputs with onChangeText
          style={styles.textinput}
          placeholder="Email"
          onChangeText = {this.handleEmailChange}
          underlineColorAndroid={'transparent'} />

        <TextInput
          style={styles.textinput}
          placeholder="Username"
          onChangeText = {this.handleUserNameChange}
          underlineColorAndroid={'transparent'} />

        <TextInput
          style={styles.textinput}
          placeholder="Name"
          onChangeText = {this.handleNameChange}
          underlineColorAndroid={'transparent'} />

        <TextInput
          style={styles.textinput}
          placeholder="Password"
          onChangeText = {this.handlePasswordChange}
          secureTextEntry={true}
          underlineColorAndroid={'transparent'} />

        <TouchableOpacity style={styles.button} onPress = {this.submitData.bind(this)}>
          <Text style={styles.btntext}>
            Sign Up
         </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  regForm: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#36485f',
    paddingLeft: 60,
    paddingRight: 60
  },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textinput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',
    marginTop: 30
  },
  btntext: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25
  }
});
