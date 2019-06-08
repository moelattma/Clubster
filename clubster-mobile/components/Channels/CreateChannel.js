import React from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { ImagePicker, Permissions } from 'expo';
var moment = require('moment-timezone');
import { Thumbnail, Text, Button, Icon, Form, Item, Input, ListItem, Left, Body, Right } from 'native-base';
import v1 from 'uuid/v1';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux'
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { EVENTS_CREATE } from '../../reducers/ActionTypes';
import { ScrollView } from 'react-native-gesture-handler';
import Tags from "react-native-tags";
import CheckBox from 'react-native-check-box'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;

export class CreateChannel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: '',
          members: [],
          admins: [],
          membersClicked: [],
          adminsClicked: [],
          membersClickedName: [],
          adminsClickedName: [],
          channels: [],
          displayMembers: false,
          displayAdmins: false,
          isChecked: true,
          updateMembers: Math.random(),
          updateAdmins: Math.random()
        }
    }

    componentDidMount() {
      axios.get(`http://localhost:3000/api/organizations/${this.props.clubID}/members`).then((response) => {
        this.setState({ members: response.data.members, admins: response.data.admins })
      });
    }

    _showModalMembers = () => {
      this.setState({ showMembers: true });
    }

    _showModalAdmins = () => {
      this.setState({ showAdmins: true });
    }

    _hideModal = () => {
      this.setState({ showMembers: false });
    }

    markCandidateMember = (item) => {
        let _id = item.item.member._id;
        let name = item.item.member.name;
        console.log(_id);
        let membersClicked = this.state.membersClicked;
        let membersClickedName = this.state.membersClickedName;
        if(membersClicked.includes(_id) && membersClickedName.includes(name)) {
          membersClicked.splice(membersClicked.indexOf(_id),1);
          membersClickedName.splice(membersClickedName.indexOf(name),1);
        } else {
          membersClicked.push(_id);
          membersClickedName.push(name);
        }
        this.setState({ membersClicked, membersClickedName, updateMembers: Math.random()});
        console.log(this.state.membersClickedName);
    }

    markCandidateAdmin = (item) => {
        let _id = item.item._id;
        let name = item.item.name;
        let adminsClicked = this.state.adminsClicked;
        let adminsClickedName = this.state.membersClickedName;
        if(adminsClicked.includes(_id)) {
          adminsClicked.splice(adminsClicked.indexOf(_id),1);
          adminsClickedName.splice(adminsClickedName.indexOf(name),1);
        } else {
          adminsClicked.push(_id);
          adminsClickedName.push(name);
        }
        this.setState({ adminsClicked, adminsClickedName, updateAdmins: Math.random()});
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    useLibraryHandler = async () => {
        await this.askPermissionsAsync();
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                base64: false,
            });
            if (result.cancelled)
                return;
            const key = `${v1()}.jpeg`;
            const file = {
                uri: result.uri,
                type: 'image/jpeg',
                name: key
            };
            const options = {
                keyPrefix: 's3/',
                bucket: 'clubster-123',
                region: 'us-east-1',
                accessKey: accessKeyId,
                secretKey: secretAccessKey,
                successActionStatus: 201
            }
            await RNS3.put(file, options).then((response) => {
                this.setState({
                    imageURL: response.body.postResponse.key,
                    uri: 'https://s3.amazonaws.com/clubster-123/' + response.body.postResponse.key,
                    isImageUploaded: true
                });
            }).catch((err) => { console.log('upload image to aws failed'); console.log(err) });
        } catch (error) { console.log('library handle failed'); console.log(error); }
    }

    createChannel = () => {
      let admins = this.state.adminsClicked.join();
      let members = this.state.membersClicked.join();
      const { name } = this.state;
      console.log(admins, members, name);
      const channel = [];
      axios.post(`http://localhost:3000/api/channels/${this.props.clubID}`, {
        name, members, admins
      }).then(response => {
        console.log(response.data.channel);
      }).catch(error => console.log(error + 'ruh roh'));
      return;
    }

    _renderItem = (item) => {
      console.log(item);
      let url = 'https://s3.amazonaws.com/clubster-123/' + item.item.member.image;
      return (
          <ListItem>
              <Left>
                  <Thumbnail source={{ uri: url }} />
              </Left>
              <Body>
                  <Text>{item.item.member.name}</Text>
              </Body>
              <Right>
                <CheckBox
                  style={{flex: 1, padding: 10}}
                  onClick={() => this.markCandidateMember(item)}
                  isChecked={this.state.membersClicked.includes(item.item.member._id)}
                  leftText={"CheckBox"}
                />
              </Right>
          </ListItem>
      );
    }

    _renderItemAdmin = (item) => {
      let url = 'https://s3.amazonaws.com/clubster-123/' + item.item.admin.image;
      return (
          <ListItem>
              <Left>
                  <Thumbnail source={{ uri: url }} />
              </Left>
              <Body>
                  <Text>{item.item.admin.name}</Text>
              </Body>
              <Right>
                <CheckBox
                  style={{flex: 1, padding: 10}}
                  onClick={() => this.markCandidateAdmin(item)}
                  isChecked={this.state.adminsClicked.includes(item.item._id)}
                  leftText={"CheckBox"}
                />
              </Right>
          </ListItem>
      );
    }
    // modal for when user enters invalid fields
    openValidModal() {
        this.setState({
            validModal: true
        })
    }

    findImageOfMember = (name) => {
      console.log('Here are the memebrs', this.state.members);
      console.log(name);
      for(var i = 0;i<this.state.members.length;i++) {
        if(this.state.members[i].member.name == name) {
          console.log(typeof(this.state.members[i].member.image));
          return this.state.members[i].image;
        }
      }
    }

    renderItemArr = () => {
      return (
        <View>
          <Text> Hi</Text>
        </View>
      )
    }

    closeValidModal() { this.setState({ validModal: false }) }

    render() {
      const { name } = this.state
      return (
          <ScrollView>
              <Form>
                  <Item>
                      <Input placeholder="Name"
                          label='name'
                          onChangeText={(name) => this.setState({ name })}
                          value={name}
                      />
                  </Item>
                  <Item>
                      <TouchableOpacity
                          onPress={() => {
                              this._showModalMembers()
                          }}
                          style={{
                              height: 50,
                              paddingLeft: 5,
                              paddingRight: 5,
                              flex: 1,
                              flexDirection: 'row',
                              alignSelf: 'center',
                              alignItems: 'center'
                          }}>
                          <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Add Members</Text>
                      </TouchableOpacity>
                  </Item>
                  <Item>
                    <TouchableOpacity
                        onPress={() => {
                            this._showModalAdmins()
                        }}
                        style={{
                            height: 50,
                            paddingLeft: 5,
                            paddingRight: 5,
                            flex: 1,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            alignItems: 'center'
                        }}>
                        <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Add Admins</Text>
                      </TouchableOpacity>
                  </Item>
              </Form>
              <ScrollView horizontal>
                <Tags
                  initialTags={this.state.membersClickedName}
                  containerStyle={{ justifyContent: "center" }}
                  readonly = {true}
                  inputStyle={{ backgroundColor: "white" }}
                  renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                    <TouchableOpacity disabled={true} key={`${tag}-${index}`} style = {styles.tag}>
                      <Thumbnail small source={{ uri: 'https://s3.amazonaws.com/clubster-123/' + this.findImageOfMember(tag) }} />
                      <Text> {tag}</Text>
                    </TouchableOpacity>
                  )}
                />
              </ScrollView>

              <Modal isVisible={this.state.showMembers} style={styles.modalStyle}>
                <View>
                  <FlatList
                    data={this.state.members}
                    renderItem={this._renderItem}
                    keyExtractor={member => member._id}
                    extraData={this.state.updateMembers}
                  />
                  <Button block
                   style={styles.button} onPress = {() => this.setState({showMembers:false})}>
                      <Text style={{color: '#fff'}}> Submit </Text>
                  </Button>
                </View>
              </Modal>

              <Modal isVisible={this.state.showAdmins} style={styles.modalStyle}>
                <View>
                  <FlatList
                    data={this.state.admins}
                    renderItem={this._renderItemAdmin}
                    keyExtractor={admins => admins._id}
                    extraData={this.state.updateAdmins}
                  />
                  <Button block danger
                  style={styles.button} onPress = {() => this.setState({showAdmins:false})}>
                      <Text style={{color: '#fff'}}> Submit </Text>
                  </Button>
                </View>
              </Modal>

                  {this.state.isImageUploaded == false
                      ?
                      <TouchableOpacity onPress={this.useLibraryHandler}>
                          <Thumbnail square small style={styles.uploadIcon}
                              source={{ uri: this.state.uri }} />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={this.useLibraryHandler}>
                          <Thumbnail square small style={styles.imageThumbnail}
                              source={{ uri: this.state.uri }} />
                      </TouchableOpacity>
                  }

              <Button bordered
                  onPress={() => this.createChannel()}
                  style={{
                      margin: 20, width: 160,
                      justifyContent: 'center', alignSelf: 'center'
                  }}>
                  <Text>Create Channel!</Text>
              </Button>
          </ScrollView>
      );
  }
}

const mapStateToProps = (state) => {
    return {
        clubID: state.clubs.club._id
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        newClubEvent: (event) => dispatch({
            type: EVENTS_CREATE,
            payload: { event }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChannel);

const styles = StyleSheet.create({
    button: {
        maxWidth: WIDTH,
        minWidth: WIDTH/2,
    },
    modalStyle: {
        backgroundColor: 'white',
        padding: 4,
        marginTop: 50,
        marginRight: 20,
        marginBottom: 30,
        marginLeft: 20,
        borderRadius: 6
    },
    tag: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      backgroundColor: "#e0e0e0",
      borderRadius: 16,
      padding: 5,
      margin: 4
    },
    eventCard: {
        flex: 1,
        backgroundColor: 'lavender',
        marginVertical: 3,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    },
    eventContainer: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0,
        height: EVENT_HEIGHT,
        width: EVENT_WIDTH,
        alignSelf: 'center',
        marginTop: 25
    },
    eventTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 5,
        flex: 1
    },
    eventTitle2: {
        position: 'absolute',
        right: 2,
        top: 2,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    },
    uploadIcon: {
        alignSelf: 'center',
        margin: 10,
    },
    imageThumbnail: {
        margin: 20,
        alignSelf: 'center',
        borderRadius: 2,
        width: WIDTH / 1.5,
        height: HEIGHT / 4
    },
});
