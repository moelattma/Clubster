import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SearchBar, Header } from 'react-native-elements';
import { connect } from 'react-redux'
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import { OptimizedFlatList } from 'react-native-optimized-flatlist';
import { ListItem, Left, Body, Thumbnail, Text } from 'native-base';
import { DefaultImg } from '../Utils/Defaults';

export class Channels extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            channels: [{
              _id: "5576529818",
              name: "Dawah in the Quarry"
            },{
              _id: "4929569619",
              name: "Adnan Grad. Party"
            }],
            loading: false
        }
    }

    componentWillMount() {
        this.getChannels();
    }

    getChannels() {
       return;
    }

    _renderItem = ({ item }) => {
        let url = (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg);
        return (
            <ListItem avatar onPress={() => this.props.navigation.navigate('ChannelChat', { _id: item._id, name: item.name })}>
                <Left>
                    <Thumbnail source={{ uri: url }} />
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
            </ListItem>
        );
    }

    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
            <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CED0CE' }}>
                <ActivityIndicator animating size="large" />
            </View>
        );
    }

    render() {
        return (
          <ScrollView>
            <Header
              backgroundColor={'transparent'}
              leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.navigate('HomeNavigation') }}
              centerComponent={{ text: 'Channels', style: { fontSize: 21, fontWeight: '500' } }}
              rightComponent={this.props.isAdmin ? { icon: 'add', onPress: (() => this.props.navigation.navigate('CreateChannel' )) } : null}
            />
            <OptimizedFlatList
                data={this.state.channels.slice(0, 40)}
                renderItem={this._renderItem}
                keyExtractor={organization => organization._id}
                ListFooterComponent={this.renderFooter}
                refreshing={this.state.loading}
                onRefresh={() => this.getChannels()}
            />
          </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAdmin: state.clubs.club.isAdmin
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, null)(Channels);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D6D6D6',
        backgroundColor: '#03A9F4'
    }
});
