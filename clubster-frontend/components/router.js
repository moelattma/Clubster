import React from 'react'
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Login from './Login/Login';
import SignUp from './Login/SignUp';
import HomeNavigation from './Login/HomeNavigation';

import Notifications from './User/Notifications'
import ClubNavigation from "./Clubs/ClubNavigation"
import Profile from './User/Profile'

import ClubPage from './Clubs/ClubPage'
import ClubSearch from './Clubs/ClubSearch'
import ClubProfile from './Clubs/ClubProfile'
import AdminNavigation from './User/ClubAdmin/AdminNavigation'

import Dashboard from './User/ClubAdmin/Dashboard'
import ClubEvents from './User/ClubAdmin/ClubEvents'
import Expenses from './User/ClubAdmin/Expenses'
import MemberList from './User/ClubAdmin/MembersList'
import Chat from './User/ClubAdmin/Chat'

export const LoginNavigator = createSwitchNavigator(
    {
        Login: { screen: Login },
        SignUp: { screen: SignUp },
        HomeNavigation: { screen: HomeNavigation },
        AdminNavigation: { screen: AdminNavigation }
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
                    <Ionicons name="ios-notifications" size={42} color={tintColor} /> 
                )
            }
        },
        ClubNavigation: {
            screen: ClubNavigation,
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
        initialRouteName: "ClubNavigation",
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
                )
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
)