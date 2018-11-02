import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, List, ListItem } from 'react-native'
import axios from 'axios';
export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications:[
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"},
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"},
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"},
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"},
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"},
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"},
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"},
                {"type": "You are now a member of ACM!"},
                {"type": "You are part of this event!"},
                {"type": "You have a ride!"}              
                
            ]
        };
    }

    componentDidMount() {
        // axios.get("http://localhost:3000/api/notifications").then((response) => {
        //     this.setState({notifications: response.data.notifications}); // Setting up state variable
        //     console.log(this.state.notifications);
        // }).catch((err) => console.log(err));
    }

    

    _renderItem = ({item}) => {
        return (
            // <TouchableOpacity style={{  }}
            //     onPress={() => }>
                <View style={[styles.notification]}>
                    <Text style={{ fontSize: 18, color: 'black'}}>
                        {item.type}
                    </Text>
                </View>

            // </TouchableOpacity>
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
        return(
          <View style = {[styles.notificationPage]}>
              <FlatList 
                data = {this.state.notifications}
                renderItem = {this._renderItem}
                keyExtractor={(type) => type._id}
                //keyExtractor={this._keyExtractor}
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
