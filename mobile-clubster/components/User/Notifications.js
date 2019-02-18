import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, Dimensions, Image } from 'react-native'
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
            notifications: [],
            refreshing: false,
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC',
        };
    }

    componentDidMount() {
        this._getNotifications();
    }

    _getNotifications() {
        this.setState({ refreshing: true });
        axios.get("http://localhost:3000/api/notifications").then((response) => {
            this.setState({ notifications: response.data.notifications, refreshing: false }); // Setting up state variable
        }).catch((err) => console.log(err));
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', height: 100  }}>
                <TouchableOpacity style={styles.avatar}>
                    <Image style={styles.imageAvatar} source={{ uri: this.state.img }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignSelf: 'stretch', width: (item.isActive ? itemWidth : WIDTH), alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, textAlignVertical: 'center', textAlign: 'left' }}> {item.message} </Text>
                </View>
                {this._renderButtons(item)}
            </View>
        );
    }

    _renderButtons = (item) => {
        if (item.isActive) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
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
            { _id: item._id, orgID: item.idOfOrganization, joinerID: item.idOfSender, joinType, accepted: true })
            .then((res) => {
                if (res.status == 201)
                    item.isActive = false;
            }).catch((err) => console.log(err));

        const acceptType = (joinType == "ORG_JOIN_ADMIN" ? ACCEPT_ADMIN : ACCEPT_MEM);
        axios.post('http://localhost:3000/api/notifications/new',
            { type: acceptType, orgID: item.idOfOrganization, receiverID: item.idOfSender })
            .then((res) => {
                if (res.status == 201)
                    this._getNotifications();
            });
    }

    handleReject = (item) => {
        axios.post('http://localhost:3000/api/notifications/joinOrganization',
            { _id: item._id, accepted: false })
            .then((res) => {
                if (res.status == 201)
                    item.isActive = false;
            }).catch((err) => console.log(err));

        axios.post('http://localhost:3000/api/notifications/new',
            { type: REJECT_JOIN, orgID: item.idOfOrganization, receiverID: item.idOfSender })
            .then((res) => {
                if (res.status == 201)
                    this._getNotifications();
            });
    }

    // separates one list item from the other with a line
    renderSeparator = () => {
        return (
            <View
                style={{ height: 1, width: '100%', backgroundColor: '#338293' }}>
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
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._getNotifications()}
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
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        width: 65,
        height: 30,
        backgroundColor: '#338293',
        alignSelf: 'center',
    },
    acceptRejectText: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 6,
        marginBottom: 6,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 14,
        color: '#fff'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "white",
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
        marginRight: 10,
        marginBottom: 10
    },
    imageAvatar: {
        width: 50,
        height: 50,
        borderColor: "white",
        borderRadius: 50,
        alignSelf: 'center',
        position: 'relative'
    }
});
