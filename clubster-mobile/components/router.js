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

import Channels from './Channels/Channels';
import ChannelChat from './Channels/ChannelChat';
import CreateChannel from './Channels/CreateChannel';

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
        ShowEvents: { screen: ShowEvents },
        CreateEvent: { screen: CreateEvent },
        EventProfile: { screen: EventProfile },
        Comments: { screen: Comments }
    },
    {
        initialRouteName: 'ShowEvents',
        headerMode: 'none'
    }
)

export const ChannelNavigator = createStackNavigator(
    {
        Channels: { screen: Channels, navigationOptions: { header: null } },
        ChannelChat: { screen: ChannelChat },
        CreateChannel: { screen: CreateChannel }
    },
    {
        initialRouteName: 'Channels'
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
        Channels: {
            screen: ChannelNavigator,
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
        animationEnabled: true,
        swipeEnabled: false,
        tabBarPosition: 'bottom',
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            showIcon: true,
            showLabel: false,
            labelStyle: {
                color: 'black',
                backgroundColor: 'white',
                borderColor: 'white',
                shadowColor: 'white',
            },
            tabStyle: {
                backgroundColor: '#59cbbd',
            },
            style: {
                backgroundColor: '#59cbbd',
            }
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
        Channels: {
            screen: Channels,
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
                    <MaterialCommunityIcons name='information-variant' size={27} color={tintColor} />
                )
            }
        }
    },
    {
        initialRouteName: 'ClubEvents',
        swipeEnabled: false,
        animationEnabled: true,
        tabBarPosition: 'bottom',
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            showIcon: true,
            showLabel: false,
            labelStyle: {
                color: 'black',
                backgroundColor: 'white',
                borderColor: 'white',
                shadowColor: 'white',
            },
            tabStyle: {
                backgroundColor: '#59cbbd',
            },
            style: {
                backgroundColor: '#59cbbd',
            }
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
        initialRouteName: 'ShowClubs',
        headerMode: 'none'
    }
)

export const NotesNavigator = createMaterialTopTabNavigator(
    {
        Agenda: {
            screen: AgendaScreen
        },
        Inbox: {
            screen: Notifications
        },
    },
    {
        initialRouteName: 'Agenda',
        swipeEnabled: true,
        animationEnabled: true,
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeTintColor: '#59cbbd',
            inactiveTintColor: 'black',
            tabStyle: {
                backgroundColor: 'white'
            },
            style: {
                backgroundColor: 'white'
            },
        }
    }
)

export const HomeNavigator = createMaterialTopTabNavigator(
    {
        NotesNavigation: {
            screen: NotesNavigator,
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
        swipeEnabled: false,
        animationEnabled: true,
        tabBarPosition: 'bottom',
        backBehavior: 'initialRoute',
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(0, 0, 0, 0.85)',
            showIcon: true,
            showLabel: false,
            labelStyle: {
                color: 'black',
                backgroundColor: 'white',
                borderColor: 'white',
                shadowColor: 'white',
            },
            tabStyle: {
                backgroundColor: '#59cbbd',
            },
            style: {
                backgroundColor: '#59cbbd',
            }
        }
    }
);

export const ClubsterNavigator = createSwitchNavigator(
    {
        HomeNavigation: { screen: HomeNavigator },
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
