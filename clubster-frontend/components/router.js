import React from 'react';
import { createMaterialTopTabNavigator, createSwitchNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import Login from './Login/Login';
import SignUp from './Login/SignUp';

import { ShowClubs, CreateClub } from './Clubs/ClubPage';
import ClubSearch from './Clubs/ClubSearch';
import ClubProfile from './Clubs/ClubProfile';
import Notifications from './User/Notifications';
import Profile from './User/Profile';
import AgendaScreen from './User/AgendaScreen';

import ClubEventNavigator from './User/ClubBoard/ClubEvents';
import Dashboard from './User/ClubBoard/Settings';
import ClubEvents from './User/ClubBoard/ClubEvents';
import Chat from './User/ClubBoard/Chat';
import Graphs from './User/ClubBoard/Graphs';

export const AdminNavigator = createMaterialTopTabNavigator(
    {
        ClubEvents: {
            screen: ClubEventNavigator,
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
            screen: ClubEvents,
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
        initialRouteName: 'ShowClubs',
        navigationOptions: {
            headerBackImage: (<MaterialIcons name="arrow-back" size={32} color={'black'} />)
        }
    }
)

export const ClubsterNavigator = createSwitchNavigator(
    {
        HomeNavigation: { screen: ClubPageNavigator, navigationOptions: { header: null } },
        AdminNavigation: { screen: AdminNavigator },
        MemberNavigation: { screen: MemberNavigator }
    },
    {
        initialRouteName: 'HomeNavigation'
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
            screen: ClubsterNavigator,
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

export const LoginNavigator = createSwitchNavigator(
    {
        Login: { screen: Login },
        SignUp: { screen: SignUp },
        ClubsterNavigation: { screen: HomeNavigator }
    }
);

const App = createAppContainer(LoginNavigator);
export default App;

export const DefaultImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC"
