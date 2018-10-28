import React from 'react'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import Login from './Login/Login';
import SignUp from './Login/SignUp';
import HomeNavigation from "./Login/HomeNavigation";
import ClubPage from './Clubs/ClubPage'
import Notifications from './Notifications'
import Profile from './Profile'
import ClubSearch from './Clubs/ClubSearch'
import ClubNavigation from "./Clubs/ClubNavigation"
import ClubProfile from './Clubs/ClubProfile'

export const LoginNavigator = createStackNavigator(
    {
        Login: { screen: Login },
        SignUp: { screen: SignUp },
        HomeNavigation: { screen: HomeNavigation }
    },
    {
        headerMode: 'none'
    }
);

export const HomeNavigator = createBottomTabNavigator(
    {
        Notifications: {
            screen: Notifications,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-notifications-outline" size={42} />
                ),
            }
        },
        ClubNavigation: {
            screen: ClubNavigation,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-people-outline" size={48} />
                )
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-person-outline" size={44} />
                )
            }

        }
    },

    {
        animationEnabled: true,
        swipeEnabled: true,
        initialRouteName: "ClubNavigation",
        tabBarOptions: {
            activeBackgroundColor: '#36485f',
            inactiveBackgroundColor: '#36485f',
            activeTintColor: '#36485f',
            showLabel: false,
            showIcon: true
        }
    }
);

export const ClubsterNavigator = createStackNavigator(
    {
        ClubPage: { screen: ClubPage },
        ClubSearch: { screen: ClubSearch },
        ClubProfile: { screen: ClubProfile }
    },
    {
        initialRouteName: 'ClubPage',
        headerMode: 'none',
    }
);