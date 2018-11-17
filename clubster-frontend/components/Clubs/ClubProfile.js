import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from 'react-native';
import axios from 'axios';

const { width: WIDTH } = Dimensions.get('window');

export default class ClubProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            joinable: true
        }
    }

    componentDidMount() {
        //get the user logged in and check if this club is joinable or not
    }

    static navigationOptions = ({ navigation }) => {
        const { name } = navigation.getParam('item', null);

        return {
            title: name,
            headerTitleStyle: {flex: 1, textAlign: 'center', alignSelf: 'center', fontWeight: '500', fontSize: 30}
        };
    };

    handleJoin = (organization) => {
        axios.post("http://localhost:3000/api/notifications/new", { type: "ORG_JOIN", organization })
        .then()
        .catch((err) => console.log('couldnt find it', err));
    };

    render() {
        const { navigation } = this.props;
        const organization = navigation.getParam('item', null);

        return (
            <View style={styles.background}>
                <Text style={{ textAlign: 'center', marginTop: 20 }}> 
                    President: {organization.president} 
                </Text>
                <Text style={{ textAlign: 'center', marginLeft: WIDTH / 10, marginRight: WIDTH / 10, marginTop: 20 }}> 
                    Description: {organization.description} 
                </Text>
                <TouchableOpacity onPress={() => this.handleJoin(organization)} style={styles.joinButton} >
                    <Text style={{ fontSize: 24, fontWeight: '500', color: 'white', textAlign: 'center', textAlignVertical: 'center' }}> Join! </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    joinButton: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#59cbbd',
        height: 60,
        width: WIDTH / 3
    }
});