import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, Dimensions, ScrollView } from 'react-native';
import { Content, Button, Text, Thumbnail } from 'native-base';
import axios from 'axios';
import { awsLink } from '../../keys/keys';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
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
            <View style={{ flexDirection: 'row', height: HEIGHT/10, margin: 5, padding: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity>
                    {item.idOfSender.image
                    ?<Thumbnail source={{ uri: awsLink + item.idOfSender.image }}>
                    </Thumbnail>
                    :<Thumbnail source={{ uri: this.state.img }}></Thumbnail>
                    }
                </TouchableOpacity>
                <View style={{ width: WIDTH/2, alignItems: 'center', marginLeft:4, marginRight:4 }}>
                    <Text 
                    style={{ fontSize: 16, textAlign: 'left' }}>
                        {item.message} 
                     </Text>
                </View>
                </View>
                {this._renderButtons(item)}
            </View>
        );
    }

    _renderButtons = (item) => {
        if (item.isActive) {
            return (
                <View style={{ flexDirection: 'column', justifyContent:'space-between' }}>
                    <Button small light style={styles.buttonStyle}
                    onPress={() => this.handleAccept(item)}>
                        <Text>Accept</Text>
                    </Button>
                    <Button small danger style={styles.buttonStyle}
                    onPress={() => this.handleReject(item)}>
                        <Text style={{color: '#fff'}}>Reject</Text>
                    </Button>
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
                console.log('response', response.status)
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
                style={{ height: 1, width: '100%', backgroundColor: '#3498db' }}>
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={styles.notificationPage}>
                <FlatList
                    data={this.state.notifications.reverse().slice(0, 20)}
                    renderItem={this._renderItem}
                    keyExtractor={(item) => item._id}
                    ItemSeparatorComponent={this.renderSeparator}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._getNotifications()}
                />
            </ScrollView>
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
    buttonStyle: {
        width: WIDTH / 4,
        justifyContent: 'center'
    }
});
