import React from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Text, View, Dimensions } from 'react-native';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

const { width:WIDTH } = Dimensions.get('window');
export default class Login extends React.Component {
  state = { username: '', password: '' };                           //state initialization
  handleUserNameChange = username => this.setState({ username });   //ES6 fucntions that keep track of usernames and passwords
  handlePasswordChange = password => this.setState({ password });
  handleLogin = () => {
    const {username, password} = this.state;                        //Destructuring
    console.log(username + ' ' + password);
    if(username && password) {
      axios.post('http://localhost:3000/api/login', {               //POST with payload
        username,
        password
      })
      .then(response => {
        console.log(response.data.token);
        this.props.navigation.navigate('UserHome');               //Navigate to CLubs page if successful
      })
      .catch((err) => {
        console.log(err);                                           //Err
      });
    } else {
      console.log('error');                                         //errors printing
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput                                                  //TextInputs with onChangeText built in
          style={styles.input}
          placeholder={'Username'}
          placeholderTextColor={'rgba(255, 255, 255, 0.9)'}
          onChangeText = {this.handleUserNameChange}
          underlineColorAndroid='transparent'
        />

        <TextInput
          style={styles.input}
          placeholder={'Password'}
          placeholderTextColor={'rgba(255, 255, 255, 0.9)'}
          onChangeText = {this.handlePasswordChange}
          underlineColorAndroid='transparent'
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.login} onPress = {this.handleLogin.bind(this)}>
          <Text style={styles.loginText}> Log In </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signup} onPress = {() => this.props.navigation.navigate('SignUp')} >
          <Text style={styles.signupText}> Sign Up </Text>
        </TouchableOpacity>
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
  },
  inputContainer: {
    marginTop: 10
  },
  input: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1
  },
  login: {
    alignSelf: 'center',
    backgroundColor: '#59cbbd',
    height: 40,
    width: WIDTH / 2
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5
  },
  signupText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5
  }
});
