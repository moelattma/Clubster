import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, List } from 'react-native';
import axios from 'axios';

export default class Expenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expenses: [],
        }
    }
    _renderItem = ({ item }) => {
        return (
            // <TouchableOpacity style={{  }}
            //     onPress={() => }>
                <View style={{ flex: 1, justifyContent: 'center', marginLeft: 5 }}>
                    <Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
                        {item.eventName}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'red' }}>
                        {item.eventCost}
                    </Text>
                </View>

            // </TouchableOpacity>
        );
    }

    renderSeparator = () => {
        return (
          <View
            style={{ height: 1, width: '100%', backgroundColor: 'pink' }}>    
          </View>
        )
      }

    componentDidMount() {
        const { screenProps } = this.props;
        console.log(screenProps._id);
        axios.get("http://localhost:3000/api/organizations/${screenProps._id}").then((response) => {
            this.setState({ expenses: response.data.expenses }); // Setting up state variable
        }).catch((err) => console.log(err));
    }

    render() {
        return (
            <View>
                
                    <FlatList
                        data={this.state.expenses}
                        renderItem={this._renderItem}
                        keyExtractor={(expense) => expense._id}
                        
                        itemSep = {this.renderSeparator}
                    />
                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingTop: 25,
        backgroundColor: '#36485f',
        alignItems: 'stretch',
    },

    header: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35,
        fontStyle: 'italic',
        alignSelf: 'center',
    },

    notification: {
        flex: 1,
        backgroundColor: '#36485f'
    },

    notificationText: {
        alignSelf: 'center'
    }
});
