import React from 'react';
import { TouchableOpacity, StyleSheet, Text, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux'
import { USER_LOGIN, CLUBS_SET } from '../../reducers/ActionTypes'

import axios from 'axios';

class Login extends React.Component {
  state = {
    username: 'mohamedzak',
    password: 'mohamed123'
  };

  handleLogin = () => {
    const { username, password } = this.state;                        //Destructuring
    if (username && password) {
      axios.post('http://localhost:3000/api/login', {               //POST with payload
        username,
        password
      })
        .then(response => {
          if (response.status == 200) {
            const { token } = response.data;
            var user = response.data.user;
            // Set token to ls\
            AsyncStorage.setItem('jwtToken', token);
            axios.defaults.headers.common['Authorization'] = token;
            this.props.navigation.navigate('ClubsterNavigation');               //Navigate to Clubs page if successful
            
            this.props.setClubs(user.arrayClubsAdmin, user.arrayClubsMember);
            delete user.arrayClubsAdmin;
            delete user.arrayClubsMember;
            this.props.userLogin(user);
          }
        })
        .catch((err) => {
          console.log('Not a valid account: ', err);                                           //Err
        });
    } else {
      console.log('error');                                         //errors printing
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={true} enableOnAndroid={true}
        alwaysBounceVertical={true} extraScrollHeight={40} keyboardShouldPersistTaps="handled" >

        <Text style={styles.logoName}>Clubster</Text>

        <TextField
          inputContainerStyle={styles.inputUser}
          label="Username"
          baseColor="rgba(255, 255, 255, 0.75)"
          tintColor='#59cbbd'
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={username => this.setState({ username })}
          returnKeyType='next'
        />

        <TextField
          inputContainerStyle={styles.inputUser}
          label="Password"
          baseColor="rgba(255, 255, 255, 0.75)"
          tintColor='#59cbbd'
          textColor="rgba(255, 255, 255, 1)"
          onChangeText={password => this.setState({ password })}
          secureTextEntry={true}
          returnKeyType='none'
        />

        <TouchableOpacity style={styles.login} onPress={this.handleLogin.bind(this)}>
          <Text style={styles.loginText}> Log In </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} >
          <Text style={styles.signupText}> Sign Up </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (user) => dispatch({
      type: USER_LOGIN,
      payload: { user }
    }),
    setClubs: (clubsAdmin, clubsMember) => dispatch({
      type: CLUBS_SET,
      payload: { clubsAdmin, clubsMember }
    })
  }
}

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#192879',
    paddingLeft: 60,
    paddingRight: 60
  },
  inputContainer: {
    marginTop: 30
  },
  login: {
    alignSelf: 'center',
    backgroundColor: '#50D9EA',
    height: 50,
    width: 290,
    marginTop: 30,
    justifyContent: 'center',
    marginBottom: 6,
    borderRadius: 8
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: "bold",
    textAlign: 'center'
  },
  signupText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5
  },
  logoName: {
    fontSize: 60,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#fff'
  },
  inputUser: {
    borderBottomColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomWidth: 1
  },
  labelUser: {
    fontSize: 20,
    color: '#414E93',
    marginBottom: 8
  },
});
