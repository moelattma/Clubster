import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield'
import axios from 'axios';

const CLUBSTER_WELCOME = "CLUBSTER_WELCOME";

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
      if (response.status == 200 || response.status == 201) {
        this.props.navigation.navigate('Login');
        axios.post("http://localhost:3000/api/notifications/newNoAuthenticate",
          { type: CLUBSTER_WELCOME, senderID: response.data.user._id });
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
      <KeyboardAwareScrollView contentContainerStyle={styles.regForm} scrollEnabled={true} enableOnAndroid={true}
        enableAutomaticScroll={true} alwaysBounceVertical={true} keyboardShouldPersistTaps="handled" extraScrollHeight={80}>
        <Text style={styles.header}>
          Register for Clubster
        </Text>


        <Text style={styles.labelUser}>Email</Text>
        <TextField
          inputContainerStyle={styles.inputUser}
          /*label="Email"*/
          baseColor="rgba(255, 255, 255, 0.75)"
          tintColor='#59cbbd'
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={email => this.setState({ email })}
          keyboardType="email-address"
          returnKeyType='next'
          error={errors.email}
        />
        <Text style={styles.labelUser}>Username</Text>
        <TextField
          inputContainerStyle={styles.inputUser}
          /*label="Username"*/
          baseColor="rgba(255, 255, 255, 0.75)"
          tintColor='#59cbbd'
          maxLength={12}
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={username => this.setState({ username })}
          returnKeyType='next'
          error={errors.username} />

        <Text style={styles.labelUser}>Name</Text>

        <TextField
          inputContainerStyle={styles.inputUser}
          //label="Name"
          baseColor="rgba(255, 255, 255, 0.75)"
          tintColor='#59cbbd'
          maxLength={20}
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={name => this.setState({ name })}
          returnKeyType='next'
          error={errors.name} />
        <Text style={styles.labelUser}>Password</Text>
        <TextField
          inputContainerStyle={styles.inputUser}
          //label="Password"
          baseColor="rgba(255, 255, 255, 0.75)"
          tintColor='#59cbbd'
          maxLength={14}
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={password => this.setState({ password })}
          returnKeyType='next'
          secureTextEntry={true}
          error={errors.password} />
        <Text style={styles.labelUser}>Confirm password</Text>
        <TextField
          inputContainerStyle={styles.inputUser}
          //label="Confirm password"
          baseColor="rgba(255, 255, 255, 0.75)"
          tintColor='#59cbbd'
          maxLength={14}
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
          returnKeyType='go'
          secureTextEntry={true}
          error={errors.confirmPassword} />


        <TouchableOpacity style={styles.button} onPress={this.validateInput} >
          <Text style={styles.btntext} >
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.login} onPress={() => this.props.navigation.navigate('Login')} >
          <Text style={{ color: '#fff', fontSize: 18 }} > Already have an account? </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  regForm: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#192879',
    paddingLeft: 60,
    paddingRight: 60
  },
  header: {
    fontSize: 30,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomColor: '#59cbbd',
    borderBottomWidth: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputContainer: {
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1
  },
  button: {
    alignSelf: 'center',
    height: 50,
    width: 290,
    marginTop: 25,
    justifyContent: 'center',
    backgroundColor: '#50D9EA',
    marginBottom: 6,
    borderRadius: 8
  },
  btntext: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: "bold",
    textAlign: 'center'
  },
  login: {
    position: 'absolute',
    bottom: 5,
    alignContent: 'center',
    alignSelf: 'center'
  },
  inputUser: {
    width: 300,
    height: 50,
    borderColor: '#43519D',
    backgroundColor: '#283786',
    borderRadius: 8
  },
  labelUser: {
    fontSize: 20,
    color: '#414E93',
    marginBottom: 8
  }
});
