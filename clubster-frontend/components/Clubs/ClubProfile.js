import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions,Image } from 'react-native';
import axios from 'axios';
import converter from 'base64-arraybuffer';

const { width: WIDTH } = Dimensions.get('window');

const JOIN_MEM = "ORG_JOIN_MEMBER";
const JOIN_ADMIN = "ORG_JOIN_ADMIN";

export default class ClubProfile extends Component {
    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const orgID = navigation.getParam('item', null)._id;

        this.state = {
            organizationID: orgID,
            isLoading: true,
            joinable: false,
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
            noteStatus: true
        }
    }

    componentWillMount() {
        axios.post("http://localhost:3000/api/organizations/isMember", { orgID: this.state.organizationID }).then((response) => {
            this.setState({ joinable: (!response.data.isMember), noteStatus: response.data.noteStatus });
            if(response.data.organization.imageId) {
                this.setState({img: 'data:image/jpeg;base64,' + converter.encode(response.data.organization.imageId.img.data.data)});
            }
        });
        this.setState({ isLoading: false });
    }

    static navigationOptions = ({ navigation }) => {
        const { name } = navigation.getParam('item', null);

        return {
            title: name,
            headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center', fontWeight: '500', fontSize: 30 }
        };
    };

    handleJoin = (organization, joinType) => {
        axios.post("http://localhost:3000/api/notifications/new", { type: joinType, organization })
            .then((response) => {
              if(response.status == 201) {
                this.setState({ joinable: false})
              }
            })
            .catch((err) => console.log('couldnt find it', err));
    };

    render() {
        const { navigation } = this.props;
        const organization = navigation.getParam('item', null);

        if (!this.state.isLoading) {
            let joins = null;
            if (this.state.joinable) {
                joins = (
                    <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center', justifyContent: 'space-evenly', width: WIDTH }}>
                        <TouchableOpacity onPress={() => this.handleJoin(organization, JOIN_MEM)} style={styles.joinButton} >
                            <Text style={styles.joinText}> Join as Member! </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.handleJoin(organization, JOIN_ADMIN)} style={styles.joinButton} >
                            <Text style={styles.joinText}> Join as Admin! </Text>
                        </TouchableOpacity>
                    </View>
                );
            }
            return (
                <View style={styles.background}>
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        President: {organization.president}
                    </Text>
                    <Text style={{ textAlign: 'center', marginLeft: WIDTH / 10, marginRight: WIDTH / 10, marginTop: 20 }}>
                        Purpose: {organization.purpose}
                    </Text>
                    <Text style={{ textAlign: 'center', marginLeft: WIDTH / 10, marginRight: WIDTH / 10, marginTop: 20 }}>
                        Description: {organization.description}
                    </Text>
                    <Image style={styles.imageAvatar} source={{ uri: this.state.img }} />
                    {joins}
                </View>
            );
        }
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
