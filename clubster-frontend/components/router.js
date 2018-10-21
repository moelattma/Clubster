import React from 'react'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import Login from './Login';
import SignUp from './SignUp';
import UserHome from "./UserHome";
import ClubsPage from './ClubsPage'
import Notifications from './Notifications'
import Profile from './Profile'

export const LoginNavigator = createStackNavigator(
    {
      LoginScreen: { screen: Login },
      SignUp: { screen: SignUp },
      UserHome: {
        screen: UserHome,
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
        ClubsPage: { 
            screen: ClubsPage,
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
        initialRouteName: "ClubsPage",
        tabBarOptions: {
            activeBackgroundColor: '#36485f', 
            inactiveBackgroundColor: '#36485f', 
            activeTintColor: '#36485f', 
            showLabel: false, 
            showIcon: true
        }
    }
);