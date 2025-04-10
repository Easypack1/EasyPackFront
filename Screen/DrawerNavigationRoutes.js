import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './drawerScreens/HomeScreen';
import SettingsScreen from './drawerScreens/SettingsScreen';
import CameraScreen from './drawerScreens/CameraScreen';
import CommunityScreen from './drawerScreens/CommunityScreen';
import InfoScreen from './drawerScreens/InfoScreen';
import InfoScreen2 from './drawerScreens/InfoScreen2';
import InfoScreen3 from './drawerScreens/InfoScreen3';
import ReviewScreen from './drawerScreens/ReviewScreen';

import CustomSidebarMenu from './Components/CustomSidebarMenu';
import BackBtn from './Components/BackBtn';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Stack 생성 함수 (params 제거)
const createScreenStack = (name, Component, navigationTitle) => {
  return ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen
        name={name}
        options={{
          title: navigationTitle,
          headerLeft: name === 'HomeScreen'
            ? undefined
            : () => <BackBtn onPress={() => navigation.goBack()} />,
          headerStyle: {
            backgroundColor: '#307ecc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        component={Component}
      />
    </Stack.Navigator>
  );
};

// ✅ DrawerNavigator에서 params 제거
const DrawerNavigatorRoutes = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#cee1f2',
        drawerInactiveTintColor: '#d8d8d8',
        drawerStyle: { backgroundColor: '#1f1f1f' },
        headerShown: false,
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen
        name="HomeScreenStack"
        options={{ drawerLabel: 'Home' }}
        component={createScreenStack('HomeScreen', HomeScreen, 'Home')}
      />
      <Drawer.Screen
        name="SettingsScreenStack"
        options={{ drawerLabel: 'Settings' }}
        component={createScreenStack('SettingsScreen', SettingsScreen, 'Settings')}
      />
      <Drawer.Screen
        name="CameraScreenStack"
        options={{ drawerLabel: 'Camera' }}
        component={createScreenStack('CameraScreen', CameraScreen, 'Camera')}
      />
      <Drawer.Screen
        name="CommunityScreenStack"
        options={{ drawerLabel: 'Community' }}
        component={createScreenStack('CommunityScreen', CommunityScreen, 'Community')}
      />
      <Drawer.Screen
        name="InfoScreenStack"
        options={{ drawerLabel: 'Info' }}
        component={createScreenStack('InfoScreen', InfoScreen, 'Info')}
      />
      <Drawer.Screen
        name="InfoScreen2Stack"
        options={{ drawerLabel: 'Info 2' }}
        component={createScreenStack('InfoScreen2', InfoScreen2, 'Info 2')}
      />
      <Drawer.Screen
        name="InfoScreen3Stack"
        options={{ drawerLabel: 'Info 3' }}
        component={createScreenStack('InfoScreen3', InfoScreen3, 'Info 3')}
      />
      <Drawer.Screen
        name="ReviewScreenStack"
        options={{ drawerLabel: 'Review' }}
        component={createScreenStack('ReviewScreen', ReviewScreen, 'Review')}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
