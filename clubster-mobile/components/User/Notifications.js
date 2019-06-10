import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Button, Text, Thumbnail } from 'native-base';
import { connect } from 'react-redux'
import axios from 'axios';
import { awsLink } from '../../keys/keys';
import { DefaultImg } from '../Utils/Defaults';
import { USER_NOTIFICATIONSSET, USER_NOTIFICATIONSDEL } from '../../reducers/ActionTypes';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const itemWidth = WIDTH * 13 / 20;

const ACCEPT_ADMIN = "ACCEPT_ADMIN";
const ACCEPT_MEM = "ACCEPT_MEMBER";
const REJECT_JOIN = "REJECT_JOIN";

export class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: true,
        };
    }

    componentDidMount() {
        this._getNotifications();
    }

    _getNotifications() {
        this.setState({ refreshing: true });
        axios.get("https://clubster-backend.herokuapp.com/api/notifications").then((response) => {
            this.props.setNotifications(response.data.notifications);
            this.setState({ refreshing: false }); // Setting up state variable
        }).catch((err) => console.log(err));
    }

    _renderItem = ({ item }) => {
        const { image } = item.idOfSender;
        return (
            <View style={{ flexDirection: 'row', height: HEIGHT / 10, margin: 5, padding: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                        <Thumbnail source={{ uri: (!image || image == null ? DefaultImg : awsLink + image) }} />
                    </TouchableOpacity>
                    <View style={{ width: WIDTH / 2, alignItems: 'center', marginLeft: 4, marginRight: 4 }}>
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
        if (item.type === 'ORG_JOIN_ADMIN' || item.type === 'ORG_JOIN_MEMBER' || item.type == 'EVENT_JOIN_REQ') {
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
        return (
            <View style={{ flexDirection: 'column', justifyContent:'space-between' }}>
                <Button small light style={styles.buttonStyle}
                    onPress={() => this.handleOkay(item)}>
                    <Text>Okay</Text>
                </Button>
            </View>
        );
    }

    handleAccept = (item) => {
        console.log(item);
        if (item.type == 'EVENT_JOIN_REQ') {
            axios.post('https://clubster-backend.herokuapp.com/api/notifications/new',
                { type: 'EVENT_JOIN_ACC', orgID: item.idOfOrganization, receiverID: item.idOfSender, notID: item._id, clubEvent: { name: item.clubEvent.name, _id: item.clubEvent._id } }).then((res) => {
                    if (res.status == 201) {
                        axios.post('https://clubster-backend.herokuapp.com/api/notifications/delete', { _id: item._id }).then((res) => { 
                            if (res.status == 201) this.props.deleteNotification(item._id);
                        });
                    }
                });
        } else {
            const joinType = (item.message.includes("admin") ? "ORG_JOIN_ADMIN" : "ORG_JOIN_MEMBER");
            axios.post('https://clubster-backend.herokuapp.com/api/notifications/joinOrganization',
                { _id: item._id, orgID: item.idOfOrganization, joinerID: item.idOfSender, joinType, accepted: true })
                .then((res) => {
                    if (res.status == 201)
                        this.props.deleteNotification(item._id);
                }).catch((err) => console.log(err));

            const acceptType = (joinType == "ORG_JOIN_ADMIN" ? ACCEPT_ADMIN : ACCEPT_MEM);
            axios.post('https://clubster-backend.herokuapp.com/api/notifications/new',
                { type: acceptType, orgID: item.idOfOrganization, receiverID: item.idOfSender });
        }
    }

    handleReject = (item) => {
        if (item.type == 'EVENT_JOIN_REQ') {
            this.handleOkay(item);
        } else {
            axios.post('https://clubster-backend.herokuapp.com/api/notifications/joinOrganization',
                { _id: item._id, accepted: false })
                .then((res) => {
                    if (res.status == 201)
                        this.props.deleteNotification(item._id);
                }).catch((err) => console.log(err));

            axios.post('https://clubster-backend.herokuapp.com/api/notifications/new',
                { type: REJECT_JOIN, orgID: item.idOfOrganization, receiverID: item.idOfSender });
        }
    }

    handleOkay = (item) => {
        axios.post('https://clubster-backend.herokuapp.com/api/notifications/delete', { _id: item._id }).then((res) => { 
            if (res.status == 201) this.props.deleteNotification(item._id);
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
            <ScrollView style={styles.notificationPage} refreshControl={<RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._getNotifications()}
              />}>
                {
                    this.props.notifications && this.props.notifications.length > 0?
                        <FlatList
                            data={this.props.notifications.slice(0, 20)}
                            renderItem={this._renderItem}
                            keyExtractor={(item) => item._id}
                            ItemSeparatorComponent={this.renderSeparator}
                            extraData={this.props.rando}
                        />
                    :
                        <Text style={[{ flex: 1 }, styles.noneText]}>Your inbox is empty!</Text>
                }
                
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return { notifications: state.user.notifications, rando: Math.random(1) };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setNotifications: (notifications) => dispatch({
            type: USER_NOTIFICATIONSSET,
            payload: { notifications }
        }),
        deleteNotification: (notID) => dispatch({
            type: USER_NOTIFICATIONSDEL,
            payload: { notID }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

const styles = StyleSheet.create({
    notification: {
        flex: 1,
        backgroundColor: 'lightgrey',
        paddingVertical: 15,
        paddingHorizontal: 5
    },
    notificationPage: {
        marginTop: 5,
        marginHorizontal: 5,
        marginBottom: 5
    },
    buttonStyle: {
        width: WIDTH / 4,
        justifyContent: 'center'
    },
    noneText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 16,
        marginTop: 10
    }
});
