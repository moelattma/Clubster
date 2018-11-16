import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield'
import axios from 'axios';

const { height: HEIGHT } = Dimensions.get('window');

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
      if (response.status == 201) {
        this.props.navigation.navigate('Login');
      }
    }).catch(err => console.log('Could not sign up', err));
  };

  validateInput = () => {
    let errors = {};
    if (this.state != null) {
      const { email, password, confirmPassword, name, username } = this.state;

      if (email == null || !email.includes('@ucsc.edu'))
        errors['email'] = 'Must be a UCSC email'
      if (name == null)
        errors['name'] = 'Please enter your full name'
      if (username == null || username.length < 6)
        errors['username'] = 'Username must be at least 6 letters'
      if (password == null || password.length < 8)
        errors['password'] = 'Password must be at least 8 letters'
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
      <KeyboardAwareScrollView contentContainerStyle={styles.regForm} scrollEnabled={true} ref={ref => this._scrollView = ref}
        enableOnAndroid={true} alwaysBounceVertical={true} extraScrollHeight={40} keyboardShouldPersistTaps="handled" >
        <Text style={styles.header}>
          Register for Clubster
        </Text>

        <TextField                                            // TextInputs with onChangeText
          inputContainerStyle={styles.inputContainer}
          label="Email"
          baseColor="rgba(255, 255, 255, 0.75)"
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={email => this.setState({ email })}
          keyboardType="email-address"
          returnKeyType='next'
          error={errors.email}
        />

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
          onFocus={() => this._scrollView.scrollToEnd({ animated: true })}
          secureTextEntry={true}
          error={errors.confirmPassword} />

        <TouchableOpacity style={styles.button} onPress={this.validateInput} >
          <Text style={styles.btntext}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.login} onPress={() => this.props.navigation.navigate('Login')} >
          <Text style={{ color: '#fff', fontSize: 18 }}> Already have an account? </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  regForm: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#03A9F4',
    paddingLeft: 60,
    paddingRight: 60
  },
  header: {
    fontSize: 30,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomColor: 'black',
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
  },
  login: {
    position: 'absolute',
    bottom: 5,
    alignContent: 'center',
    alignSelf: 'center'
  }
});
