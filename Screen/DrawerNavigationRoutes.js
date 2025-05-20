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
import AirlineInfoScreen from './drawerScreens/AirlineInfoScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import BackBtn from './Components/BackBtn';
import JapanBoard from './drawerScreens/JapanBoard';
import USABoard from './drawerScreens/USABoard';
import VietnamBoard from './drawerScreens/VietnamBoard';
import PhilippinesBoard from './drawerScreens/PhilippinesBoard';
import ThailandBoard from './drawerScreens/ThailandBoard';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
console.log('📸 CameraScreen is:', typeof CameraScreen, CameraScreen);

// ✅ 공통 Stack 생성 함수 (단순한 페이지용)
const createScreenStack = (name, Component) => {
  return ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen
        name={name}
        component={Component}
        options={{
          title: '', // ✅ 헤더 텍스트 제거
          headerLeft: name === 'HomeScreen'
            ? undefined
            : () => <BackBtn onPress={() => navigation.goBack()} />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: 'black',
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
        title: '', // ✅ 헤더 텍스트 제거
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#307ecc',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
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
        title: '', // ✅ 헤더 텍스트 제거
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#307ecc',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
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
        component={createScreenStack('HomeScreen', HomeScreen)}
      />
      <Drawer.Screen
        name="SettingsScreenStack"
        options={{ drawerLabel: 'Settings' }}
        component={createScreenStack('SettingsScreen', SettingsScreen)}
      />
      <Drawer.Screen
        name="CameraScreenStack"
        options={{ drawerLabel: 'Camera' }}
        component={CameraStack}
      />
      <Drawer.Screen
        name="CommunityScreenStack"
        options={{ drawerLabel: 'Community' }}
        component={createScreenStack('CommunityScreen', CommunityScreen)}
      />
      <Drawer.Screen
        name="InfoScreenStack"
        options={{ drawerLabel: 'Info' }}
        component={createScreenStack('InfoScreen', InfoScreen)}
      />
      <Drawer.Screen
        name="InfoScreen2Stack"
        options={{ drawerLabel: 'Info 2' }}
        component={createScreenStack('InfoScreen2', InfoScreen2)}
      />
      <Drawer.Screen
        name="InfoScreen3Stack"
        options={{ drawerLabel: 'Info 3' }}
        component={createScreenStack('InfoScreen3', InfoScreen3)}
      />
      <Drawer.Screen
        name="ReviewScreenStack"
        options={{ drawerLabel: 'Review' }}
        component={createScreenStack('ReviewScreen', ReviewScreen)}
      />
      <Drawer.Screen
        name="AirlineInfoScreenStack"
        options={{ drawerLabel: 'Airline' }}
        component={createScreenStack('AirlineInfoScreen', AirlineInfoScreen)}
      />
      <Drawer.Screen
  name="JapanBoardStack"
  options={{ drawerLabel: 'Japan' }}
  component={createScreenStack('JapanBoard', JapanBoard)}
/>
<Drawer.Screen
  name="USABoardStack"
  options={{ drawerLabel: 'USA' }}
  component={createScreenStack('USABoard', USABoard)}
/>
<Drawer.Screen
  name="VietnamBoardStack"
  options={{ drawerLabel: 'Vietnam' }}
  component={createScreenStack('VietnamBoard', VietnamBoard)}
/>
<Drawer.Screen
  name="PhilippinesBoardStack"
  options={{ drawerLabel: 'Philippines' }}
  component={createScreenStack('PhilippinesBoard', PhilippinesBoard)}
/>
<Drawer.Screen
  name="ThailandBoardStack"
  options={{ drawerLabel: 'Thailand' }}
  component={createScreenStack('ThailandBoard', ThailandBoard)}
/>


    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
