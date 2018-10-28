import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import axios from 'axios';
const { width:WIDTH } = Dimensions.get('window');

export default class Login extends React.Component {
  state = { 
    username: '', 
    password: '' 
  };                           

  handleLogin = () => {
    const { username, password } = this.state;                        //Destructuring
    if(username && password) {
      axios.post('http://localhost:3000/api/login', {               //POST with payload
        username,
        password
      })
      .then(response => {
        if(response.status == 200) {
          this.props.navigation.navigate('HomeNavigation');               //Navigate to Clubs page if successful
      }})
      .catch((err) => {
        console.log('Not a valid account: ', err);                                           //Err
      });
    } else {
      console.log('error');                                         //errors printing
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextField                                                  //TextInputs with onChangeText built in
          inputContainerStyle={styles.textContainer}
          label="Username"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={username => this.setState({ username })}
          returnKeyType='next'
        />

        <TextField
          inputContainerStyle={styles.textContainer}
          label="Password"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={password => this.setState({ password })}
          secureTextEntry={true}
          returnKeyType='none'
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
  textContainer: {
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1
  },
  login: {
    alignSelf: 'center',
    backgroundColor: '#59cbbd',
    height: 40,
    width: WIDTH / 2,
    marginTop: 15,
    marginBottom: 2
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
