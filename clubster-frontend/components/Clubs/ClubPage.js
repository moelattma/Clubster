import React, { Component } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Button,
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import Icon from 'react-native-vector-icons/Ionicons';
const Form = t.form.Form;



const Organization = t.struct({
  Name: t.String,
  Abbreviation: t.String,
  Purpose: t.String,
  Description: t.String
});

const formatData = (data, columnNums) => {
  let rowsFull = Math.floor(data.length / columnNums);
  let lastRowNum = data.length % columnNums;
  for (; lastRowNum != columnNums && lastRowNum !== 0;) {
    data.push({ key: `blank-${lastRowNum}`, empty: true });
    lastRowNum++;
  }
  return data;
}

const numColumns = 3;
export default class ClubsPage extends Component {

  constructor() { // Initializing state
    super();
    this.state = {
      arrClubsAdmin: [],
      show: false
    }
  }

  renderItem = ({ item, index }) => {
    if (item.hasOwnProperty('empty') && item.empty === true) {
      return <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}><View style={[styles.item, styles.itemInvisible]} /></TouchableWithoutFeedback>;
    }
    const { screenProps } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => screenProps.home.navigate('AdminNavigation', { item })}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  handleSubmit = () => {
    const name = this._formRef.getValue().Name;
    const acronym = this._formRef.getValue().Abbreviation;
    const purpose = this._formRef.getValue().Purpose;
    const description = this._formRef.getValue().Description;
    axios.post('http://localhost:3000/api/organizations/new', {name:name,acronym:acronym,purpose:purpose,description:description}).then((organization)=> {
      console.log(organization);
      this.setState({show:false});
      this.setState({ arrClubsAdmin: this.state.arrClubsAdmin.concat(organization.data)});
    }).catch((error) => {
      console.log(error);
    });
  }

  renderElement() {
    if (this.state.show == true) {
      return (
        <View style={{ flex: 1 }}>
          <Form type={Organization} ref={(ref) => this._formRef = ref} />
          <Button title="Sign Up!" onPress={this.handleSubmit} />
        </View>);
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList data={formatData(this.state.arrClubsAdmin, numColumns)} renderItem={this.renderItem} numColumns={numColumns} keyExtractor={(admin) => admin} />
        <TouchableOpacity style={styles.btn} onPress={() => { this.setState({ show: true }); }}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  componentDidMount() {
    axios.get("http://localhost:3000/api/organizations").then((response) => {
      this.setState({ arrClubsAdmin: response.data.user.arrayClubsAdmin }); // Setting up state variable
      console.log(this.state.arrClubsAdmin);
    }).catch((err) => console.log(err));
  };

  render() {
    return (
      // Container for the whole body
      <View style={styles.container}>
        <Button onPress={() => this.props.navigation.navigate('ClubSearch')} title="Search Clubs"/>

        {this.renderElement()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 82,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    flex: 1,
    marginVertical: 20,
  },
  btn: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plus: {
    fontSize: 40,
    color: 'white'
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  }
});
