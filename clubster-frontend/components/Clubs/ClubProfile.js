import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from 'react-native';

export default class ClubProfile extends Component {
    render() {
        const { navigation } = this.props;
        const organization = navigation.getParam('item', null);

        return (
            <View style={styles.background}>
                <Text style={{ marginTop: 14, fontSize: 34, alignSelf: 'center', color: 'black' }}> {organization.name} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    }
});