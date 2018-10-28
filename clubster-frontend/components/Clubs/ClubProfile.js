import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from 'react-native';

export default class ClubProfile extends Component {
    render() {
        const { navigation } = this.props;
        const organization = navigation.getParam('item', null);

        return (
            <View style={styles.background}>
            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    }
});