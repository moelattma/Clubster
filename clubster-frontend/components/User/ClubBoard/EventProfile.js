import React, { Component } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import v1 from 'uuid/v1';
import { accessKeyId, secretAccessKey } from '../../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { Container, Card, CardItem, Form, Content, 
    ListItem, Thumbnail, Item, Text, Button, Icon, Left, Body, Right, Input } from 'native-base';
import CommentCard from '../Cards/CommentCard';
import InformationCard from '../Cards/InformationCard';
import ImageGrid from '../Cards/ImageGrid';
import Gallery from '../Cards/Gallery';
import Modal from 'react-native-modal';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export default class EventProfile extends Component {
    constructor(props) {
        super(props);

        this.event = this.props.navigation.getParam('event', null);
        this.state = {
            eventImage: this.event.image ? 'https://s3.amazonaws.com/clubster-123/' + this.event.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC',
            isModalVisible: false,
            form: false,
            rides: [],
            seats: '',
            rideTime: '',
            rideLocation: '',
            description: '',
        }
   }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    changeEventPicture = async () => {
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
            };
            var imageURL;
            await RNS3.put(file, options).then((response) => {
                imageURL = response.body.postResponse.key;
            }).catch((err) => { console.log(err) });
            await axios.post(`http://localhost:3000/api/events/${this.event._id}/changeEventPicture`, { imageURL }).then((image) => {
                this.setState({ eventImage: 'https://s3.amazonaws.com/clubster-123/' + image });
            });
        } catch (error) { console.log(error); }
    }

    openModal(){
        const event = this.props.navigation.getParam('event', null);
        axios.get(`http://localhost:3000/api/${event._id}/rides`)
        .then(response => {
            this.setState({
                isModalVisible: true,
                rides: response.data.rides
            })
            console.log(response.data.rides)
        })
        .catch(err => {console.log(err)})
    }

    closeModal(){
        this.setState({
            isModalVisible: false,
        })
    }

    dropDown(){
        this.setState({
            form: true
        })
    }

    submitRide(){
        const event = this.props.navigation.getParam('event', null);
        const { seats, rideTime, rideLocation, description } = this.state;
        axios.post(`http://localhost:3000/api/${event._id}/createRide`, {
            passengerSeats: seats,
            time: rideTime,
            location: rideLocation,
            description: description,
        }).then((response) => {
            if (response.status == 201 || response.status == 200) {
                this.setState({ 
                    isModalVisible: false, 
                    rides: response.data.ride
                });
            }
        })
        .catch((err) => {console.log('error creating new ride'); console.log(err)});
    }

    _renderItem = ({ item }) => {
        return (
          <ListItem thumbnail style={styles.listStyle}>
            <Left>
              <Thumbnail large source={{ uri: 'https://s3.amazonaws.com/clubster-123/'+item.driverID.image }} />
            </Left>
            <Body>
              <Text>{item.driverID.name}</Text>
            </Body>
            {/* <Right>
              <Text>{item.isAdmin ? 'Admin' : 'Member'}</Text>
            </Right> */}
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
                <TouchableWithoutFeedback onPress={() => this.changeEventPicture()}>
                    <Image source={{ uri: this.state.eventImage }} style={{ height: 200 }} />
                </TouchableWithoutFeedback>
                <InformationCard eventInfo={eventInfo} />
                <CommentCard eventInfo={eventInfo}/>
                <Gallery eventInfo={eventInfo} />
                <Content padder>
                <Card>
                    <CardItem footer bordered>
                    <TouchableOpacity onPress={() => this.openModal()}>
                        <Text>See Rides</Text>
                    </TouchableOpacity>
                    </CardItem>
                </Card>
                </Content>
              </ScrollView>

              <View>
                <Modal isVisible={this.state.isModalVisible}
                style={styles.modalStyle}>
                <View style={{ flex: 1, margin: 20 }}>
                    <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => this.closeModal()}>
                        <Icon name="ios-arrow-dropleft"
                        style={styles.modalButton}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.dropDown()}>
                        <Icon name="ios-add"
                        style={styles.modalButton}/>
                    </TouchableOpacity>
                    </View>
                    {this.state.form
                    ?<View>
                    <Form>
                    <Item>
                    <Input placeholder="number of available seats?"
                            label='seats'
                            onChangeText={(seats) => this.setState({ seats })}
                            value={seats}
                             />
                    </Item>
                    <Item>
                    <Input placeholder="Pick up time."
                            label='rideTime'
                            onChangeText={(rideTime) => this.setState({ rideTime })}
                            value={rideTime}
                             />
                    </Item>
                    <Item>
                    <Input placeholder="Pick up location."
                            label='location'
                            onChangeText={(rideLocation) => this.setState({ rideLocation })}
                            value={rideLocation}
                             />
                    </Item>
                    <Item>
                    <Input placeholder="Notes."
                            label='description'
                            onChangeText={(description) => this.setState({ description })}
                            value={description}
                             />
                    </Item>
                    
                    </Form>
                    <Button bordered onPress={() => this.submitRide()}
                    style={{margin:20}}>
                        <Text>Submit Ride!</Text>
                    </Button>
                    </View>
                    :
                    <FlatList
                        data={this.state.rides}
                        renderItem={this._renderItem}
                        horizontal={false}
                        keyExtractor={club => club._id}
                    />
                    }
                </View>
                </Modal>
            </View>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    aboutText:{
        marginLeft: 10,
        marginTop: 20,
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    editButton:{
        backgroundColor:'white',
        margin: 10,
        alignSelf: 'flex-end',
        fontSize: 40
    },
    modalStyle:{
        backgroundColor: 'white',
        padding: 10,
        marginTop: 50,
        marginRight: 20,
        marginBottom: 30,
        marginLeft: 20,
        borderRadius: 10
    },
    modalButtons:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButton:{
        color:'black',
        fontSize:40,
        margin: 10
    },
    listStyle:{
        height: HEIGHT/8,
        marginTop: 3
    }
});
