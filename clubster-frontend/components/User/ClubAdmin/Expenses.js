import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import axios from 'axios';

export default class Expenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expenses: [
                {
                    "_id": "1",
                    "event": "Movie Night",
                    "amount": "$150"
                },

                {
                    "_id": "2",
                    "event": "Study Slam",
                    "amount": "$250"
                },

                {
                    "_id": "3",
                    "event": "Knitting Day",
                    "amount": "$100"
                },

                {
                    "_id": "4",
                    "event": "Thanksgiving",
                    "amount": "$500"
                },

                {
                    "_id": "5",
                    "event": "Election Day",
                    "amount": "$140"
                }

            ],
        }
    }
    _renderItem = ({ item }) => {
        return (
            // <TouchableOpacity style={{  }}
            //     onPress={() => }>
                <View style={styles.expense}>
                    <Text style={{ fontSize: 20, color: 'blue'}}>
                        {item.event}
                    </Text>
                    <Text style={{ fontSize: 20, color: 'blue'}}>
                        {item.amount}
                    </Text>
                </View>

            // </TouchableOpacity>
        );
    }

    renderSeparator = () => {
        return (
          <View
            style={{ height: 1, width: '100%', backgroundColor: 'black' }}>    
          </View>
        )
      }

    componentDidMount() {
        // const { screenProps } = this.props;
        // console.log(screenProps._id);
        // axios.get("http://localhost:3000/api/organizations/${screenProps._id}").then((response) => {
        //     this.setState({ expenses: response.data.expenses }); // Setting up state variable
        // }).catch((err) => console.log(err));
    }

    render() {
        return (
            <View style={styles.expensesPage}>
                
                    <FlatList
                        data={this.state.expenses}
                        renderItem={this._renderItem}
                        keyExtractor={(expense) => expense._id}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    expense: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'lightgrey',
        paddingVertical: 15,
        paddingHorizontal: 5,
        justifyContent: 'space-between'
    }, 

    expensesPage: {
        marginTop: 30,
        marginHorizontal: 5,
        marginBottom: 5
    }
});
