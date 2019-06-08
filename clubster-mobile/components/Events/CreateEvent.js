import React from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Header } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';
var moment = require('moment-timezone');
import { Thumbnail, Text, Button, Icon, Form, Item, Input } from 'native-base';
import v1 from 'uuid/v1';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux'
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { EVENTS_CREATE } from '../../reducers/ActionTypes';
import { ScrollView } from 'react-native-gesture-handler';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;

export class CreateClubEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            timezone: null,
            timezoneArray: moment.tz.names(),
            date: '',
            location: '',
            time: null,
            timeDisplay: null,
            timeDisplayEnd: null,
            imageURL: null,
            defaultURI: 'https://image.flaticon.com/icons/png/512/128/128423.png',
            uri: null,
            chosenDate: new Date(),
            selectedStartDate: null,
            selectedEndDate: null,
            isDateTimePickerVisible: false,
            showDate: false,
            showTime: false,
            showTime2: false,
            showTimeZone: false,
            validModal: false
        }
        this.setDate = this.setDate.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
    }

    componentDidMount() {
        var timezoneArr = [];
        for (let i = 0; i < this.state.timezoneArray.length; i++) {
            timezoneArr.push({
                key: this.state.timezoneArray[i]
            });
        }
        this.setState({ timezoneArray: timezoneArr });
    }

    _showDateTimePicker = () => this.setState({ showTime: true });

    _hideDateTimePicker = () => this.setState({ showTime: false });
  
    _hideDateTimePickerTwo = () => this.setState({ showTime2: false });
  
    hide = () => { return; }
  
    _showModal = (type) => {
      (type == 1) ? this.setState({ showDate: true }) : (type == 2) ? this.setState({ showTime: true }) : (type == 3) ? this.setState({ showTimeZone: true }) : this.setState({ showTime2: true });
    }
    _hideModal = (type) => {
        (type == 1) ? this.setState({ showDate: false }) : (type == 2) ? this.setState({ showTime: false }) : (type == 3) ? this.setState({ showTimeZone: false }) : this.setState({ showTime2: false });
    }
  
    _handleDatePicked = (date) => {
      let hour  = parseInt(date.toString().substring(date.toString().indexOf(":") - 2, date.toString().indexOf(":")));
      let minutes  = parseInt(date.toString().substring(date.toString().indexOf(":") + 1, date.toString().indexOf(":") + 3));
      let ifPM = (hour >= 12) ? " PM" : " AM";
      if (hour == 0) hour = 12;
      else hour -= (hour > 12) ? 12 : 0; //hour = 9, 3:09
      strMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
      this.setState({ timeDisplay: hour.toString() + ":" + strMinutes + ifPM, dateTimestampStart: date });
      this._hideDateTimePicker();
    };
  
    _handleDatePickedTwo = (date) => {
      let hour  = parseInt(date.toString().substring(date.toString().indexOf(":") - 2, date.toString().indexOf(":")));
      let minutes  = parseInt(date.toString().substring(date.toString().indexOf(":") + 1, date.toString().indexOf(":") + 3));
      let ifPM = (hour >= 12) ? " PM" : " AM";
      if (hour == 0) hour = 12;
      else hour -= (hour > 12) ? 12 : 0;
      strMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
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
                    uri: 'https://s3.amazonaws.com/clubster-123/' + response.body.postResponse.key
                });
            }).catch((err) => { console.log('upload image to aws failed'); console.log(err) });
        } catch (error) { console.log('library handle failed'); console.log(error); }
    }

    createEvent = () => {
        const { name, date, time, description, location, imageURL, chosenDate, selectedStartDate, selectedEndDate, timeDisplay, timeDisplayEnd } = this.state;
        axios.post(`https://clubster-backend.herokuapp.com/api/events/${this.props.clubID}/new`, {
            name, date, time, description, location, imageURL, chosenDate, selectedStartDate, selectedEndDate, timeDisplay, timeDisplayEnd
        }).then(response => {
            this.props.newClubEvent(response.data.event);
            this.props.navigation.navigate('ShowEvents');
        }).catch(error => console.log(error + 'ruh roh'));
    }

    setTimeZone = (timezone) => {
        // this.setState({
        //   timezone: timezone,
        //   showTimeZone: false
        // })
        return;
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.setState({ timezone: item.key, showTimeZone: false })}>
                <View>
                    <Text>{item.key}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    // modal for when user enters invalid fields
    openValidModal() {
        this.setState({
            validModal: true
        })
    }

    closeValidModal() { this.setState({ validModal: false }) }

    validateInput = () => {
        let errors = {};
        if (this.state != null) {
            const { name, date, time, location, description, imageURL } = this.state;

            if (name == "")
                errors['name'] = 'Please enter a name for the event'
            if (date == "")
                errors['date'] = 'Please enter a date'
            if (time == "")
                errors['time'] = 'Please enter a time'
            if (location == "")
                errors['location'] = 'Please enter a location'
            if (description == "")
                errors['description'] = 'Please enter a description'
            this.setState({ errors });
            if (Object.keys(errors).length == 0) {
                this.createEvent();
            }
            else {
                this.openValidModal();
            }
        }
    }

    render() {
        const { name, date, time, description, location } = this.state;
        const { selectedStartDate, selectedEndDate } = this.state;
        let { errors = {} } = this.state;
        const minDate = new Date(); // Today
        const maxDate = new Date(2020, 6, 3);
        const startDate  =  selectedStartDate ? selectedStartDate.toString() : '';
        const endDate = selectedEndDate ? selectedEndDate.toString() : '';

        return (
            <ScrollView>
                <Header
                    backgroundColor={'transparent'}
                    leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.goBack() }}
                />
                <Form>
                    <Item>
                        <Input placeholder="Name"
                            label='name'
                            onChangeText={(name) => this.setState({ name })}
                            value={name}
                        />
                    </Item>
                    <Item>
                        <Input placeholder="Location"
                            label='location'
                            onChangeText={(location) => this.setState({ location })}
                            value={location}
                        />
                    </Item>
                    <Item>
                        <Input placeholder="Description"
                            label='description'
                            onChangeText={(description) => this.setState({ description })}
                            value={description}
                        />
                    </Item>
                    <Item>
                        <TouchableOpacity
                            onPress={() => {
                                this._showModal(1)
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
                            <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Date</Text>
                        </TouchableOpacity>
                    </Item>
                    <Item>
                        <TouchableOpacity
                            onPress={() => {
                                this._showModal(2)
                            }}
                            style={{
                                height: 50,
                                paddingLeft: 5,
                                paddingRight: 5,
                                flex: 0.5,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}>
                            {(this.state.timeDisplay == null) ? <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Start Time</Text> : <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>{this.state.timeDisplay.toString()}</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this._showModal(4)
                            }}
                            style={{
                                height: 50,
                                paddingLeft: 5,
                                paddingRight: 5,
                                flex: 0.5,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}>
                            {(this.state.timeDisplayEnd == null) ? <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>End Time</Text> : <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>{this.state.timeDisplayEnd.toString()}</Text>}
                        </TouchableOpacity>

                    </Item>
                    <Item>
                        <TouchableOpacity
                            onPress={() => {
                                this._showModal(3)
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
                            {(this.state.timezone == null) ? <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Select Timezone</Text> : <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>{this.state.timezone}</Text>}
                        </TouchableOpacity>
                    </Item>
                </Form>
                            
                <TouchableOpacity onPress={this.useLibraryHandler}>
                    <Thumbnail square small style={!this.state.uri ? styles.uploadIcon : styles.imageThumbnail}
                        source={{ uri: !this.state.uri ? this.state.defaultURI : this.state.uri }} />
                </TouchableOpacity>

                <Modal isVisible={this.state.validModal}>
                    <View style={styles.modalStyle}>
                        <TouchableOpacity onPress={() => this.closeValidModal()}>
                            <Icon name="ios-arrow-dropleft"
                                style={styles.modalButton} />
                        </TouchableOpacity>
                        <Text style={styles.modalContent}>{errors.name}</Text>
                        <Text style={styles.modalContent}>{errors.date}</Text>
                        <Text style={styles.modalContent}>{errors.time}</Text>
                        <Text style={styles.modalContent}>{errors.location}</Text>
                        <Text style={styles.modalContent}>{errors.description}</Text>
                    </View>
                </Modal>

                {/* MODAL  */}
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

                <Button bordered
                    onPress={this.createEvent}
                    style={{
                        margin: 20, width: 160,
                        justifyContent: 'center', alignSelf: 'center'
                    }}>
                    <Text>Create Event!</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateClubEvent);

const styles = StyleSheet.create({
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

