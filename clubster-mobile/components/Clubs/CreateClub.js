import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios';
import { Header } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';
import v1 from 'uuid/v1';
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import { Content, Container, Thumbnail, Form, Item, Input, Button } from 'native-base';
import { RNS3 } from 'react-native-aws3';
import { CLUBS_CREATE } from '../../reducers/ActionTypes';

const window = Dimensions.get('window');
const { width: WIDTH, height: HEIGHT } = window;

class CreateClub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURL: '',
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
                })
            }).catch((err) => { console.log(err) });
        } catch (error) { console.log(error); };
    };

    submit = async () => {
        const { name, description, imageURL } = this.state;
        await axios.post('https://clubster-backend.herokuapp.com/api/organizations/new', {
            name, description, imageURL
        }).then((response) => {
            this.props.createClub(response.data.organization);
            this.props.navigation.navigate('ShowClubs');
        });
    }

    render() {
        const { name, description } = this.state;
        return (
            <Container>
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
                            <Thumbnail square large style={styles.imageThumbnail}
                                source={{ uri: this.state.uri }} />
                        </TouchableOpacity>
                    }
                </Content>

                <Button bordered
                    onPress={this.submit}
                    style={{
                        margin: 20, width: 100,
                        justifyContent: 'center', alignSelf: 'center'
                    }}>
                    <Text>Create Club!</Text>
                </Button>

            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createClub: (club) => dispatch({
            type: CLUBS_CREATE,
            payload: { club }
        })
    }
}

export default connect(null, mapDispatchToProps)(CreateClub);

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    topButtons: {
        backgroundColor: '#E0E0E0',
        width: 100,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        marginVertical: 20,
    },
    uploadIcon: {
        alignSelf: 'center',
        margin: 10,
    },
    imageThumbnail: {
        margin: 20,
        alignSelf: 'center',
        borderRadius: 2,
        width: WIDTH / 2,
        height: HEIGHT / 3.5
    },
    item: {
        backgroundColor: '#009900',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1
    }
});
