import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, Button } from 'react-native'
import axios from 'axios';
export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
    }

    componentDidMount() {
        axios.get("http://localhost:3000/api/notifications").then((response) => {
            this.setState({ notifications: response.data.notifications }); // Setting up state variable
            console.log(this.state.notifications);
        }).catch((err) => console.log(err));
    }

    _renderItem = ({ item }) => {
        var message = "";
        console.log(item);
        switch (item.type) {
            case "ORG_JOIN":
                message = `${item.idOfSender.name} wants to join ${item.idOfOrganization.name}`;
                break;
        }
        return (
            <View style = {{ flex: 1, flexDirection: 'row' }}> 
                <Text> {message} </Text>
                {(item.type=="ORG_JOIN") ? <Button title="Accept" /> : null} 
            </View>
        );
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
        console.log(this.state.notifications);
        return (
            <View style={[styles.notificationPage]}>
                <FlatList
                    data={this.state.notifications}
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
    }
});
