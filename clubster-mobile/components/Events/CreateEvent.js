import React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Header } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';
import { Thumbnail, Text, Button, Icon, Form, Item, Input, ListItem, Left, Body, Right } from 'native-base';
import v1 from 'uuid/v1';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux'
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { EVENTS_CREATE } from '../../reducers/ActionTypes';
import { ScrollView } from 'react-native-gesture-handler';
import { DefaultImg } from '../Utils/Defaults';
import { OptimizedFlatList } from 'react-native-optimized-flatlist';
import Tags from "react-native-tags";
import CheckBox from 'react-native-check-box'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export class CreateClubEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
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
            validModal: false,
            addClubsModal: false,
            clubsSelected: [],
            clubsSelectedNames: []
        }
        this.setDate = this.setDate.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
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
            const { event } = response.data;
            this.state.clubsSelected.forEach(invitedClubID => {
                axios.post(`https://clubster-backend.herokuapp.com/api/notifications/new`, 
                    { clubEvent: { _id: event._id, name: event.name }, type: 'EVENT_JOIN_REQ', orgID: invitedClubID, collabOrgName: this.props.name });
            });
            this.props.newClubEvent(event);
            this.props.navigation.navigate('ShowEvents');
        }).catch(error => console.log(error + 'ruh roh'));
    }

    _renderItem = ({ item }) => {
        let url = 'https://s3.amazonaws.com/clubster-123/' + item.image;
        if (!item.image) url = DefaultImg;
        return (
            <ListItem>
                <Left>
                    <Thumbnail source={{ uri: url }} />
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
                <Right>
                    <CheckBox
                        style={{ flex: 1, padding: 1 }}
                        onClick={() => this.selectClub(item._id, item.name)}
                        isChecked={this.state.clubsSelected.includes(item._id)}
                        leftText={"CheckBox"}
                    />
                </Right>
            </ListItem>
        )
    }

    selectClub = (clubID, clubName) => {
        let clubsSelected = this.state.clubsSelected;
        let clubsSelectedNames = this.state.clubsSelectedNames;
        let selectedIndex = clubsSelected.indexOf(clubID);
        if(selectedIndex != -1) {
            clubsSelected.splice(selectedIndex, 1);
            clubsSelectedNames.splice(selectedIndex, 1);
        } else {
            clubsSelected.push(clubID);
            clubsSelectedNames.push(clubName)
        }
        this.setState({ clubsSelected, clubsSelectedNames, extraDataClubs: Math.random() });
    }

    findClubImage = (name) => {
        var orgs = this.props.allOrganizations;
        for (var i = 0; i < orgs.length; i++) 
            if (orgs[i].name == name) 
                return orgs[i].image ? 'https://s3.amazonaws.com/clubster-123/' + orgs[i].image : DefaultImg;
            
        return DefaultImg;
    }

    // modal for when user enters invalid fields
    openValidModal() {
        this.setState({
            validModal: true
        })
    }

    closeValidModal() { this.setState({ validModal: false }) }

    openClubsModal() { this.setState({ addClubsModal: true }) }
    closeClubsModal() { this.setState({ addClubsModal: false }) }

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
                    rightComponent={{ icon: 'group-add', onPress: () => this.openClubsModal() }}
                />
                <Modal isVisible={this.state.addClubsModal} style={styles.modalStyle} onBackdropPress={() => this.closeClubsModal()} >
                    <View style={{ flex: 1, margin: 2 }}>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => this.closeClubsModal()}>
                                <Icon type='Ionicons' name="ios-arrow-dropleft"
                                    style={styles.modalButton} />
                            </TouchableOpacity>
                        </View>
                        <OptimizedFlatList
                            data={this.props.allOrganizations}
                            renderItem={this._renderItem}
                            keyExtractor={organization => organization._id}
                            ItemSeparatorComponent={this.renderSeparator}
                            extraData={this.props.extraDataClubs + this.state.extraDataClubs}
                        />
                    </View>
                </Modal>
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
                </Form>

                <ScrollView horizontal>
                    <Tags
                        initialTags={this.state.clubsSelectedNames}
                        containerStyle={{ justifyContent: 'center' }}
                        readonly={true}
                        inputStyle={{ backgroundColor: 'white' }}
                        renderTag={({ tag, index }) => (
                            <TouchableOpacity disabled={true} key={`${tag}-${index}`} style={styles.tag}>
                                <Thumbnail small source={{ uri: this.findClubImage(tag) }} />
                                <Text> {tag}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </ScrollView>
                           
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
                        <View style={{ backgroundColor: 'white' }}>
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
    const { _id, name } = state.clubs.club;
    var allClubs = state.clubs.allClubs;
    if (!allClubs) return { clubID: _id }

    for (var i = 0; i < allClubs.length; ++i) 
        if (allClubs[i]._id == _id)
            break;
    if (i < allClubs.length) 
        allClubs.splice(i, 1);
    return {
        clubID: _id, name, allOrganizations: allClubs, extraDataClubs: Math.random()
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
    tag: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        backgroundColor: "#e0e0e0",
        borderRadius: 16,
        padding: 5,
        margin: 4
      },
});
