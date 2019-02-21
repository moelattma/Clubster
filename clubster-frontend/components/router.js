import React from 'react';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Login from './Login/Login';
import SignUp from './Login/SignUp';
import ClubsterNavigation from './User/ClubsterNavigation';

import HomeNavigation from './Login/HomeNavigation';
import AdminMemNavigation from './User/ClubBoard/AdminMemNavigation';

import Notifications from './User/Notifications';
import ClubsNavigation from './Clubs/ClubsNavigation';
import Profile from './User/Profile';

import ClubPage from './Clubs/ClubPage';
import ClubSearch from './Clubs/ClubSearch';
import ClubProfile from './Clubs/ClubProfile';

import Dashboard from './User/ClubBoard/Settings';
import ClubEvents from './User/ClubBoard/ClubEvents';
import Chat from './User/ClubBoard/Chat';
import MemberList from './User/ClubBoard/MembersList';

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
        AdminMemNavigation: { screen: AdminMemNavigation }
    },
    {
        navigationOptions: {
            headerBackImage: (<MaterialIcons name="arrow-back" size={32} color={'black'} />)
        }
    }
)

export const HomeNavigator = createMaterialBottomTabNavigator(
    {
        Notifications: {
            screen: Notifications,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <MaterialIcons name={focused ? 'notifications' : 'notifications-none'} size={25} color={tintColor} />
                )
            }
        },
        ClubsNavigation: {
            screen: ClubsNavigation,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={focused ? 27 : 25} color={tintColor} />
                )
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <MaterialIcons name={focused ? 'person' : 'person-outline'} size={25} color={tintColor} />
                )
            }
        }
    },

    {
        shifting: true,
        labeled: false,
        swipeEnabled: true,
        animationEnabled: true,
        activeTintColor: '#59cbbd',
        inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
        initialRouteName: 'ClubsNavigation',
        backBehavior: 'initialRoute',
        barStyle: {
            backgroundColor: 'white',
            borderStartColor: 'grey',
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

export const AdminNavigator = createMaterialBottomTabNavigator(
    {
        ClubEvents: {
            screen: ClubEvents,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialIcons name='event' size={25} color={tintColor} />
                ),
            }
        },
        Chat: {
            screen: Chat,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name='wechat' size={25} color={tintColor} />
                ),
            }
        },
        Dashboard: {
            screen: Dashboard,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name='information-variant' size={25} color={tintColor} />
                ),
            }
        },
    },
    {
        shifting: true,
        labeled: false,
        swipeEnabled: true,
        animationEnabled: false,
        activeTintColor: '#59cbbd',
        inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
        initialRouteName: 'ClubEvents',
        backBehavior: 'initialRoute',
        barStyle: {
            backgroundColor: 'white',
            borderStartColor: 'grey',
        }
    }
);

export const MemberNavigator = createMaterialBottomTabNavigator(
    {
        ClubEvents: {
            screen: ClubEvents,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialIcons name="event" size={25} color={tintColor} />
                ),
            }
        },
        Dashboard: {
            screen: Dashboard,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome name="home" size={25} color={tintColor} />
                )
            }
        }
    },
    {
        shifting: true,
        labeled: false,
        swipeEnabled: true,
        animationEnabled: true,
        activeTintColor: '#59cbbd',
        inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
        initialRouteName: 'ClubEvents',
        backBehavior: 'initialRoute',
        barStyle: {
            backgroundColor: 'white',
            borderStartColor: 'grey',
        }
    }
)
