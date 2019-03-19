import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import { DefaultImg } from '../router';

export default class SearchClubs extends PureComponent {
    constructor() {
        super();

        this.state = {
            loading: false,
            error: null,
            allOrganizations: [],
            organizations: [],
            query: ""
        }
    }

    componentWillMount() {
        this.getOrganizations();
    }

    getOrganizations() {
        this.setState({ loading: true });
        axios.get('http://localhost:3000/api/organizations/all')
            .then((response) => {
                this.setState({ organizations: response.data.organizations, allOrganizations: response.data.organizations });
                this.setState({ loading: false });
            });
    }

    handleSearch = text => {
        const formatQuery = text.toLowerCase();
        const data = _.filter(this.state.allOrganizations, org => {
            return org.name.toLowerCase().includes(formatQuery);
        });

        this.setState({ query: text, organizations: data });
    }

    renderHeader = () => {
        return (
            <View style={styles.header}>
                <TouchableOpacity style={{ marginLeft: 14, marginRight: 4, marginTop: 3 }} onPress={() => this.props.navigation.navigate('ClubPage')} >
                    <MaterialIcons name="arrow-back" size={32} color={'black'} />
                </TouchableOpacity>
                <SearchBar
                    containerStyle={{ flex: 1, alignSelf: 'center', backgroundColor: '#03A9F4', borderBottomWidth: 0 }}
                    clearIcon
                    placeholder="Search Clubs"
                    lightTheme
                    round
                    onChangeText={this.handleSearch}
                    autoCorrect={false}
                />
            </View>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '90%',
                    backgroundColor: '#CED0CE',
                    marginLeft: '10%'
                }}
            />
        );
    }

    _renderItem = ({ item }) => {
        let url = (item.image ? 'https://s3.amazonaws.com/clubster-123/' + item.image : DefaultImg);
        return (
            <ListItem avatar onPress={() => this.props.navigation.navigate('ClubProfile', { _id: item._id, name: item.name })}>
                <Left>
                    <Thumbnail source={{ uri: url }} />
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                    <Text note>{item.description}</Text>
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
            <FlatList
                data={this.state.organizations.slice(0, 40)}
                renderItem={this._renderItem}
                keyExtractor={organization => organization.name}
                ListHeaderComponent={this.renderHeader}
                ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={this.renderFooter}
                refreshing={this.state.loading}
                onRefresh={() => this.getOrganizations()}
            />
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D6D6D6',
        backgroundColor: '#03A9F4'
    }
});
