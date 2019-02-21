import React, { Component } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import Modal from "react-native-modal";
import axios from 'axios';
import { ImagePicker, Permissions, Constants } from 'expo';
import converter from 'base64-arraybuffer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MembersList from './MembersList';

const { WIDTH, HEIGHT } = Dimensions.get('window');

export default class Settings extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            show: false,
            president: '',
            name: '',
            acronym: '',
            purpose: '',
            description: '',
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC',
            about: true,
            photos: false,
            members: false
        }
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    changePicture = () => {
        this.useLibraryHandler();
    };

    useLibraryHandler = async () => {
        await this.askPermissionsAsync();
        const { _id } = this.props.screenProps;
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });
        if(result.cancelled)
          return;
        const data = new FormData();
        data.append('fileData', {
            uri: result.uri,
            type: 'multipart/form-data',
            name: "image1.jpg"
        });
        axios.post(`http://localhost:3000/api/organizations/modifyOrgPicture/${_id}`, data).then((response) => {
            var url = 'data:image/jpeg;base64,' + converter.encode(response.data.imageId.img.data.data);
            this.setState({ img: url });
        }).catch((err) => { return; });
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

    componentDidMount() {
        const { _id } = this.props.screenProps;

        axios.get(`http://localhost:3000/api/organizations/getOrg/${_id}`).then((response) => {
            const { president, name, acronym, purpose, description } = response.data.org;

            this.setState({
                president, name, acronym, purpose, description,
                img: 'data:image/jpeg;base64,' + converter.encode(response.data.org.imageId.img.data.data),
                isLoading: false
            });
        }).catch((error) => { return; });
    }

    submitClubChanges() {
        const { _id } = this.props.screenProps;
        axios.post(`http://localhost:3000/api/organizations/${_id}`, {
            name: this.state.name,
            acronym: this.state.acronym,
            purpose: this.state.purpose,
            description: this.state.description
        }).then((response) => {
            this.setState({ show: false });
        }).catch((error) => { return; });
    }

    hide = () => {
        return;
    }

    _showModal = () => this.setState({ show: true })
    _hideModal = () => this.setState({ show: false })

    aboutClicked() {
        this.setState({
            about: true,
            photos: false,
            members: false            
        })
    }

    photosClicked() {
        this.setState({
            about: false,
            photos: true,
            members: false            
        })
    }

    membersClicked() {
        this.setState({
            about: false,
            photos: false,
            members: true            
        })
    }


    render() {

        return (
            <View>
                <View>
                    <View>
                        <TouchableOpacity style={ styles.editButton} 
                            onPress={this._showModal} >
                            <FontAwesome
                                name="edit"
                                size={35}
                                color={'black'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPressIn={() => this.useLibraryHandler()}>
                            <Image style={{ height: 200, width: WIDTH }} 
                                source={{ uri: this.state.img }} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity style={styles.button} 
                            onPress={() => this.aboutClicked()}>
                            <Text style={styles.buttonText}> About </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}
                            onPress={() => this.photosClicked()}>
                            <Text style={styles.buttonText}> Photos </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}
                            onPress={() => this.membersClicked()}>
                            <Text style={styles.buttonText}> Members </Text>
                        </TouchableOpacity>
                        </View>
                    </View>


                    {(this.state.photos)
                        //Photos tab
                        ? <View style={{margin:10}}>
                            <Text>Photos</Text>
                        </View>
                        //members tab
                        : ((this.state.members) ? <View>
                            <View style={{margin: 10}}>
                            <MaterialIcons
                                            name="people"
                                            size={30}
                                            color={'black'}
                                        />
                            <MembersList _id={this.props.screenProps._id}
                                 style={{margin:10}}></MembersList>
                            </View>
                        </View> 
                        //about tab
                        :<View> 
                            <View style={styles.mainContainer}>
                                <Text style={styles.nameText}>
                                    {this.state.name}
                                </Text>
                                <Text style={styles.subText}>
                                    President:
                                </Text>
                                <Text style={{ marginLeft: 10, marginBottom: 7 }}>
                                    {this.state.president}
                                </Text>
                                <Text style={styles.subText}>
                                    Purpose/ description:
                                </Text>
                                <Text style={{ marginLeft: 10, marginBottom: 7 }}>
                                    {this.state.purpose}
                                </Text>
                            </View>
                        </View>
                        )}

                    {/*---------- MODAL  ---------------*/}
                    <View>
                        <Modal isVisible={this.state.show} onRequestClose={this.hide}>
                            <View style={styles.modalView}>
                                <View>
                                    <TouchableOpacity onPress={this._hideModal}>
                                        <MaterialIcons
                                            name="cancel"
                                            size={30}
                                            color={'red'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View >
                                    <Text style={styles.pageTitle}>
                                        Edit Club Information
                                </Text>
                                    <View style={styles.textInAreaContainer}>
                                        <TextInput placeholder='club name/ acronym'
                                         style={styles.textInArea}
                                         label='Name' underlineColorAndroid="transparent"
                                          onChangeText={(name) => this.setState({ name })} 
                                          value={this.state.name} />
                                    </View>
                                    
                                    <View style={styles.textInAreaContainer}>
                                        <TextInput placeholder='purpose/ description'
                                        style={styles.textInArea} 
                                        label='Purpose' underlineColorAndroid="transparent"
                                         multiline={true} numberOfLines={3} 
                                         onChangeText={(purpose) => this.setState({ purpose })} 
                                         value={this.state.purpose} />
                                    </View>
                                    <View >
                                        <View>
                                            <Button
                                                title="Save"
                                                onPress={() => { this.submitClubChanges() }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
    width: WIDTH / 2,
        flexDirection: 'column'
    },
    screen: {
        paddingVertical: 20,
        paddingHorizontal: 5,
    },
    editButton:{
        alignSelf: 'flex-end',
        margin: 10
    },
    pageTitle: {
        justifyContent: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    nameText:{
        fontWeight: '600', 
        fontSize: 25, 
        margin: 10
    },
    subText:{ 
        fontWeight: '500', 
        fontSize: 20,
        marginLeft: 10,
        marginBottom: 5
    },
    textInAreaContainer: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        alignSelf: 'stretch',
        backgroundColor: 'white',
        margin: 5,
        padding: 10,
        borderRadius: 5
    },
    textInArea: {
        alignSelf: 'stretch',
        backgroundColor: 'white',
    },
    descriptionArea: {
        justifyContent: 'flex-start'
    },
    modalView: {
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    joinButton: {
        justifyContent: 'center',
        backgroundColor: '#59cbbd',
        height: 60,
        width: WIDTH / 3
    },
    button:{
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#338293',
        margin: 10,
        width: '27%',
    },
    buttonText:{
        color: '#338293',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
});

