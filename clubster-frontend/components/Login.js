import React from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Text, View, Dimensions } from 'react-native';

const { width:WIDTH } = Dimensions.get('window');
export default class Login extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TextInput
           style={styles.input}
           placeholder={'Username'}
           placeholderTextColor={'rgba(255, 255, 255, 0.9)'}
           underlineColorAndroid='transparent'
         />

        <TextInput
          style={styles.input}
          placeholder={'Password'}
          placeholderTextColor={'rgba(255, 255, 255, 0.9)'}
          underlineColorAndroid='transparent'
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.login}>
          <Text style={styles.loginText}> Log In </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signup} onPress={this.prop}>
          <Text style={styles.signupText}> Sign Up </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
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
