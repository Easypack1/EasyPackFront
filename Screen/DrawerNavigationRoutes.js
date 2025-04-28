import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './drawerScreens/HomeScreen';
import SettingsScreen from './drawerScreens/SettingsScreen';
import CameraScreen from './drawerScreens/CameraScreen';
import DetectedInfoScreen from './drawerScreens/DetectedInfoScreen';
import CommunityScreen from './drawerScreens/CommunityScreen';
import InfoScreen from './drawerScreens/InfoScreen';
import InfoScreen2 from './drawerScreens/InfoScreen2';
import InfoScreen3 from './drawerScreens/InfoScreen3';
import ReviewScreen from './drawerScreens/ReviewScreen';
import AirlineInfoScreen from './/drawerScreens/AirlineInfoScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import BackBtn from './Components/BackBtn';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
console.log('📸 CameraScreen is:', typeof CameraScreen, CameraScreen);

// ✅ 공통 Stack 생성 함수 (단순한 페이지용)
const createScreenStack = (name, Component, navigationTitle) => {
  return ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen
        name={name}
        component={Component}
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
      />
    </Stack.Navigator>
  );
};

// ✅ Camera Stack → DetectedInfoScreen 포함
const CameraStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CameraScreen"
      component={CameraScreen}
      options={{
        title: 'Camera',
        headerStyle: {
          backgroundColor: '#307ecc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
    <Stack.Screen
      name="DetectedInfoScreen"
      component={DetectedInfoScreen}
      options={{
        title: 'Detected Info',
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#307ecc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  </Stack.Navigator>
);

// ✅ Drawer 구조
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
        component={CameraStack} // ✅ DetectedInfo 포함된 Stack 사용
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
      <Drawer.Screen
        name="AirlineInfoScreenStack"
        options={{ drawerLabel: 'Airline' }}
        component={createScreenStack('AirlineInfoScreen', AirlineInfoScreen, 'Airline')}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
