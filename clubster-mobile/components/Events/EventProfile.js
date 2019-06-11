import React from 'react';
import {
    View, Dimensions, FlatList, TouchableOpacity, TouchableWithoutFeedback,
    StyleSheet, Image, ScrollView, Share, TextInput
} from 'react-native';
import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import { Header, Icon } from 'react-native-elements';
import v1 from 'uuid/v1';
import { connect } from 'react-redux'
import { RNS3 } from 'react-native-aws3';
import {
    Container, Card, Form, Content, ListItem, Thumbnail, Item,
    Text, Button, Left, Body, Right, Input
} from 'native-base';
var moment = require('moment-timezone');
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import QRCode from 'react-native-qrcode-svg';

import { accessKeyId, secretAccessKey } from '../../keys/keys';
import CommentCard from './EventsCards/CommentCard';
import InformationCard from './EventsCards/InformationCard';
import { DefaultImg } from '../Utils/Defaults';
import { EVENTS_CHANGEPICTURE } from '../../reducers/ActionTypes';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export class EventProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            likersModal: false,
            goingModal: false,
            ridersModal: false,
            qrModal: false,
            editModal: false,
            confirmDel: false,
            form: false,
            likers: [],
            going: [],
            rides: [],
            seats: '',
            rideTime: '',
            rideLocation: '',
            description: '',
            name: '',
            description: '',
            location: '',
            time: '',
            date: '',
            editedItem: null,
            time: null,
            timeDisplay: null,
            timeDisplayEnd: null,
            chosenDate: new Date(),
            selectedStartDate: null,
            selectedEndDate: null,
            isDateTimePickerVisible: false,
            showDate: false,
            showTime: false,
            showTime2: false
        }
        this.setDate = this.setDate.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.svg = ''
    }

    _showDateTimePicker = () => this.setState({ showTime: true });

    _hideDateTimePicker = () => this.setState({ showTime: false });

    _hideDateTimePickerTwo = () => this.setState({ showTime2: false });

    hide = () => { return; }

    _showModal = (type) => {
        (type == 1) ? this.setState({ showDate: true }) : (type == 2) ? this.setState({ showTime: true }) : this.setState({ showTime2: true });
    }
    _hideModal = (type) => {
        (type == 1) ? this.setState({ showDate: false }) : (type == 2) ? this.setState({ showTime: false }) : this.setState({ showTime2: false });
    }

    _handleDatePicked = (date) => {
        console.log(date.toString());
        let hour = parseInt(date.toString().substring(date.toString().indexOf(":") - 2, date.toString().indexOf(":")));
        let minutes = parseInt(date.toString().substring(date.toString().indexOf(":") + 1, date.toString().indexOf(":") + 3));
        console.log(hour);
        let ifPM = (hour >= 12) ? " PM" : " AM";
        if (hour == 0) hour = 12;
        else hour -= (hour > 12) ? 12 : 0; //hour = 9, 3:09
        //strHour = (hour < 10) ? hour.toString() : hour.toString();
        strMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
        console.log("hour is: ", hour);
        console.log("minutes is: ", minutes);
        this.setState({ timeDisplay: hour.toString() + ":" + strMinutes + ifPM, dateTimestampStart: date });
        this._hideDateTimePicker();
    };

    _handleDatePickedTwo = (date) => {
        //04:00
        console.log(date);
        let hour = parseInt(date.toString().substring(date.toString().indexOf(":") - 2, date.toString().indexOf(":")));
        let minutes = parseInt(date.toString().substring(date.toString().indexOf(":") + 1, date.toString().indexOf(":") + 3));
        let ifPM = (hour >= 12) ? " PM" : " AM";
        if (hour == 0) hour = 12;
        else hour -= (hour > 12) ? 12 : 0;
        //strHour = (hour < 10) ? "0" + hour.toString() : hour.toString();
        strMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
        console.log("hour is: ", hour);
        console.log("minutes is: ", minutes);
        console.log(hour.toString() + ":" + strMinutes + ifPM);
        this.setState({ timeDisplayEnd: hour.toString() + ":" + strMinutes + ifPM, dateTimestampEnd: date });
        this._hideDateTimePickerTwo();
    };

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }

    hide = () => { return; }

    onUpdatePhotos(photos) { this.setState({ photos }) }


    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    changeEventPicture = async (item) => {
        this.setState({ editedItem: item });
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
            var img;
            await RNS3.put(file, options).then((response) => {
                img = response.body.postResponse.key;
            }).catch((err) => { console.log(err) });
            console.log(img);
            console.log(item._id);
            console.log(item.name);
            await axios.post(`https://localhost:3000/api/events/modEventPic/${item._id}`, { img }).then((response) => {
                this.setState({ imageURL: (response.data.image ? 'https://s3.amazonaws.com/clubster-123/' + response.data.image : DefaultImg) });
            }).catch((err) => { console.log(err); return; });
            this.props.navigation.navigate('ShowEvents');
        } catch (error) {
            console.log(error);
        };
    };

    openEditModal(item) {
        this.setState({
            editedItem: item,
            name: this.name,
            editModal: true,
        })
    }

    closeEditModal() { this.setState({ editModal: false }) }

    submitEventChanges = async (item) => {
        let { name, description, location } = this.state;
        if (name == "")
            name = item.name;
        if (description == "")
            description = item.description;
        if (location == "")
            location = this.state.editedItem.location
        axios.post(`https://localhost:3000/api/events/${item._id}`, {
            name: this.state.name,
            description: this.state.description,
            chosenDate: this.state.chosenDate,
            selectedStartDate: this.state.selectedStartDate,
            selectedEndDate: this.state.selectedEndDate,
            timeDisplay: this.state.timeDisplay,
            timeDisplayEnd: this.state.timeDisplayEnd,
            location: this.state.location
        }).then(() => {
            this.setState({ editModal: false });
        }).catch(() => { return; });
    }

    deleteEvent = async (item) => {
        await axios.post(`https://localhost:3000/api/events/${item._id}/delete`).then(() => {
            this.setState({ confirmDel: false });
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log("error.request");
                console.log(error.message);
            } else {
                console.log('Error', error.message);
            }

        })
    }

    // Likers
    openLikersModal() {
        axios.get(`https://clubster-backend.herokuapp.com/api/events/${this.props._id}/likers`)
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
                    <Thumbnail source={{ uri: (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg) }} />
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
            </ListItem>
        );
    }

    // Going
    openGoingModal() {
        axios.get(`https://clubster-backend.herokuapp.com/api/events/${this.props._id}/going`)
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
                    <Thumbnail source={{ uri: (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg) }} />
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
            </ListItem>
        );
    }

    // Rides
    openRidesModal() {
        axios.get(`https://clubster-backend.herokuapp.com/api/${this.props._id}/rides`)
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
        const { userID } = this.props;
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
            axios.post(`https://clubster-backend.herokuapp.com/api/${this.props._id}/createRide`, {
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
            await axios.post(`https://clubster-backend.herokuapp.com/api/${item._id}/joinRide`, { rideRemove: removeFromRide });
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
                                <Icon onPress={() => this.addRider(item)} name="add" style={{ marginLeft: 6, color: 'black', fontSize: 24 }} />
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
                <Thumbnail small source={{ uri: (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg) }} />
            </ListItem>
        );
    }

    saveQRCode = () => {
        this.svg.toDataURL(this.callback);
    };

    callback(dataURL) {
        let shareImageBase64 = {
            url: `data:image/png;base64,${dataURL}`,
            message: 'Share Link', //  for email
        };
        Share.share(shareImageBase64).catch(error => console.log(error));
    }

    popUpQrCode = (_id) => {
        return (
            <Modal isVisible={this.state.displayQRCode}>
                <View style={styles.modalStyle}>
                    <QRCode
                        value={JSON.stringify({ test: 'testdata' })}
                        getRef={c => (this.svg = c)}
                    />
                    <TouchableOpacity onPress={this.saveQRCode} />
                </View>
            </Modal>
        )
    }

    render() {
        const eventInfo = {
            _id: this.props._id,
            name: this.props.name,
            description: this.props.description,
            location: this.props.location,
            date: 'June 17: 4:00 PM - 6:00 PM',
            comments: this.props.comments,
            photos: this.props.photos
        }

        var { seats, rideTime, rideLocation, description } = this.state;

        const { name, date, time, location } = this.state;
        const { selectedStartDate, selectedEndDate } = this.state;
        let { errors = {} } = this.state;
        const minDate = new Date(); // Today
        const maxDate = new Date(2020, 6, 3);
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        const endDate = selectedEndDate ? selectedEndDate.toString() : '';

        return (
            <Container>
                <Header
                    backgroundColor={'transparent'}
                    leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.goBack() }}
                    rightComponent={this.props.isAdmin ?
                        (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                            <Icon iconStyle={{ alignSelf: 'center', justifyContent: 'center' }} type='material-community' name='qrcode' onPress={() => this.setState({ qrModal: true })} />
                            <Icon name='edit' onPress={() => this.setState({ editModal: true })} />
                            <Icon type='material-community' name='delete' onPress={() => this.setState({ confirmDel: true })} />
                        </View>)
                        : null}
                />
                <ScrollView>
                    <TouchableWithoutFeedback onPress={() => this.changeEventPicture(eventInfo)}>
                        <Image source={{ uri: !this.props.image || this.props.image == null ? DefaultImg : 'https://s3.amazonaws.com/clubster-123/' + this.props.image }} style={{ height: 200 }} />
                    </TouchableWithoutFeedback>
                    <InformationCard eventInfo={eventInfo} />
                    <Content padder>
                        <Card >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 }}>
                                <AntDesign.Button color='#59cbbd' backgroundColor='white' name='like1' size={28} onPress={() => this.openLikersModal()}>Likers</AntDesign.Button>
                                <FontAwesome.Button color='#59cbbd' backgroundColor='white' name='users' size={28} onPress={() => this.openGoingModal()}>Going</FontAwesome.Button>
                                <FontAwesome.Button color='#59cbbd' backgroundColor='white' name='car' size={28} onPress={() => this.openRidesModal()}>Rides</FontAwesome.Button>
                            </View>
                        </Card>
                    </Content>
                    <CommentCard eventInfo={eventInfo} />
                </ScrollView>

                <Modal isVisible={this.state.qrModal} style={styles.modalStyle} onBackdropPress={() => this.setState({ qrModal: false })}>
                    <View style={styles.container} >
                        <QRCode
                            value={`https://ayunus22198.github.io/ClubstersSignInPage/#/${this.props._id}`}
                            getRef={c => (this.svg = c)}
                            size={320}
                        />
                        <TouchableOpacity onPress={this.saveQRCode} >
                            <View style={styles.instructions}>
                                <Text>Share QR code</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal isVisible={this.state.editModal}>
                    <View style={styles.modalStyle}>
                        <View>
                            <TouchableOpacity onPress={() => this.closeEditModal()}>
                                <Icon type='ionicon' name="ios-arrow-dropleft"
                                    style={styles.modalButton} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textInAreaContainer}>
                            <TextInput placeholder='name'
                                style={styles.textInArea}
                                label='name'
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                            />
                        </View>
                        <View style={styles.textInAreaContainer}>
                            <TextInput placeholder='location'
                                style={styles.textInArea}
                                label='location'
                                onChangeText={(location) => this.setState({ location })}
                                value={this.state.location}
                            />
                        </View>
                        <View style={styles.buttonInAreaContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    this._showModal(1)
                                }}
                                style={{
                                    height: 50,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    // flex: 1,
                                    // flexDirection: 'row',
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}>
                                <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Date</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonInAreaContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    this._showModal(2)
                                }}
                                style={{
                                    height: 50,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    // flex: 1,
                                    // flexDirection: 'row',
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}>
                                {(this.state.timeDisplay == null) ? <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Start Time</Text> : <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>{this.state.timeDisplay.toString()}</Text>}
                            </TouchableOpacity>

                        </View>
                        <View style={styles.buttonInAreaContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    this._showModal(3)
                                }}
                                style={{
                                    height: 50,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    // flex: 1,
                                    // flexDirection: 'row',
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}>
                                {(this.state.timeDisplayEnd == null) ? <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>End Time</Text> : <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>{this.state.timeDisplayEnd.toString()}</Text>}
                            </TouchableOpacity>

                        </View>
                        <View style={{ flex: 1 }}>
                            <Modal isVisible={this.state.showDate} onRequestClose={this.hide}>
                                <View style={styles.container}>
                                    <CalendarPicker
                                        startFromMonday={true}
                                        allowRangeSelection={true}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        todayBackgroundColor="#f2e6ff"
                                        selectedDayColor="#7300e6"
                                        selectedDayTextColor="#FFFFFF"
                                        onDateChange={this.onDateChange}
                                    />

                                    <View>
                                        <Text>SELECTED START DATE:{startDate}</Text>
                                        <Text>SELECTED END DATE:{endDate}</Text>
                                    </View>
                                    <Button block onPress={() => { this.setState({ showDate: false }) }} style={styles.button}>
                                        <Text style={{ color: '#fff' }}> Submit </Text>
                                    </Button>
                                    <Button block danger onPress={() => { this.setState({ showDate: false }) }} style={styles.button}>
                                        <Text style={{ color: '#fff' }}> Cancel </Text>
                                    </Button>
                                </View>
                            </Modal>
                        </View>

                        <View style={{ flex: 1 }}>
                            <DateTimePicker
                                isVisible={this.state.showTime}
                                mode={'time'}
                                is24Hour={false}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <DateTimePicker
                                isVisible={this.state.showTime2}
                                mode={'time'}
                                is24Hour={false}
                                onConfirm={this._handleDatePickedTwo}
                                onCancel={this._hideDateTimePickerTwo}
                            />
                        </View>

                        <View style={styles.textInAreaContainer}>
                            <TextInput placeholder='description'
                                style={styles.textInArea}
                                label='description'
                                onChangeText={(description) => this.setState({ description })}
                                //onChangeText={item.description = description}
                                value={this.state.description}
                            />
                        </View>
                        <View>
                            <Button bordered
                                onPress={() => { this.submitEventChanges(eventInfo) }}
                                style={{
                                    margin: 20, width: 160,
                                    justifyContent: 'center', alignSelf: 'center'
                                }}>
                                <Text>Update Event!</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.likersModal}
                    style={styles.modalStyle}>
                    <View style={{ flex: 1, margin: 2 }}>
                        <TouchableOpacity onPress={() => this.closeLikersModal()}>
                            <Icon type='ionicon' name="ios-arrow-dropleft"
                                style={styles.modalButton} />
                        </TouchableOpacity>
                        {!this.props.likers || this.props.likers.length == 0 ?
                            <Text style={styles.noneText}> No one likes this event </Text>
                            :
                            <FlatList
                                data={this.props.likers}
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
                                <Icon type='ionicon' name="ios-arrow-dropleft"
                                    style={styles.modalButton} />
                            </TouchableOpacity>
                        </View>
                        {!this.props.going || this.props.going.length == 0 ?
                            <Text style={styles.noneText}> No one is going to this event </Text>
                            :
                            <FlatList
                                data={this.props.going}
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
                                <Icon type='ionicon' name="ios-arrow-dropleft"
                                    style={styles.modalButton} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.addRideDropDown()}>
                                <Icon name="add"
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
                                this.props.rides == undefined || this.props.rides.length == 0 ?
                                    <Text style={styles.noneText}> There are no rides for this event </Text>
                                    :
                                    <FlatList
                                        data={this.props.rides}
                                        renderItem={this._renderRide}
                                        horizontal={false}
                                        keyExtractor={ride => ride._id}
                                    />)
                        }
                    </View>
                </Modal>
                <Modal isVisible={this.state.confirmDel}>
                    <View style={styles.modalStyle}>
                        <View>
                            <Text style={{ color: 'red', fontWeight: 'bold' }}>ARE YOU SURE YOU WANT TO DELETE THIS EVENT?</Text>
                        </View>
                        <View>
                            <Button block onPress={() => this.deleteEvent(eventInfo)} style={styles.button}>
                                <Text style={{ color: '#fff', marginTop: 10, marginBottom: 5 }}> Yes </Text>
                            </Button>
                            <Button block onPress={() => { this.setState({ confirmDel: false }) }} style={styles.button}>
                                <Text style={{ color: '#fff', marginTop: 5, marginBottom: 10 }}> No </Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const { isAdmin } = state.clubs.club;
    return {
        ...(state.events.thisEvent), isAdmin, userID: state.user.user._id
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         changeEventPicture: (eventID, img) => dispatch({
//             type: EVENTS_CHANGEPICTURE,
//             payload: { eventID, img }
//         }),
//     }
// }

export default connect(mapStateToProps, /*mapDispatchToProps*/ null)(EventProfile);

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
    textinArea: {
        height: 50,
        paddingLeft: 5,
        paddingRight: 5,
        alignSelf: 'center',
        alignItems: 'center'
    },
    listStyle: {
        height: HEIGHT / 8,
        marginTop: 6
    },
    noneText: {
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    }
});
