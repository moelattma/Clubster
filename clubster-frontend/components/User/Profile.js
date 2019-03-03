import React, { Component } from 'react';
import { AsyncStorage, View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Button, TextInput, Dimensions } from 'react-native';
import { Font, ImagePicker, Permissions, Constants } from 'expo';
import axios from 'axios';
import Modal from "react-native-modal";
import converter from 'base64-arraybuffer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SocialIcon } from 'react-native-elements'
import ImageGrid from './Cards/ImageGrid';
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import v1 from 'uuid/v1';
import { RNS3 } from 'react-native-aws3';
import ClubList from './Cards/ClubList';
import { Container } from 'native-base';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const SELECT_ABOUT = 0;
const SELECT_PHOTOS = 1;
const SELECT_CLUBS = 2;

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
            biography: '',
            errors: {},
            selected: SELECT_ABOUT,
        }
    }

    handleAboutAction = () => { if (this.state.selected != SELECT_ABOUT) this.setState({ selected: SELECT_ABOUT }) }
    handlePhotoAction = () => { if (this.state.selected != SELECT_PHOTOS) this.setState({ selected: SELECT_PHOTOS }) }
    handleClubsAction = () => { if (this.state.selected != SELECT_CLUBS) this.setState({ selected: SELECT_CLUBS }) }

    hide = () => { return; }

    _showModal = () => this.setState({ show: true })
    _hideModal = () => this.setState({ show: false })

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('jwtToken');
            delete axios.defaults.headers.common['Authorization'];
            console.log(this.props.screenProps);
            this.props.screenProps.logoutNavigation.navigate('Login');
        }
        catch (exception) {
            console.log(exception);
            return false;
        }
    }

    submitProfile() {
        var hobbiesList = this.state.hobbies.split(',');
        var removeIndices = [];

        for (var i = 0; i < hobbiesList.length; i++) {
            hobbiesList[i] = hobbiesList[i].trim();
            if (hobbiesList[i] == "")
                removeIndices.push(i);
        }

        var splicedCount = 0;
        removeIndices.map(index => hobbiesList.splice(index - splicedCount++));

        axios.post('http://localhost:3000/api/profile', {
            major: this.state.major, hobbies: hobbiesList,
            facebook: this.state.facebook, instagram: this.state.instagram,
            linkedIn: this.state.linkedIn, biography: this.state.biography
        }).then((response) => {
            if (response.status == 201 || response.status == 200) {
                console.log(response.data);
                this.setState({ show: false, hobbies: hobbiesList.join(', ') });
            }
        })
    }

    changePicture = async () => {
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
            var imageURL;
            await RNS3.put(file, options).then((response) => {
                imageURL = response.body.postResponse.key;
            }).catch((err) => { console.log(err) });
            await axios.post('http://localhost:3000/api/changePhoto', { imageURL: imageURL }).then((response) => {
                this.setState({ img: 'https://s3.amazonaws.com/clubster-123/' + response.data.image });
            });
        } catch (error) { console.log(error); }
    };

    componentWillMount() {
        axios.get('http://localhost:3000/api/profile').then((response) => {
            const { name, image, major, biography, hobbies } = response.data.profile;
            if (response.data.profile) {
                this.setState({ name: name, major: major ? major: '', biography: biography ? biography : '',
                    hobbies: hobbies ? hobbies.join(" ") : '', img: 'https://s3.amazonaws.com/clubster-123/' + image });
            }
        });
    };

    renderElement = (d, i) => (
        <View key={i}
            style={{
                justifyContent: "center", alignItems: "center",
                borderWidth: 1, borderColor: "#898989",
                backgroundColor: "white", borderRadius: 12,
                margin: 3, height: 24
            }}
        >
            <Text style={{ marginHorizontal: 8, fontSize: 16, color: "#898989" }}>
                {d}
            </Text>
        </View>
    )


    render() {
        return (
            <ScrollView>
                <View style={{ height: HEIGHT / 4, backgroundColor: '#59cbbd' }}>
                    <TouchableOpacity style={{ position: 'absolute', left: 4, top: 10 }} onPress={() => this.handleLogout()} >
                        <MaterialCommunityIcons
                            name="logout"
                            size={35}
                            color={'red'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={this._showModal} >
                        <MaterialCommunityIcons
                            name="account-edit"
                            size={35}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.avatar}
                    onPress={() => this.changePicture()}>
                    <Image style={styles.imageAvatar}
                        source={{ uri: this.state.img }} />
                </TouchableOpacity>
                <Text style={{
                    flexDirection: 'row', alignSelf: 'center',
                    marginTop: 70, fontSize: 20, color: 'black', fontWeight: 'bold' }}>
                    {this.state.name}
                </Text>
                <Text style={{
                    flexDirection: 'row', alignSelf: 'center',
                    fontSize: 20, color: 'black', fontWeight: 'bold'
                }}>
                    {this.state.major}
                </Text>
                <View style={{
                    flexDirection: 'row', flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <Text style={{ textAlign: 'center' }}>
                        {this.state.biography}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={this.handleAboutAction.bind(this)}>
                        <Text style={styles.buttonText}> About </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.handlePhotoAction.bind(this)}>
                        <Text style={styles.buttonText}> Photos </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.handleClubsAction.bind(this)}>
                        <Text style={styles.buttonText}> Clubs </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', alignSelf: 'center' }}>

                </View>

                {(this.state.selected == SELECT_ABOUT)
                    //Photos tab
                    ? <View style={{ margin: 10 }}>
                        <Text>About</Text>
                    </View>
                    //members tab
                    : ((this.state.selected == SELECT_PHOTOS)
                        ? <View>
                            <Text> Photos </Text>
                        </View>
                        //about tab
                        : 
                        <ClubList />
                    )}
                {/* MODAL  */}
                <View style={{ flex: 1 }}>
                    <Modal isVisible={this.state.show} onRequestClose={this.hide}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                Edit Profile
                            </Text>
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Major" onChangeText={(major) => this.setState({ major })} value={this.state.major} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Hobbies (seperated by ,)" onChangeText={hobbies => this.setState({ hobbies })} value={this.state.hobbies} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Facebook" onChangeText={(facebook) => this.setState({ facebook })} value={this.state.facebook} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Instagram" onChangeText={(instagram) => this.setState({ instagram })} value={this.state.instagram} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="LinkedIn" onChangeText={(linkedIn) => this.setState({ linkedIn })} value={this.state.linkedIn} />
                            <TextInput multiline={true} numberOfLines={6} style={{ width: 350 }} placeholder="Decribe yourself!" onChangeText={(biography) => this.setState({ biography })} value={this.state.biography} />

                            <TouchableOpacity onPress={() => { this.submitProfile() }}>
                                <Text style={styles.SubmitBtn}>Save</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => { this.setState({ show: false }) }}>
                                <Text style={styles.closeText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#338293',
        margin: 10,
        width: '27%'
    },
    buttonText: {
        color: '#338293',
        textAlign: 'center',
        marginLeft: 25,
        marginRight: 25,
        marginTop: 10,
        marginBottom: 10,
    },
    header: {
        backgroundColor: "#00BFFF",
        height: 200,
    },
    avatar: {
        width: WIDTH / 3,
        height: WIDTH / 3,
        borderRadius: WIDTH / 6,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: HEIGHT / 4 - WIDTH / 6
    },
    imageAvatar: {
        width: WIDTH / 3,
        height: WIDTH / 3,
        borderColor: 'white',
        borderRadius: WIDTH / 6,
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
        right: 4,
        top: 10
    }
});
