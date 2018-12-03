import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList, ScrollView, Image } from 'react-native';
import axios from 'axios';
import converter from 'base64-arraybuffer';

export default class Expenses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            loading: false
        }
    }

    componentWillMount() {
        this.getExpenses()
    }

    getExpenses = () => {
      const { _id } = this.props.screenProps;
      this.setState({ loading: true })
      axios.get(`http://localhost:3000/api/${_id}/expenses`).then((response) => {
        if(response.status == 201)
          this.setState({expenses: response.data.expenses});
      }).catch((err) => console.log(err));
      this.setState({ loading: false })
    }

    _renderItem = ({ item }) => {
      var url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
      if(item.idOfEvent.image.img) {
        url = 'data:image/jpeg;base64,' + converter.encode(item.idOfEvent.image.img.data.data);
      } else {
        url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';
      }
      var num =  Number.parseFloat(item.amount).toFixed(2);
      var date = item.time.substring(0, item.time.indexOf("T")); ;
      return (
            <ScrollView>
                <View>
                    <View style={styles.expense}>
                        <View style={{flex: .25}}>
                            <Image style={{ height: 125, width: 125 }} source={{uri:url}} />
                        </View>
                        <View style={{flex: .5}}>
                            <Text style={styles.eName}>
                                {item.idOfEvent.name}
                            </Text>
                            <Text style={{marginLeft: 30}}>{date}</Text>
                        </View>
                        <View style={{flex: .25, alignItems: 'flex-end'}}>
                            <Text style={styles.eCost}>
                                {num}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{ height: 1, width: '100%', backgroundColor: 'grey' }}>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.expensesPage}>
            <FlatList
                data={this.state.expenses}
                renderItem={this._renderItem}
                keyExtractor={expense => expense._id}
                ItemSeparatorComponent={this.renderSeparator}
                refreshing={this.state.loading}
                onRefresh={() => this.getExpenses()}
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
