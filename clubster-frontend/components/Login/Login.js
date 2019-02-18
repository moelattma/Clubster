import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Dimensions, Keyboard, AsyncStorage, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield';
import axios from 'axios';
const { width: WIDTH } = Dimensions.get('window');

export default class Login extends React.Component {
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
            // Set token to ls\
            AsyncStorage.setItem('jwtToken', response.data.token);
            axios.defaults.headers.common['Authorization'] = response.data.token;
            this.props.navigation.navigate('ClubsterNavigation');               //Navigate to Clubs page if successful
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center'
  },
  signupText: {
    color: '#fff',
    fontSize: 20,
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
    width: 300,
    height: 60,
    borderRadius: 8
  },
  labelUser: {
    fontSize: 20,
    color: '#414E93',
    marginBottom: 8
  },

});
