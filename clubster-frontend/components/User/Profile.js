import React, { Component } from 'react';
import { Modal,View, StyleSheet, Text, Image, TouchableOpacity, Button, TextInput } from 'react-native';
import { ImagePicker, Permissions, Constants } from 'expo';
import axios from 'axios';
import converter from 'base64-arraybuffer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            show:false,
            result: null,
            img:null,
            major: '',
            hobbies: '',
            Facebook: '',
            Instagram: '',
            LinkedIn: '',
        }
    }

    askPermissionsAsync = async () => {
      await Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      // you would probably do something to verify that permissions
      // are actually granted, but I'm skipping that for brevity
    };

    hide = () => {
      return;
    }

    _showModal = () => this.setState({ show: true })
    _hideModal = () => this.setState({ show: false })

    submitProfile(){
        axios.post('http://localhost:3000/api/profile', {
            major: this.state.major, hobbies: this.state.hobbies,
            facebook: this.state.facebook, Instagram: this.state.Instagram,
            LinkedIn: this.state.LinkedIn
        })
    }

    useLibraryHandler = async () => {
      await this.askPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
      });

      const data = new FormData();
      data.append('name', 'avatar');
      data.append('fileData', {
        uri : result.uri,
        type: 'multipart/form-data',
        name: "image1.jpg"
      });
      const config = {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        },
        body: data,
      };
      fetch("http://localhost:3000/" + "api/img_data", config)
      .then((checkStatusAndGetJSONResponse)=>{
      console.log(checkStatusAndGetJSONResponse);
      }).catch((err)=>{console.log(err)});
      this.setState({ result });
  };

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    useCameraHandler = async () => {
      await this.askPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
      });
      this.setState({ result });
    };

    onSubmit = () => {
      axios.post(`http://localhost:3000/api/img_data`).then((response) => {
        console.log(response); // Setting up state variable
      }).catch((err) => console.log(err));
    }

    componentDidMount() {
      fetch('http://localhost:3000/api/img_data')
      .then((res) => res.json())
      .then((data) => {
        // console.log(img)
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = converter.encode(data.img.data.data);
        this.setState({
            img: base64Flag + imageStr
        });
      });
    }

    render() {
        return (

            <View style={{flex:1}}>
                <View style={styles.tContainer}>

                </View>
                <View style={styles.profilePic}>
                    <Image style={styles.profilePicWrap} source={require('../../images/adnan.png')} />

                </View>
                <Text style={styles.name}> Aimal Khan </Text>
                <Text style={styles.major}> major:{this.state.major}</Text>
                <Text style={styles.major}> Hobbies:{this.state.hobbies}</Text>
                <Text style={styles.major}> Facebook:{this.state.facebook}</Text>
                <Text style={styles.major}> Instagram:{this.state.Instagram}</Text>
                <Text style={styles.major}> LinkedIn:{this.state.LinkedIn}</Text>




                {/* MODAL  */}
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.editButton} onPress={this._showModal} >
                        <MaterialCommunityIcons
                            name="account-edit"
                            size={35}
                            color={'black'}
                        />
                    </TouchableOpacity>

                    <Modal isVisible={this.state.show} onRequestClose = {this.hide}>
                        <View style={styles.modalView}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                Edit Profile
                            </Text>
                            <TextInput placeholder = "Major" onChangeText={(major) => this.setState({major})} value={this.state.major}/>

                            <TextInput placeholder = "Hobbies(seperated by ,)" onChangeText={(hobbies) => this.setState({hobbies})} value={this.state.hobbies}/>
                            <TextInput placeholder = "Facebook" onChangeText={(Facebook) => this.setState({Facebook})} value={this.state.Facebook}/>
                            <TextInput placeholder = "Instagram" onChangeText={(Instagram) => this.setState({Instagram})} value={this.state.Instagram}/>
                            <TextInput placeholder = "LinkedIn" onChangeText={(LinkedIn) => this.setState({LinkedIn})} value={this.state.LinkedIn}/>

                            <TouchableOpacity onPress={() => {this.submitProfile()}}>
                                <Text style={styles.SubmitBtn}>Save</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => {this.setState({show: false})}}>
                                <Text style={styles.closeText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        height:200,
        backgroundColor: 'lightgreen'
    },
    tContainer:{
        flex:1,
        backgroundColor: '#3399ff',
        paddingTop: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        backgroundColor: "#fff",
        height: 300,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeText: {
        backgroundColor: '#ff6666',
        color: '#fff',
        fontWeight: 'bold',
       // margin: 20,
        padding: 5
    },
    SubmitBtn: {
        backgroundColor: 'skyblue',
        color: '#fff',
        fontWeight: 'bold',
       margin: 5,
        padding: 5
    },
    header: {
       // flex: 1,
        backgroundColor: 'lightgreen',
        marginBottom: 1000,
    },
    profilePic: {
        // flex: 1,
        flexGrow:1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -40,

        // backgroundColor: '#03A9F4',

    },
    profilePicWrap: {
        width: 180,
        height: 180,
        borderRadius: 100,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0,0,0, 0.4)',
        borderWidth: 16,
        position: 'absolute',
    },

    profilepic: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 4,
        //justifyContent: 'center',
    },
    name: {
        marginTop: 20,
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    major: {
        fontSize: 14,
        color: 'black',
        fontStyle: 'italic',
    },

    // CSS for Bar
    bar: {
        borderTopColor: '#fff',
        borderTopWidth: 4,
        backgroundColor: 'black',
        flexDirection: 'row'
    },
    barSeparator: {
        borderRightWidth: 4,
    },
    barTop: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    // btn: {
    //     position: 'absolute',
    //     width: 50,
    //     height: 50,
    //     backgroundColor: '#3399ff',
    //     borderRadius: 30,
    //     bottom: 0,
    //     right: 0,
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // },
    plus: {
        fontSize: 40,
        color: 'white'
    },
    barBottom: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    barItem: {
        flex: 1,
        padding: 18,
        alignItems: 'center'
    },
    editButton: {
       position: 'absolute',
        right: 0
    }


});
