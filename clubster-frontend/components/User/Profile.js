import React, { Component } from 'react';
import { AsyncStorage, View, ScrollView, StyleSheet,
     Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Expo, { Font, ImagePicker, Permissions } from 'expo';
import axios from 'axios';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Gallery from './Cards/Gallery';
import InformationCard from './Cards/InformationCard';
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import v1 from 'uuid/v1';
import { RNS3 } from 'react-native-aws3';
import ClubList from './Cards/ClubList';
import { Thumbnail, Button, Text, Form, Item, Input } from 'native-base';

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
            photos: [],
            galleryID: null,
            selected: SELECT_ABOUT,
            _loading: true,
            userClubs: [],
            refreshClubs: true
        }
    }

    onUpdatePhotos(photos) { this.setState({ photos }) };

    async componentWillMount() {
        axios.get('http://localhost:3000/api/profile').then((response) => {
            const { name, image, major, biography, hobbies, gallery } = response.data.profile;
            if (response.data.profile) {
                this.setState({ name: name, major: major ? major: '', biography: biography ? biography : '', galleryID: gallery._id,
                    hobbies: hobbies ? hobbies.join(" ") : '', img: 'https://s3.amazonaws.com/clubster-123/' + image, 
                    photos: gallery.photos.length > 5 ? gallery.photos.slice(0, 6) : gallery.photos.concat({ addPhotoIcon: true })});
            }
        });

        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        });
        this.setState({ _loading: false });
    }

    async getClubs() {
        var allClubs = [];
        await axios.get(`http://localhost:3000/api/organizations`).then((response) => {
          const { arrayClubsAdmin, arrayClubsMember } = response.data;
          allClubs = arrayClubsAdmin;
          allClubs = allClubs.concat(arrayClubsMember);
          var adminLen = arrayClubsAdmin.length, memLen = arrayClubsMember.length;
          for (var i = 0; i < adminLen; i++) {
            if (arrayClubsAdmin[i].image)
              url = 'https://s3.amazonaws.com/clubster-123/' + arrayClubsAdmin[i].image;
            else
              url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';
            allClubs[i].image = url;
            allClubs[i].isAdmin = true;
          };
    
          for (var i = 0; i < memLen; i++) {
            if (arrayClubsMember[i].image)
              url = 'https://s3.amazonaws.com/clubster-123/' + arrayClubsMember[i].image;
            else
              url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';
            allClubs[adminLen + i].image = url;
            allClubs[adminLen + i].isAdmin = false;
          };
          this.setState({ userClubs: allClubs, refreshClubs: false }); // Setting up state variable
        }).catch(() => { this.setState({ loading: false }) });
    }

    handleAboutAction = () => { if (this.state.selected != SELECT_ABOUT) this.setState({ selected: SELECT_ABOUT }) }
    handlePhotoAction = () => { if (this.state.selected != SELECT_PHOTOS) this.setState({ selected: SELECT_PHOTOS }) }
    handleClubsAction = async () => { 
        if (this.state.selected != SELECT_CLUBS) {
            if (this.state.refreshClubs) {
                await this.getClubs();
                this.setState({ selected: SELECT_CLUBS })
            } else this.setState({ selected: SELECT_CLUBS })
        } 
    }

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

    async photoSubmit() {
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
          axios.post('http://localhost:3000/api/profile/photo', {imageURL: imageURL}).then((response) => {
              this.setState({images:response.data.photos});
          });
        } catch (error) { console.log(error); }
        axios.post('http://localhost:3000/api/profile/photo').then((response) => {
            this.setState({images:response.data.photos});
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
        if (this.state._loading)
            return <Expo.AppLoading/>;

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
                <TouchableOpacity style={styles.avatar} onPress={this.changePicture}>
                    <Thumbnail style={styles.imageAvatar} source={{ uri: this.state.img }} />
                </TouchableOpacity>
                <View style={{height: 100}}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                        <Button bordered activeOpacity={0.5}
                        onPress={this.handleAboutAction.bind(this)}>
                            <Text>About</Text>
                        </Button>
                        <Button bordered
                        onPress={this.handlePhotoAction.bind(this)}>
                            <Text>Photos</Text>
                        </Button>
                        <Button bordered
                        onPress={this.handleClubsAction.bind(this)} onLongPress={() => {
                                this.getClubs();
                                this.handleClubsAction();
                            }}>
                            <Text>Clubs</Text>
                        </Button >
                        </View>

                {(this.state.selected == SELECT_ABOUT)
                    //about tab
                    ? <InformationCard userInfo = {this.state} />
                    //photos tab
                    : ((this.state.selected == SELECT_PHOTOS)
                        ? <Gallery photos={this.state.photos} galleryID={this.state.galleryID} 
                                   onUpdatePhotos={this.onUpdatePhotos.bind(this)} />
                        //clubs tab
                        :
                        <ClubList userClubs = {this.state.userClubs} />
                    )}
                {/* MODAL  */}
                <View style={{ flex: 1 }}>
                    <Modal isVisible={this.state.show} onRequestClose={this.hide}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                Edit Profile
                            </Text>
                            <Form>
                            <Item>
                                <Input placeholder="major"
                                label='major'
                                onChangeText={(major) => this.setState({ major })}
                                value={this.state.major}
                                />
                            </Item>
                            <Item>
                                <Input placeholder="Hobbies"
                                label='Hobbies'
                                onChangeText={(hobbies) => this.setState({ hobbies })}
                                value={this.state.hobbies}
                                />
                            </Item>
                            <Item>
                                <Input placeholder="Facebook"
                                label='Facebook'
                                onChangeText={(facebook) => this.setState({ facebook })}
                                value={this.state.facebook}
                                />
                            </Item>
                            <Item>
                                <Input placeholder="Instagram"
                                label='Facebook'
                                onChangeText={(instagram) => this.setState({ instagram })}
                                value={this.state.instagram}
                                />
                            </Item>
                            <Item>
                                <Input placeholder="LinkedIn"
                                label='LinkedIn'
                                onChangeText={(linkedIn) => this.setState({ linkedIn })}
                                value={this.state.linkedIn}
                                />
                            </Item>
                            <Item>
                                <Input placeholder="Describe yourself"
                                label=''
                                onChangeText={(biography) => this.setState({ biography })}
                                value={this.state.biography}
                                />
                            </Item>
                            </Form>  
                            <Button block onPress={() => { this.submitProfile() }}
                             style={styles.button}>
                                <Text style={{color: '#fff'}}> Submit </Text>
                            </Button>
                            <Button block danger onPress={() => { this.setState({ show: false }) }}
                            style={styles.button}>
                                <Text style={{color: '#fff'}}> Cancel </Text>
                            </Button>
                        </View>
                    </Modal>
                </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    button: {
        margin: 10,
        maxWidth: WIDTH,
        minWidth: WIDTH/2,
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
        padding: 30
    },
    header: {
        backgroundColor: 'lightgreen',
        marginBottom: 1000,
    },
    profilePic: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -40, 
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
    },
    editButton: {
        position: 'absolute',
        right: 4,
        top: 10
    }
});
