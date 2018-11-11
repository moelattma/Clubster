import React from 'react'
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Login from './Login/Login';
import SignUp from './Login/SignUp';
import ClubsterNavigation from './User/ClubsterNavigation'

import HomeNavigation from './Login/HomeNavigation';
import AdminNavigation from './User/ClubAdmin/AdminNavigation'

import Notifications from './User/Notifications'
import ClubsNavigation from "./Clubs/ClubsNavigation"
import Profile from './User/Profile'

import ClubPage from './Clubs/ClubPage'
import ClubSearch from './Clubs/ClubSearch'
import ClubProfile from './Clubs/ClubProfile'

import Dashboard from './User/ClubAdmin/Dashboard'
import ClubEvents from './User/ClubAdmin/ClubEvents'
import Expenses from './User/ClubAdmin/Expenses'
import MemberList from './User/ClubAdmin/MembersList'
import Chat from './User/ClubAdmin/Chat'

export const LoginNavigator = createSwitchNavigator(
    {
        Login: { screen: Login },
        SignUp: { screen: SignUp },
        ClubsterNavigation: { screen: ClubsterNavigation }
    }
);

export const ClubsterNavigator = createStackNavigator(
    {
        HomeNavigation: { screen: HomeNavigation, navigationOptions: { header: null } },
        AdminNavigation: { screen: AdminNavigation }
    },
    {
        navigationOptions: {
            headerBackImage: (<MaterialIcons name="arrow-back" size={32} color={'black'} />)
        }
    }
)

export const HomeNavigator = createBottomTabNavigator(
    {
        Notifications: {
            screen: Notifications,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="ios-notifications" size={42} color={tintColor} />
                )
            }
        },
        ClubsNavigation: {
            screen: ClubsNavigation,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name="home-assistant" size={48} color={tintColor} />
                )
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="ios-person" size={44} color={tintColor} />
                )
            }
        }
    },

    {
        animationEnabled: true,
        swipeEnabled: true,
        initialRouteName: "ClubsNavigation",
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeBackgroundColor: '#E2E3E5',
            inactiveBackgroundColor: '#E2E3E5',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            activeTintColor: '#1F629F',
            showLabel: false,
            showIcon: true
        }
    }
);

export const ClubsNavigator = createStackNavigator(
    {
        ClubPage: { screen: ClubPage },
        ClubSearch: { screen: ClubSearch, navigationOptions: { header: null } },
        ClubProfile: { screen: ClubProfile }
    },
    {
        initialRouteName: 'ClubPage',
        navigationOptions: {
            headerBackImage: (<MaterialIcons name="arrow-back" size={32} color={'black'} />),
        }
    }
);

export const AdminNavigator = createBottomTabNavigator(
    {
        Dashboard: {
            screen: Dashboard,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome name="home" size={42} color={tintColor} />
                )
            }
        },
        ClubEvents: {
            screen: ClubEvents,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialIcons name="event" size={40} color={tintColor} />
                ),
            }
        },
        Expenses: {
            screen: Expenses,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome name="money" size={38} color={tintColor} />
                )
            }
        },
        MemberList: {
            screen: MemberList,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="ios-people" size={46} color={tintColor} />
                )
            }
        },
        Chat: {
            screen: Chat,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome name="wechat" size={38} color={tintColor} />
                )
            }
        }
    },
    {
        initialRouteName: 'Dashboard',
        animationEnabled: true,
        swipeEnabled: true,
        tabBarOptions: {
            activeBackgroundColor: '#E2E3E5',
            inactiveBackgroundColor: '#E2E3E5',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            activeTintColor: '#1F629F',
            showLabel: false,
            showIcon: true
        }
    }
);