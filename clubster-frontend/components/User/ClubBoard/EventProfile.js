import React, { Component } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from 'react-navigation';
import tx from 'tcomb-additional-types';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Font, AppLoading } from "expo";
import v1 from 'uuid/v1';
import { accessKeyId, secretAccessKey } from '../../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import CommentCard from '../Cards/CommentCard';
import InformationCard from '../Cards/InformationCard';
import ImageGrid from '../Cards/ImageGrid';
import Gallery from '../Cards/Gallery';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export default class EventProfile extends Component {
    constructor(props) {
        super(props);

        this.event = this.props.navigation.getParam('event', null);
        this.state = {
            eventImage: this.event.image ? 'https://s3.amazonaws.com/clubster-123/' + this.event.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC'
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

    render() {
        const eventInfo = {
            name: this.event.name,
            description: this.event.description,
            location: this.event.location,
            date: this.event.date
        }

        return (
            <Container>
              <ScrollView>
                <TouchableWithoutFeedback onPress={() => this.changeEventPicture()}>
                    <Image source={{ uri: this.state.eventImage }} style={{ height: 200 }} />
                </TouchableWithoutFeedback>
                <InformationCard eventInfo={eventInfo} />
                <CommentCard />
                <Gallery />
              </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({});
