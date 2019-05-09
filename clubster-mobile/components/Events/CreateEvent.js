import React from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { ImagePicker, Permissions, Constants } from 'expo';
import {
    Container, Header, Content, Card,
    CardItem, Thumbnail, Text, Button, Icon,
    Left, Body, Right, Form, Item, Input
} from 'native-base';
import v1 from 'uuid/v1';
import { connect } from 'react-redux'
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { EVENTS_CREATE } from '../../reducers/ActionTypes';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;

export class CreateClubEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            date: '',
            location: '',
            time: '',
            imageURL: null,
            uri: 'https://image.flaticon.com/icons/png/512/128/128423.png',
            isImageUploaded: false
        }
    }

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
                    uri: 'https://s3.amazonaws.com/clubster-123/' + response.body.postResponse.key,
                    isImageUploaded: true
                });
            }).catch((err) => { console.log('upload image to aws failed'); console.log(err) });
        } catch (error) { console.log('library handle failed'); console.log(error); }
    }

    createEvent = () => {
        const { name, date, time, description, location, imageURL } = this.state;
        axios.post(`http://localhost:3000/api/events/${this.props.clubID}/new`, {
            name, date, time, description, location, imageURL
        }).then(response => {
            this.props.newClubEvent(response.data.event);
            this.props.navigation.navigate('ShowEvents');
        }).catch(error => console.log(error + 'ruh roh'));
    }

    render() {
        const { name, date, time, description, location } = this.state;

        return (
            <Container>
                <Form>
                    <Item>
                        <Input placeholder="Name"
                            label='name'
                            onChangeText={(name) => this.setState({ name })}
                            value={name}
                        />
                    </Item>
                    <Item>
                        <Input placeholder="Date"
                            label='date'
                            onChangeText={(date) => this.setState({ date })}
                            value={date}
                        />
                    </Item>
                    <Item>
                        <Input placeholder="Time"
                            label='time'
                            onChangeText={(time) => this.setState({ time })}
                            value={time}
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
                </Form>
                <Content>
                    {this.state.isImageUploaded == false
                        ?
                        <TouchableOpacity onPress={this.useLibraryHandler}>
                            <Thumbnail square small style={styles.uploadIcon}
                                source={{ uri: this.state.uri }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this.useLibraryHandler}>
                            <Thumbnail square style={styles.imageThumbnail}
                                source={{ uri: this.state.uri }} />
                        </TouchableOpacity>
                    }
                </Content>

                <Button bordered
                    onPress={this.createEvent}
                    style={{
                        margin: 20, width: 160,
                        justifyContent: 'center', alignSelf: 'center'
                    }}>
                    <Text>Create Event!</Text>
                </Button>

            </Container>
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
    eventCard: {
        flex: 1,
        backgroundColor: 'lavender',
        marginVertical: 3,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    },
    eventContainer: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0,
        height: EVENT_HEIGHT,
        width: EVENT_WIDTH,
        alignSelf: 'center',
        marginTop: 25
    },
    eventTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 5,
        flex: 1
    },
    eventTitle2: {
        position: 'absolute',
        right: 2,
        top: 2,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    },
    uploadIcon: {
        alignSelf: 'center',
        margin: 10,
    },
    imageThumbnail: {
        margin: 20,
        alignSelf: 'center',
        borderRadius: 2,
        width: WIDTH / 1.5,
        height: HEIGHT / 3
    },
});

