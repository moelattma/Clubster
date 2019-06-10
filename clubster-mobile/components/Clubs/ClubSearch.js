import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SearchBar, Header } from 'react-native-elements';
import _ from 'lodash';
import axios from 'axios';
import { ListItem, Left, Body, Thumbnail, Text } from 'native-base';

import { connect } from 'react-redux';
import { CLUBS_SETALL } from '../../reducers/ActionTypes';
import { DefaultImg } from '../Utils/Defaults';

class SearchClubs extends PureComponent {
    constructor(props) {
        super(props);
        
        props.navigation.setParams({ handleSearch: this.handleSearch, query: "" });

        this.state = {
            loading: false,
            error: null,
            organizations: [],
            query: ""
        }
    }

    componentWillMount() {
        this.getOrganizations();
    }

    getOrganizations() {
        this.setState({ loading: true });
        axios.get('https://clubster-backend.herokuapp.com/api/organizations/all')
            .then((response) => {
                this.setState({ organizations: response.data.organizations, loading: false });
                this.props.setAllClubs(response.data.organizations);
            });
    }

    handleSearch = text => {
        const formatQuery = text.toLowerCase();
        const data = _.filter(this.props.allOrganizations, org => {
            return org.name.toLowerCase().includes(formatQuery);
        });

        this.setState({ query: text, organizations: data });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                    marginTop: 8,
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
                <Body style={{ borderBottomWidth: 0 }}>
                    <Text>{item.name}</Text>
                    <Text note>{item.description}</Text>
                </Body>
            </ListItem>
        );
    }

    render() {
        return (
            <FlatList
                data={this.state.organizations.slice(0, 40)}
                renderItem={this._renderItem}
                keyExtractor={organization => organization._id}
                ItemSeparatorComponent={this.renderSeparator}
                refreshing={this.state.loading}
                onRefresh={() => this.getOrganizations()}
                ListHeaderComponent={
                    <Header
                        backgroundColor={'transparent'}
                        leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.goBack() }}
                        centerComponent={
                            <SearchBar
                            //    containerStyle={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white', borderBottomWidth: 0, justifyContent: 'center', borderTopColor: 'white', width: '0%' }}
                                clearIcon
                                searchIcon={false}
                                placeholder="Search Clubs"
                                inputContainerStyle={{ backgroundColor: '#59cbbd' }}
                                round
                                showLoading={false}
                                onChangeText={(text) => this.handleSearch(text) }
                                value={this.state.query}
                                autoCorrect={false}
                            />
                        }
                        rightComponent={null}
                    />
                }
            />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAllClubs: (allClubs) => dispatch({
            type: CLUBS_SETALL,
            payload: { allClubs }
        })
    }
}

const mapStateToProps = (state) => {
    return {
        allOrganizations: state.clubs.allClubs
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchClubs);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D6D6D6',
        backgroundColor: '#03A9F4'
    }
});
