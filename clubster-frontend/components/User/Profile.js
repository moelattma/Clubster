import React, { Component } from 'react';
import { AsyncStorage, View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Button, TextInput, Linking } from 'react-native';
import { ImagePicker, Permissions, Constants } from 'expo';
import axios from 'axios';
import Modal from "react-native-modal";
import converter from 'base64-arraybuffer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SocialIcon } from 'react-native-elements'

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            result: null,
            name: '',
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC',
            major: '',
            hobbies: '',
            facebook: '',
            instagram: '',
            currentPosition: '',
            linkedIn: '',
            description: '',
            errors: {}
        }
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    hide = () => {
        return;
    }

    _showModal = () => this.setState({ show: true })
    _hideModal = () => this.setState({ show: false })

    submitProfile() {
        axios.post('http://localhost:3000/api/profile', {
            major: this.state.major, hobbies: this.state.hobbies,
            facebook: this.state.facebook, instagram: this.state.instagram,
            linkedIn: this.state.linkedIn, description: this.state.description
        }).then((response) => {
            if (response.status == 201 || response.status == 200) {
                this.setState({ show: false });
            }
        })

    }

    changePicture = () => {
        this.useLibraryHandler();
    }


    useLibraryHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });
        const data = new FormData();
        data.append('fileData', {
            uri: result.uri,
            type: 'multipart/form-data',
            name: "image1.jpg"
        });
        axios.post('http://localhost:3000/api/profilePhoto', data).then((response) => {
            this.setState({ img: 'data:image/jpeg;base64,' + converter.encode(response.data.profile.image.img.data.data) })
        });
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

    componentWillMount() {
        axios.get('http://localhost:3000/api/profile').then((response) => {
            console.log(response.status);
            if(response.status != 201) {
              return;
            }
            const _data = response.data;
            const _profile = _data.profile;

            if(_data.name)
                this.setState({ name: _data.name })
            if (_profile.image)
                this.setState({ img: 'data:image/jpeg;base64,' + converter.encode(_profile.image.img.data.data) });
            if (_profile.major)
                this.setState({ major: _profile.major });
            if (_profile.hobbies && _profile.hobbies.includes(","))
                this.setState({ hobbies: _profile.hobbies.join(',') });
            if (_profile.hobbies && !_profile.hobbies.includes(","))
                this.setState({ hobbies: _profile.hobbies.toString() });
            if (_profile.social) {
                this.setState({
                    major: _profile.major, hobbies: _profile.hobbies.join(','),
                    description: _profile.description, facebook: _profile.social.facebook,
                    linkedIn: _profile.social.linkedin, instagram: _profile.social.instagram
                });
            } else {
                this.setState({
                    major: _profile.major,
                    hobbies: _profile.hobbies.join(','),
                    description: _profile.description,
                });
            }
        }).catch((error) =>  {return;});
    }

    link = (url) => {
        if (url == '' || url == null) {
            return;
        } else if (url.indexOf('http') > -1) {
            url = url.replace('http', 'https');
        }
        if (url.indexOf('https') == -1) {
            url = "https://" + url;
        }
        Linking.openURL(url);
    }


    renderElement = (d, i) => (
        <View
            key={d}
            style={{
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#898989",
                backgroundColor: "white",
                borderRadius: 12,
                margin: 3,
                height: 24
            }}
        >
            <Text style={{ marginHorizontal: 8, fontSize: 16, color: "#898989" }}>
                {d}
            </Text>
        </View>
    )


    render() {
        return (

            <View>
                <View style={{ height: 200, backgroundColor: '#0006b1' }}></View>
                <TouchableOpacity style={styles.avatar} onPress={() => this.changePicture()}><Image style={styles.imageAvatar} source={{ uri: this.state.img }} /></TouchableOpacity>
                <Text style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 70, fontSize: 20, color: 'black', fontWeight: 'bold' }}> {this.state.name} </Text>
                <Text style={{ flexDirection: 'row', alignSelf: 'center', fontSize: 20, color: 'black', fontWeight: 'bold' }}> {this.state.major}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center' }}>{this.state.description}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <SocialIcon type='facebook' onPress={() => this.link(this.state.facebook)} />
                    <SocialIcon type='instagram' onPress={() => this.link(this.state.instagram)} />
                    <SocialIcon type='linkedin' onPress={() => this.link(this.state.linkedIn)} />
                </View>

                <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                    <ScrollView horizontal={true} containerStyle={{ flexDirection: "column", flexWrap: "wrap", alignItems: "flex-start" }}>
                        {this.state.hobbies.length != 0 ? this.state.hobbies.split(',').map(d => this.renderElement(d)) : null}
                    </ScrollView>
                </View>


                {/* MODAL  */}
                <View style={{ flex: 1 }}>

                    <TouchableOpacity style={styles.editButton} onPress={this._showModal} >
                        <MaterialCommunityIcons
                            name="account-edit"
                            size={35}
                            color={'black'}
                        />
                    </TouchableOpacity>
                    <Modal isVisible={this.state.show} onRequestClose={this.hide}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                Edit Profile
                            </Text>
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Major" onChangeText={(major) => this.setState({ major })} value={this.state.major} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Hobbies(seperated by ,)" onChangeText={(hobbies) => this.setState({ hobbies })} value={this.state.hobbies} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Current Position" onChangeText={(currentPosition) => this.setState({ currentPosition })} value={this.state.currentPosition} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Facebook" onChangeText={(facebook) => this.setState({ facebook })} value={this.state.facebook} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Instagram" onChangeText={(instagram) => this.setState({ instagram })} value={this.state.instagram} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="LinkedIn" onChangeText={(linkedIn) => this.setState({ linkedIn })} value={this.state.linkedIn} />
                            <TextInput multiline={true} numberOfLines={6} style={{ width: 350 }} placeholder="Decribe yourself!" onChangeText={(description) => this.setState({ description })} value={this.state.description} />

                            <TouchableOpacity onPress={() => { this.submitProfile() }}>
                                <Text style={styles.SubmitBtn}>Save</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => { this.setState({ show: false }) }}>
                                <Text style={styles.closeText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={this._showModal} >
                    <MaterialCommunityIcons
                        name="account-edit"
                        size={35}
                        color={'black'}
                    />
                </TouchableOpacity>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#00BFFF",
        height: 200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 130
    },
    imageAvatar: {
        width: 130,
        height: 130,
        borderColor: "white",
        borderRadius: 63,
        alignSelf: 'center',
        position: 'relative'
    },
    background: {
        flex: 1,
        height: 200,
        backgroundColor: 'lightgreen'
    },
    tContainer: {
        flex: 1,
        backgroundColor: '#3399ff',
        paddingTop: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        backgroundColor: "#fff",
        height: 500,
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
        flexGrow: 1,
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
        top: 600,
        right: 0
    }


});
