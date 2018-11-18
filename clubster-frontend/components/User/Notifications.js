import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, Dimensions } from 'react-native'
import axios from 'axios';

const { width: WIDTH } = Dimensions.get('window');
const itemWidth = WIDTH * 13 / 20;

const ACCEPT_ADMIN = "ACCEPT_ADMIN";
const ACCEPT_MEM = "ACCEPT_MEMBER";
const REJECT_JOIN = "REJECT_JOIN";

export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
    }

    componentDidMount() {
        this._getNotifications();
    }

    _getNotifications() {
        axios.get("http://localhost:3000/api/notifications").then((response) => {
            this.setState({ notifications: response.data.notifications }); // Setting up state variable
        }).catch((err) => console.log(err));
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', height: 50, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', width: (item.isActive ? itemWidth : WIDTH), alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, textAlignVertical: 'center', textAlign: 'left' }}> {item.message} </Text>
                </View>
                {this._renderButtons(item)}
            </View>
        );
    }

    _renderButtons = (item) => {
        if (item.isActive) {
            return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={styles.acceptReject} onPress={() => this.handleAccept(item)}>
                        <Text style={styles.acceptRejectText}> Accept </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptReject} onPress={() => this.handleReject(item)}>
                        <Text style={styles.acceptRejectText}> Reject </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    handleAccept = (item) => {
        const joinType = (item.message.includes("admin") ? "ORG_JOIN_ADMIN" : "ORG_JOIN_MEMBER");
        axios.post('http://localhost:3000/api/notifications/joinOrganization',
            { _id: item._id, orgID: item.idOfOrganization._id, joinerID: item.idOfSender, joinType }).then((res) => {
                if (res.status == 201)
                    item.isActive = false;
            }).catch((err) => console.log(err));
        const acceptType = (joinType == "ORG_JOIN_ADMIN" ? ACCEPT_ADMIN : ACCEPT_MEM);
        axios.post('http://localhost:3000/api/notifications/new', { type: acceptType, organization: item.idOfOrganization, receiverID: item.idOfSender }).then((res) => {
            if(res.status == 201) 
                this._getNotifications();
        });
    }

    handleReject = (item) => {
        axios.post('http://localhost:3000/api/notifications/new', { type: REJECT_JOIN, organization: item.idOfOrganization, receiverID: item.idOfSender }).then((res) => {
            if(res.status == 201) 
                this._getNotifications();
        });
    }

    // separates one list item from the other with a line
    renderSeparator = () => {
        return (
            <View
                style={{ height: 1, width: '100%', backgroundColor: 'black' }}>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.notificationPage}>
                <FlatList
                    data={this.state.notifications.reverse().slice(0, 20)}
                    renderItem={this._renderItem}
                    keyExtractor={(item) => item._id}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    notification: {
        flex: 1,
        backgroundColor: 'lightgrey',
        paddingVertical: 15,
        paddingHorizontal: 5
    },
    notificationPage: {
        marginTop: 30,
        marginHorizontal: 5,
        marginBottom: 5
    },
    acceptReject: {
        marginLeft: 10,
        backgroundColor: '#59cbbd',
        alignSelf: 'center'
    },
    acceptRejectText: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 6,
        marginBottom: 6,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 14
    }
});
