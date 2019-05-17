import React from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, View, TextInput, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import { Header } from 'react-native-elements'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Text, Thumbnail } from 'native-base';
import v1 from 'uuid/v1';
import { RNS3 } from 'react-native-aws3';

import { connect } from 'react-redux';

import Gallery from '../../Utils/Gallery';
import MembersList from './MembersList';
import { DefaultImg } from '../../Utils/Defaults';
import { accessKeyId, secretAccessKey } from '../../../keys/keys';

const { WIDTH, HEIGHT } = Dimensions.get('window');

export class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            show: false,
            president: '',
            name: '',
            description: '',
            img: DefaultImg,
            about: true,
            photos: [],
            galleryID: null,
            photosDisplay:false,
            members: false
        }
    }

    onUpdatePhotos(photos) { this.setState({ photos }) }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    changePicture = async () => {
      await this.askPermissionsAsync();
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });
        if(result.cancelled)
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
          accessKey:accessKeyId,
          secretKey: secretAccessKey,
          successActionStatus:201
        }
        var imageURL;
        await RNS3.put(file,options).then((response)=> {
           imageURL = response.body.postResponse.key;
        }).catch((err) => {console.log(err)});
        axios.post(`https://clubster-backend.herokuapp.com/api/organizations/modifyOrgPicture/${this.props._id}`, { imageURL }).then((response) => {
            this.setState({ img: (response.data.image ? 'https://s3.amazonaws.com/clubster-123/' + response.data.image : DefaultImg) });
        }).catch((err) => { return; });
        this.props.navigation.navigate('ShowClubs');
      } catch(error) {
        console.log(error);
      };
    };

    submitClubChanges() {
        const { _id } = this.props;
        axios.post(`https://clubster-backend.herokuapp.com/api/organizations/${_id}`, {
            name: this.state.name,
            description: this.state.description,
        }).then(() => {
            this.setState({ show: false });
        }).catch(() => { return; });
    }

    hide = () => {
        return;
    }

    _showModal = () => this.setState({ show: true })
    _hideModal = () => this.setState({ show: false })

    aboutClicked() {
        this.setState({
            about: true,
            photosDisplay: false,
            members: false
        })
    }

    photosClicked() {
        this.setState({
            about: false,
            photosDisplay: true,
            members: false
        })
    }

    membersClicked() {
        this.setState({
            about: false,
            photosDisplay: false,
            members: true
        })
    }

    render() {
        return (
            <ScrollView>
                <Header
                    backgroundColor={'transparent'}
                    leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.navigate('HomeNavigation') }}
                    centerComponent={{ text: this.props.name + ' Settings', style: { fontSize: 24, fontWeight: '500' } }}
                    rightComponent={this.props.isAdmin ? { icon: 'edit', onPress: (() => this._showModal())} : null}
                />
                <TouchableOpacity onPressIn={this.changePicture}>
                    <Thumbnail square style={{ height: 200, width: WIDTH }}
                        source={{ uri: this.props.img }} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin:7 }}>
                    <Button bordered style={styles.buttonText} onPress={() => this.aboutClicked()}>
                        <Text> About </Text>
                    </Button>
                    <Button bordered style={styles.buttonText} onPress={() => this.photosClicked()}>
                        <Text > Photos </Text>
                    </Button>
                    <Button bordered style={styles.buttonText} transparent onPress={() => this.membersClicked()}>
                        <Text > Members </Text>
                    </Button>
                </View>

                {(this.state.photosDisplay)
                    //Photos tab
                    ? <Gallery galleryID={this.props.galleryID} photos={this.props.photos} isAdmin={this.props.isAdmin} 
                               onUpdatePhotos={this.onUpdatePhotos.bind(this)} />
                    //members tab
                    : ((this.state.members) ? <View>
                        <View style={{ margin: 10 }}>
                            <MembersList members={this.props.members} president={this.props.president} 
                                style={{ margin: 10 }}/>
                        </View>
                    </View>
                        //about tab
                        :
                            <View style={styles.mainContainer}>
                                <Text style={styles.subText}>
                                    President: {this.props.president}
                                </Text>
                                <Text style={styles.subText}>
                                    Description: {this.props.description}
                                </Text>
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
                                        label='Description' underlineColorAndroid="transparent"
                                        multiline={true} numberOfLines={3}
                                        onChangeText={(description) => this.setState({ description })}
                                        value={this.state.description} />
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
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    const { name, description, image, gallery, isAdmin, _id, president } = state.clubs.club;

    return {
        name, description, isAdmin, _id, president,
        img: (image ? 'https://s3.amazonaws.com/clubster-123/' + image : DefaultImg), 
        photos: (gallery.photos.length > 5 ? gallery.photos.slice(0, 6) : gallery.photos.concat({ addPhotoIcon: true })),
    }
}
  
//   const mapDispatchToProps = (dispatch) => {
//     return {
//         setUserClubs: (clubsAdmin, clubsMember) => dispatch({
//             type: CLUBS_SET,
//             payload: { clubsAdmin, clubsMember }
//         }),
//         setCurrentClub: (club) => dispatch({
//             type: CLUBS_SETUSER,
//             payload: { club }
//         })
//     }
//   }

export default connect(mapStateToProps, null)(Settings);

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
    buttonText:{
        margin: 10,
        marginBottom: 0
    },
    avatar: {
        // width: WIDTH / 3,
        // height: WIDTH / 3,
        // borderRadius: WIDTH / 6,
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
        // position: 'relative'
    },
});
