import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import{ DrawerNavigator, StackNavigator, createStackNavigator} from 'react-navigation';

import Settings from './Settings';
import SettingsPhotos from './SettingsPhotos';
import SettingsMembers from './SettingsMembers'

class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render(){
    return(
      <View style ={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
        <Image
          source={require('../../../images/drawer.png')}
          style={{ width: 25, height: 25, marginLeft: 5}}
        />
        </TouchableOpacity>
      </View>
    );
  }
}

const FirstActivity_StackNavigator = createStackNavigator({
  First: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      title: 'About',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const SecondActivity_StackNavigator = createStackNavigator({
  Second: {
    screen: SettingsPhotos,
    navigationOptions: ({ navigation }) => ({
      title: 'Photos',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const ThirdActivity_StackNavigator = createStackNavigator({
  Third: {
    screen: SettingsMembers,
    navigationOptions: ({ navigation }) => ({
      title: 'Members',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const Drawer = DrawerNavigator({

  SettingsPhotos: {
    screen: FirstActivity_StackNavigator,
    navigationOptions: {
      drawerLabel: 'About',
    },
  },

  SettingsAbout: {
    screen: SecondActivity_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Photos',
    },
  },

  SettingsMembers: {
    screen: ThirdActivity_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Members',
    },
  },
});

export default Drawer;
