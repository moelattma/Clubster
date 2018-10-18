import React from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Text, View, Dimensions } from 'react-native';

const { width:WIDTH } = Dimensions.get('window');
export default class Login extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            style={styles.input}
            placeholder={'Username'}
            placeholderTextColor={'rgba(255, 255, 255, 0.9)'}
            underlineColorAndroid='transparent'
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={'Password'}
            placeholderTextColor={'rgba(255, 255, 255, 0.9)'}
            underlineColorAndroid='transparent'
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity style={styles.login}>
          <Text style={styles.text}> Log In </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signup} onPress={this.prop}>
          <Text style={styles.text}> Sign Up </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginTop: 10
  },
  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 25
    
  }, 
  login: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#3137A7',
    justifyContent: 'center',
    marginTop: 13
  },
  text: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center'
  },
  signup: {
    position: 'absolute',
    width: WIDTH / 3,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#3137A7',
    justifyContent: 'center',
    bottom: '1%'
  }
});
