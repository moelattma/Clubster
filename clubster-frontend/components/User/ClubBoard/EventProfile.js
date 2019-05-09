import React, { Component } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, TouchableWithoutFeedback,
         StyleSheet, Image, ScrollView, AsyncStorage } from 'react-native';
import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import v1 from 'uuid/v1';
import { accessKeyId, secretAccessKey } from '../../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { Container, Card, CardItem, Form, Content, ListItem, Thumbnail, Item,
         Text, Button, Icon, Left, Body, Right, Input } from 'native-base';
import CommentCard from '../Cards/CommentCard';
import InformationCard from '../Cards/InformationCard';
import Gallery from '../Cards/Gallery';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { DefaultImg } from '../../router';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export default class EventProfile extends Component {
    constructor(props) {
        super(props);

        this.event = this.props.navigation.getParam('event', null);
        this.state = {
            eventImage: this.event.image ? 'https://s3.amazonaws.com/clubster-123/' + this.event.image : DefaultImg,
            likersModal: false,
            goingModal: false,
            ridersModal: false,
            form: false,
            likers: [],
            going: [],
            rides: [],
            seats: '',
            rideTime: '',
            rideLocation: '',
            description: '',
            userID: null,
        }
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    // changeEventPicture = async () => {
    //     await this.askPermissionsAsync();
    //     try {
    //         let result = await ImagePicker.launchImageLibraryAsync({
    //             allowsEditing: true,
    //             aspect: [4, 3],
    //             base64: false,
    //         });
    //         if (result.cancelled)
    //             return;
    //         const key = `${v1()}.jpeg`;
    //         const file = {
    //             uri: result.uri,
    //             type: 'image/jpeg',
    //             name: key
    //         };
    //         const options = {
    //             keyPrefix: 's3/',
    //             bucket: 'clubster-123',
    //             region: 'us-east-1',
    //             accessKey: accessKeyId,
    //             secretKey: secretAccessKey,
    //             successActionStatus: 201
    //         };
    //         var imageURL;
    //         await RNS3.put(file, options).then((response) => {
    //             imageURL = response.body.postResponse.key;
    //         }).catch((err) => { console.log(err) });
    //         await axios.post(`http://localhost:3000/api/events/${this.event._id}/changeEventPicture`, { imageURL }).then((image) => {
    //             this.setState({ eventImage: 'https://s3.amazonaws.com/clubster-123/' + imageURL });
    //         });
    //     } catch (error) { console.log(error); }
    // }

    // Likers
    openLikersModal() {
        axios.get(`http://localhost:3000/api/events/${this.event._id}/likers`)
            .then(response => {
                this.setState({ 
                    likersModal: true,
                    likers: response.data.likers
                })
            }).catch(err => { console.log(err) });
    }

    closeLikersModal() { this.setState({ likersModal: false }) }

    _renderLike = ({ item }) => {
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail source={{ uri: (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg)  }}/>
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
            </ListItem>
        );
    }

    // Going
    openGoingModal() {
        axios.get(`http://localhost:3000/api/events/${this.event._id}/going`)
            .then(response => {
                this.setState({ 
                    goingModal: true,
                    going: response.data.going
                })
            }).catch(err => { console.log(err) });
    }

    closeGoingModal() { this.setState({ goingModal: false }) }

    _renderGoing = ({ item }) => {
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail source={{ uri: (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg) }}/>
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
            </ListItem>
        );
    }

    // Rides
    openRidesModal() {
        axios.get(`http://localhost:3000/api/${this.event._id}/rides`)
            .then(response => {
                this.setState({
                    ridersModal: true,
                    rides: response.data.rides,
                    userID: response.data.userID
                })
            }).catch(err => { console.log(err) });
    }

    closeRidesModal() {
        if (this.state.form)
            this.setState({ form: false });
        else this.setState({ ridersModal: false });
    }

    addRideDropDown() { this.setState({ form: true }) }

    submitRide() {
        const { userID } = this.state;
        var skip = false;
        var removeFromRide;

        if (userID) {
            this.state.rides.map(ride => {
                if (ride.driverID._id == userID) {
                    skip = true;
                    return;
                } ride.ridersID.map(rider => {
                    if (rider._id == userID) {
                        removeFromRide = ride._id;
                        return;
                    }
                });
            })
        } else console.log('userid is null')
        if (skip) {
            this.closeRidesModal();
            return;
        } else {
            const { seats, rideTime, rideLocation, description } = this.state;
            axios.post(`http://localhost:3000/api/${this.event._id}/createRide`, {
                passengerSeats: seats,
                time: rideTime,
                location: rideLocation,
                description: description,
                rideRemove: removeFromRide
            }).then((response) => {
                if (response.status == 201 || response.status == 200) {
                    var newRide = response.data.ride;
                    newRide.driverID = response.data.driver;
                    this.setState({
                        form: false,
                        rides: this.state.rides.concat(newRide),
                        seats: '',
                        rideTime: '',
                        rideLocation: '',
                        description: ''
                    });
                    if (removeFromRide)
                        this.closeRidesModal();
                }
            })
            .catch((err) => { console.log('error creating new ride'); console.log(err) });
        }
    }

    addRider = async (item) => {
        const { userID } = this.state;
        var skip = false;
        var removeFromRide;
        if (userID) {
            this.state.rides.map(ride => {
                if (ride.driverID._id == userID) {
                    skip = true;
                    return;
                } else {
                    ride.ridersID.map(rider => {
                        if (rider._id == userID) {
                            if (ride._id == item._id) skip = true;
                            removeFromRide = ride._id;
                            return;
                        }
                    })
                }
            });
        } else console.log('userid is null')
        if (!skip) {
            await axios.post(`http://localhost:3000/api/${item._id}/joinRide`, { rideRemove: removeFromRide });
            this.closeRidesModal();
        } else this.closeRidesModal();
    }

    _renderRide = ({ item }) => {
        const { passengerSeats, ridersID } = item;
        return (
            <View>
                <ListItem thumbnail style={styles.listStyle}>
                    <ScrollView horizontal>
                        <Left>
                            <Thumbnail large source={{ uri: (item.driverID.image ? 'https://s3.amazonaws.com/clubster-123/' + item.driverID.image : DefaultImg) }} />
                        </Left>
                        <Body>
                            <FlatList
                                data={item.ridersID}
                                renderItem={this._renderRider}
                                horizontal={true}
                                keyExtractor={rider => rider._id}
                            />
                        </Body>
                        {passengerSeats > ridersID.length ?
                            <Right >
                                <Icon onPress={() => this.addRider(item)} name="ios-add" style={{ marginLeft: 6, color: 'black', fontSize: 24 }} />
                            </Right> : null
                        }
                    </ScrollView>
                </ListItem>
                <Text style={{ textAlign: 'center' }}>{item.time} | {item.location} | {item.description}</Text>
            </View>
        );
    }

    _renderRider = ({ item }) => {
        return (
            <ListItem thumbnail>
                <Thumbnail small source={{ uri: (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg) }}/>
            </ListItem>
        );
    }

    render() {
        const eventInfo = {
            _id: this.event._id,
            name: this.event.name,
            description: this.event.description,
            location: this.event.location,
            date: this.event.date,
            comments: this.event.comments,
            photos: this.event.photos
        }

        var { seats, rideTime, rideLocation, description } = this.state;

        return (
            <Container>
                <ScrollView>
                    <Image source={{ uri: this.state.eventImage }} style={{ height: 200 }} />
                    <InformationCard eventInfo={eventInfo} />
                    <Content padder>
                        <Card >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10}}>
                                <AntDesign.Button color='#59cbbd' backgroundColor='white' name='like1' size={28} onPress={() => this.openLikersModal()}/>
                                <FontAwesome.Button color='#59cbbd' backgroundColor='white' name='users' size={28} onPress={() => this.openGoingModal()}/>
                                <FontAwesome.Button color='#59cbbd' backgroundColor='white' name='car' size={28} onPress={() => this.openRidesModal()} />
                            </View>
                        </Card>
                    </Content>
                    <CommentCard eventInfo={eventInfo} />
                </ScrollView>

                <Modal isVisible={this.state.likersModal}
                    style={styles.modalStyle}>
                    <View style={{ flex: 1, margin: 2 }}>
                        <TouchableOpacity onPress={() => this.closeLikersModal()}>
                            <Icon name="ios-arrow-dropleft"
                                style={styles.modalButton} />
                        </TouchableOpacity>
                        {!this.state.likers || this.state.likers.length == 0 ?
                            <Text style={styles.noneText}> No one likes this event </Text> 
                            :
                            <FlatList
                                data={this.state.likers}
                                renderItem={this._renderLike}
                                horizontal={false}
                                keyExtractor={liker => liker._id}
                            />
                        }
                    </View>
                </Modal>

                <Modal isVisible={this.state.goingModal}
                    style={styles.modalStyle}>
                    <View style={{ flex: 1, margin: 2 }}>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => this.closeGoingModal()}>
                                <Icon name="ios-arrow-dropleft"
                                    style={styles.modalButton} />
                            </TouchableOpacity>
                        </View>
                        {!this.state.going || this.state.going.length == 0 ?
                            <Text style={styles.noneText}> No one is going to this event </Text> 
                            :
                            <FlatList
                                data={this.state.going}
                                renderItem={this._renderGoing}
                                horizontal={false}
                                keyExtractor={going => going._id}
                            />
                        }
                    </View>
                </Modal>

                <Modal isVisible={this.state.ridersModal}
                    style={styles.modalStyle}>
                    <View style={{ flex: 1, margin: 2 }}>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => this.closeRidesModal()}>
                                <Icon name="ios-arrow-dropleft"
                                    style={styles.modalButton} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.addRideDropDown()}>
                                <Icon name="ios-add"
                                    style={styles.modalButton} />
                            </TouchableOpacity>
                        </View>
                        {this.state.form
                            ? <View>
                                <Form>
                                    <Item>
                                        <Input placeholder="Number of available seats?"
                                            label='seats'
                                            onChangeText={(seats) => this.setState({ seats })}
                                            value={seats}
                                        />
                                    </Item>
                                    <Item>
                                        <Input placeholder="Pick up time"
                                            label='rideTime'
                                            onChangeText={(rideTime) => this.setState({ rideTime })}
                                            value={rideTime}
                                        />
                                    </Item>
                                    <Item>
                                        <Input placeholder="Pick up location"
                                            label='location'
                                            onChangeText={(rideLocation) => this.setState({ rideLocation })}
                                            value={rideLocation}
                                        />
                                    </Item>
                                    <Item>
                                        <Input placeholder="Notes"
                                            label='description'
                                            onChangeText={(description) => this.setState({ description })}
                                            value={description}
                                        />
                                    </Item>

                                </Form>
                                <Button bordered onPress={() => this.submitRide()}
                                    style={{ margin: 20 }}>
                                    <Text>Submit Ride!</Text>
                                </Button>
                            </View>
                            :
                            (
                                this.state.rides == undefined || this.state.rides.length == 0 ?
                                <Text style={styles.noneText}> There are no rides for this event </Text>
                                :
                                <FlatList
                                data={this.state.rides}
                                renderItem={this._renderRide}
                                horizontal={false}
                                keyExtractor={ride => ride._id}
                            />)
                        }
                    </View>
                </Modal>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    aboutText: {
        marginLeft: 10,
        marginTop: 20,
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    editButton: {
        backgroundColor: 'white',
        margin: 10,
        alignSelf: 'flex-end',
        fontSize: 40
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButton: {
        color: 'black',
        fontSize: 40,
        margin: 10
    },
    listStyle: {
        height: HEIGHT / 8,
        marginTop: 6
    },
    noneText: {
        textAlignVertical: 'center',
        textAlign: 'center',
    }
});
