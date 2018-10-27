import React from 'react'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import Login from './Login/Login';
import SignUp from './Login/SignUp';
import HomeNavigation from "./Login/HomeNavigation";
import ClubsPage from './Clubs/ClubsPage'
import Notifications from './Notifications'
import Profile from './Profile'
import SearchClubs from './Clubs/SearchClubs'
import ClubsNavigation from "./Clubs/ClubsNavigation"

export const LoginNavigator = createStackNavigator(
    {
      LoginScreen: { screen: Login },
      SignUp: { screen: SignUp },
      HomeNavigation: {
        screen: HomeNavigation,
        navigationOptions: {
          title: "ClubsPage"
        }
      }
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
                tabBarIcon: ({tintColor}) => (
                    <Icon name="ios-notifications-outline" size={42}/> 
                ),
            }
        },
        ClubsNavigation: { 
            screen: ClubsNavigation,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="ios-people-outline" size={48}/>
                )
            }
        },
        Profile: { 
            screen: Profile,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="ios-person-outline" size={44}/>
                )
            }
        
        }
    },

    {
        animationEnabled: true,
        swipeEnabled: true,
        initialRouteName: "ClubsNavigation",
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
        ClubsPage: { screen: ClubsPage },
        SearchClubs: { screen: SearchClubs }
    },
    {
        initialRouteName: 'ClubsPage',
        headerMode: 'none',
    }
);