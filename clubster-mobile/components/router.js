import React from 'react';
import { createMaterialTopTabNavigator, createSwitchNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import Login from './Login/Login';
import SignUp from './Login/SignUp';

import ShowClubs from './Clubs/ShowClubs';
import CreateClub from './Clubs/CreateClub';
import ClubSearch from './Clubs/ClubSearch';
import ClubProfile from './Clubs/ClubProfile';

import Notifications from './User/Notifications';
import Profile from './User/Profile';
import AgendaScreen from './User/AgendaScreen';

import ShowEvents from './Events/ShowEvents';
import CreateEvent from './Events/CreateEvent';
import EventProfile from './Events/EventProfile';
import Comments from './Events/EventsCards/Comments';

import Dashboard from './Clubs/ClubBoard/Settings';
import Chat from './Clubs/ClubBoard/Chat';
import Graphs from './Graphs/Graphs';

export const ClubEventNavigator = createStackNavigator(
    {
        ShowEvents: { screen: ShowEvents, navigationOptions: { header: null } },
        CreateEvent: { screen: CreateEvent },
        EventProfile: { screen: EventProfile },
        Comments: { screen: Comments }
    },
    {
        initialRouteName: 'ShowEvents'
    }
)

export const AdminNavigator = createMaterialTopTabNavigator(
    {
        ClubEvents: {
            screen: ClubEventNavigator,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialIcons name='event' size={25} color={tintColor} />
                ),
                header: null
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
        Graphs: {
            screen: Graphs,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Octicons name='graph' size={27} color={tintColor} />
                ),
            }
        }
    },
    {
        initialRouteName: 'ClubEvents',
        swipeEnabled: true,
        animationEnabled: true,
        tabBarPosition: 'bottom',
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            showIcon: true,
            showLabel: false
        }
    }
);

export const MemberNavigator = createMaterialTopTabNavigator(
    {
        ClubEvents: {
            screen: ClubEventNavigator,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialIcons name="event" size={27} color={tintColor} />
                ),
            }
        },
        Dashboard: {
            screen: Dashboard,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name='information-variant' size={27} color={tintColor} />
                )
            }
        }
    },
    {
        initialRouteName: 'ClubEvents',
        swipeEnabled: true,
        animationEnabled: true,
        tabBarPosition: 'bottom',
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            showIcon: true,
            showLabel: false
        }
    }
);

export const ClubPageNavigator = createStackNavigator(
    {
        ShowClubs: { screen: ShowClubs },
        CreateClub: { screen: CreateClub },
        ClubSearch: { screen: ClubSearch },
        ClubProfile: { screen: ClubProfile }
    },
    {
        initialRouteName: 'ShowClubs'
    }
)

export const HomeNavigator = createMaterialTopTabNavigator(
    {   
        AgendaScreen: {
            screen: AgendaScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name={'calendar-today'} size={25} color={tintColor} />
                )
            }
        },
        Notifications: {
            screen: Notifications,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <MaterialIcons name={focused ? 'notifications' : 'notifications-none'} size={25} color={tintColor} />
                )
            }
        },
        ClubsNavigation: {
            screen: ClubPageNavigator,
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
        initialRouteName: 'ClubsNavigation',
        swipeEnabled: true,
        animationEnabled: true,
        tabBarPosition: 'bottom',
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            showIcon: true,
            showLabel: false
        }
    }
);

export const ClubsterNavigator = createStackNavigator(
    {
        HomeNavigation: { screen: HomeNavigator, navigationOptions: { header: null } },
        AdminNavigation: { screen: AdminNavigator },
        MemberNavigation: { screen: MemberNavigator }
    }
)

export const LoginNavigator = createSwitchNavigator(
    {
        Login: { screen: Login },
        SignUp: { screen: SignUp },
        ClubsterNavigation: { screen: ClubsterNavigator }
    }
);

const App = createAppContainer(LoginNavigator);
export default App;
