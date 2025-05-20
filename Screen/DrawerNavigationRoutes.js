import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './drawerScreens/HomeScreen';
import SettingsScreen from './drawerScreens/SettingsScreen';
import CameraScreen from './drawerScreens/CameraScreen';
import DetectedInfoScreen from './drawerScreens/DetectedInfoScreen';
import CommunityScreen from './drawerScreens/CommunityScreen';
import ReviewScreen from './drawerScreens/ReviewScreen';
import JapanBoard from './drawerScreens/JapanBoard';
import USABoard from './drawerScreens/USABoard';
import VietnamBoard from './drawerScreens/VietnamBoard';
import PhilippinesBoard from './drawerScreens/PhilippinesBoard';
import ThailandBoard from './drawerScreens/ThailandBoard';
import PostDetailScreen from './drawerScreens/PostDetailScreen';

import CustomSidebarMenu from './Components/CustomSidebarMenu';
import BackBtn from './Components/BackBtn';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 기존 createScreenStack 함수 그대로 유지
const createScreenStack = (name, Component) => {
  return ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen
        name={name}
        component={Component}
        options={{
          title: '',
          headerLeft: name === 'HomeScreen' ? undefined : () => <BackBtn onPress={() => navigation.goBack()} />,
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

// CameraStack 유지
const CameraStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CameraScreen"
      component={CameraScreen}
      options={{
        title: '',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#307ecc',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    <Stack.Screen
      name="DetectedInfoScreen"
      component={DetectedInfoScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#307ecc',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
  </Stack.Navigator>
);

// 커뮤니티 관련 스택 정의 (CommunityScreen -> ReviewScreen -> 각 게시판)
function CommunityStack() {
  return (
    <Stack.Navigator initialRouteName="CommunityScreen">
      <Stack.Screen
        name="CommunityScreen"
        component={CommunityScreen}
        options={{ title: '커뮤니티' }}
      />
      <Stack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={{ title: '리뷰 작성' }}
      />
      <Stack.Screen
        name="JapanBoard"
        component={JapanBoard}
        options={{ title: '일본 게시판' }}
      />
      <Stack.Screen
        name="USABoard"
        component={USABoard}
        options={{ title: '미국 게시판' }}
      />
      <Stack.Screen
        name="VietnamBoard"
        component={VietnamBoard}
        options={{ title: '베트남 게시판' }}
      />
      <Stack.Screen
        name="PhilippinesBoard"
        component={PhilippinesBoard}
        options={{ title: '필리핀 게시판' }}
      />
      <Stack.Screen
        name="ThailandBoard"
        component={ThailandBoard}
        options={{ title: '태국 게시판' }}
      />
      <Stack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={{ title: '게시글 상세' }}
      />
    </Stack.Navigator>
  );
}

// Drawer Navigator Routes (커뮤니티는 CommunityStack으로 통합)
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
        name="CommunityStack"
        options={{ drawerLabel: 'Community' }}
        component={CommunityStack} // 여기에 커뮤니티 관련 스택 통합
      />
      {/* 나머지 InfoScreen 등도 기존대로 */}
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
