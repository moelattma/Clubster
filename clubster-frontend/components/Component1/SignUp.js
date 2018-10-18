import React from 'react';
import { AppRegistry, StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

export default class SignUp extends React.Component {
  render() {
    return (
      // body of the screen
      <View style={styles.regForm}>
        
        {/* header */}
        <View>
          <Text style = {styles.header}>
            Clubster Registration page
          </Text>
        </View> 
      
        {/* Content for  Name  */}
        <TextInput style ={styles.textinput} placeholder ="Your Full Name" underlineColorAndroid ={'transparent'} />

        {/* Content for Email  */}
        <TextInput style ={styles.textinput} placeholder ="Your email" underlineColorAndroid ={'transparent'} />

        {/* Content for Password  */}
        <TextInput style ={styles.textinput} placeholder ="Your password" secureTextEntry={true} underlineColorAndroid ={'transparent'} />

        {/* Content for SignUp button */}
       <TouchableOpacity style ={styles.button}>
        <Text style ={styles.btntext}>
          Sign UP
        </Text>
       </TouchableOpacity>


      </View>
    );
  }
}


const styles = StyleSheet.create({
  regForm: {
    alignSelf: 'stretch',
  },
// Header container
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
    fontWeight: 'bold',
  },

  textinput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },

  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',
    marginTop: 30,
  },

  btntext: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
  }

});