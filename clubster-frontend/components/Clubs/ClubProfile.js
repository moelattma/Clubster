// Profile for club (additional info of club)

import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import InformationCard from '../User/Cards/InformationCard';
import Gallery from '../User/Cards/Gallery';
import { Container, Button, Thumbnail, Text } from 'native-base';
import { DefaultImg } from '../router';

const { width: WIDTH } = Dimensions.get('window');

const JOIN_MEM = "ORG_JOIN_MEMBER";
const JOIN_ADMIN = "ORG_JOIN_ADMIN";

export default class ClubProfile extends Component {
    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const orgID = navigation.getParam('_id', null);

        this.state = {
            organizationID: orgID,
            name: '',
            president: '',
            _id:'',
            description: '',
            isLoading: true,
            joinable: false,
            img: DefaultImg,
            noteStatus: true,
            photos: []
        }
    }

    async componentWillMount() {
        await axios.post("https://clubster-backend.herokuapp.com/api/organizations/isMember", { orgID: this.state.organizationID }).then((response) => {
            this.setState({ joinable: (!response.data.isMember) });
            const { image, name, president, description, _id, photos } = response.data.organization;

            this.setState({ img: (image ? 'https://s3.amazonaws.com/clubster-123/' + image : DefaultImg),
                            name, president, description, _id, photos, isLoading: false });
        });
    }

    static navigationOptions = ({ navigation }) => {
        const name = navigation.getParam('name', null);

        return {
            title: name,
            headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', fontWeight: '500', fontSize: 30 }
        };
    };

    handleJoin = (orgID, joinType) => {
        axios.post("https://clubster-backend.herokuapp.com/api/notifications/new", { type: joinType, orgID })
            .then((response) => {
              if(response.status == 201) {
                this.setState({ joinable: false})
              }
            })
            .catch((err) => console.log('couldnt find it', err));
    };

    render() {
        const { president, description, organizationID, _id } = this.state;

        if (!this.state.isLoading) {
            let joins = null;
            if (this.state.joinable) {
                joins = (
                    <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 30, alignSelf: 'center', justifyContent: 'space-evenly', width: WIDTH }}>
                        <Button info onPress={() => this.handleJoin(organizationID, JOIN_MEM)}>
                            <Text> Join as member! </Text>
                        </Button>
                        <Button light onPress={() => this.handleJoin(organizationID, JOIN_ADMIN)}>
                            <Text> Join as admin! </Text>
                        </Button>
                    </View>
                );
            }
            return (
              <Container>
                <ScrollView>
                  <TouchableWithoutFeedback >
                      <Thumbnail source={{ uri: this.state.img }} style={{ height: 200, width: WIDTH, borderRadius: 0 }} />
                  </TouchableWithoutFeedback>
                  <InformationCard clubInfo={this.state} />
                  <Gallery clubInfo={this.state} />
                </ScrollView>
                  {joins}
                </Container>
            );
        }
        return null;
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    joinButton: {
        justifyContent: 'center',
        backgroundColor: '#59cbbd',
        height: 60,
        width: WIDTH / 3
    },
    joinButtonDark: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',
        height: 60,
        width: WIDTH / 3
    },
    imageAvatar: {
        width: 200,
        height: 200,
        borderColor: "white",
        borderRadius: 100,
        alignSelf: 'center',
        position: 'relative'
    },
    joinText: {
        fontSize: 24,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
});
