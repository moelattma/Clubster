import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Button } from 'react-native';
import { ImagePicker, Permissions, Constants } from 'expo';
import axios from 'axios';
import converter from 'base64-arraybuffer';
export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            show:false,
            result: null,
            img:null
        }
    }

    askPermissionsAsync = async () => {
      await Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      // you would probably do something to verify that permissions
      // are actually granted, but I'm skipping that for brevity
    };

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
       const {img} = this.state;
       console.log(img);
        return (

            <View style={styles.background}>
                <View style = {styles.header}>

                    <View style = {styles.profilePicWrap}>
                    <Image style = {styles.profilepic} source={{uri: this.state.img}}/>
                    </View>

                    <Text style={styles.name}> Aimal Khan </Text>
                    <Text style={styles.major}> Major: Econ </Text>
                </View>
                <Button
                  title="launchImageLibraryAsync"
                  onPress={this.useLibraryHandler}
                />
                <Text style={styles.paragraph}>
                {JSON.stringify(this.state.result)}
                </Text>
                </View>

        );
    }
}

const styles = StyleSheet.create({
    background : {
        flex: 1,
       // width: undefined,
      //  height: undefined,
      //  alignSelf: 'stretch',
    },

    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 150,
        backgroundColor: 'skyblue',

      },
    profilePicWrap: {
        width: 180,
        height: 180,
        borderRadius: 100,
        borderColor: 'rgba(0,0,0, 0.4)',
        borderWidth: 16,
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
    barSeparator:{
        borderRightWidth: 4,
    },
    barTop: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic'
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


});
