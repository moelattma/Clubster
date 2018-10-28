import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextField } from 'react-native-material-textfield'
import axios from 'axios';

export default class SignUp extends Component {
  state = {                                     //state initilaization
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: ''
  };

  submitData = () => {
    const { email, password, name, username } = this.state;
    axios.post('http://localhost:3000/api/register', {          //POST with payload
      email,
      password,
      username,
      name
    }).then(response => {
      console.log(response.status);
      if (response.status == 200) {
        this.props.navigator.pop();                           //Pop off signup once done
      }
    }).catch(err => console.log('Could not sign up', err));
  };

  validateInput = () => {
    let errors = {};
    if (this.state != null) {
      const { email, password, confirmPassword, name, username } = this.state;

      if (email == null || !email.includes('@ucsc.edu'))
        errors['email'] = 'Must be a UCSC email'
      if (name == null || !name.includes(' '))
        errors['name'] = 'Please enter your first and last name'
      if (username == null || username.length < 6)
        errors['username'] = 'Username is too short'
      if (password == null || password.length < 8)
        errors['password'] = 'Password is too short'
      if (password == null || confirmPassword == null || password != confirmPassword)
        errors['confirmPassword'] = 'Passwords do not match'
      this.setState({ errors });
      if (Object.keys(errors).length == 0)
        this.submitData();
    }
  }

  render() {
    let { errors = {} } = this.state;

    return (
      <View style={styles.regForm}>
        <View>
          <Text style={styles.header}>
            Register for Clubster
          </Text>
        </View>

        <TextField                                            // TextInputs with onChangeText
          inputContainerStyle={styles.inputContainer}
          label="Email"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={email => this.setState({ email })}
          returnKeyType='next'
          error={errors.email} />

        <TextField
          inputContainerStyle={styles.inputContainer}
          label="Username"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={username => this.setState({ username })}
          returnKeyType='next'
          error={errors.username} />

        <TextField
          inputContainerStyle={styles.inputContainer}
          label="Name"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={name => this.setState({ name })}
          returnKeyType='next'
          error={errors.name} />

        <TextField
          inputContainerStyle={styles.inputContainer}
          label="Password"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={password => this.setState({ password })}
          returnKeyType='next'
          secureTextEntry={true}
          error={errors.password} />

        <TextField
          inputContainerStyle={styles.inputContainer}
          label="Confirm password"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
          returnKeyType='none'
          secureTextEntry={true}
          error={errors.confirmPassword} />

        <TouchableOpacity style={styles.button} onPress={this.validateInput} >
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
    fontSize: 30,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputContainer: {
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
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
