import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, ScrollView, Image } from 'react-native';
import axios from 'axios';

export default class Expenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expenses: [{
                eventName: 'Ice Cream Social',
                cost: '$299',
                _id: '1',
                date: 'Nov 28',
                location: 'Penny Ice Cream'
            },
            {
                eventName: 'MiniGolf',
                cost: '$99',
                _id: '2',
                date: 'Dec 12',
                location: 'Location not disclosed yet'
            }

            ]

        }
    }
    _renderItem = ({ item }) => {
        console.log(item);
        return (
            // <TouchableOpacity style={{  }}
            //     onPress={() => }>
            <ScrollView>

                <View>
                    <View style={styles.expense}>

                        <View style={{flex: .25}}>
                            <Image style={{ height: 125, width: 125 }} source={require('../images/ice.png')} />
                        </View>

                        <View style={{flex: .5}}>
                            <Text style={styles.eName}>
                                {item.eventName}
                            </Text>
                            <Text style={{marginLeft: 30}}>{item.date}</Text>
                            <Text style={{marginLeft: 30}}>{item.location}</Text>
                        </View>

                        <View style={{flex: .25, alignItems: 'flex-end'}}>
                            <Text style={styles.eCost}>
                                {item.cost}
                            </Text>
                        </View>

                    </View>

                </View>

            </ScrollView>

            // </TouchableOpacity>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{ height: 1, width: '100%', backgroundColor: 'grey' }}>
            </View>
        )
    }

    componentWillMount() {
        console.log('hi ', this.state.expenses);

    }


    render() {
        console.log('hi ', this.state.expenses);
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
       // flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 13,
        //paddingHorizontal: 5,
        justifyContent: 'space-between'
    },

    expensesPage: {
        marginTop: 30,
        marginHorizontal: 5,
        marginBottom: 5,
       // backgroundColor: 'pink'
    },
    eName: {
    //  flex: 1,
       marginLeft: 30,
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        justifyContent: 'center'

    },
    eCost: {
      //  flex: 1,
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        marginTop: 100

    },
    // eImage: {
    //     flex: .33,

    //     width: 110,
    //     height: 110,
    //     zIndex: 20,
    //     alignItems: 'flex-start',
    //     justifyContent: 'center',
    //     position: 'absolute',
    //     marginTop: 10,

    // }
});


