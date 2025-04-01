// Import React
import React from 'react';

// Import Navigators from React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import Screens
import HomeScreen from './drawerScreens/HomeScreen';
import SettingsScreen from './drawerScreens/SettingsScreen';
import CameraScreen from './drawerScreens/CameraScreen';
import CommunityScreen from './drawerScreens/CommunityScreen';
import InfoScreen from './drawerScreens/InfoScreen';

import CustomSidebarMenu from './Components/CustomSidebarMenu';
import BackBtn from './Components/BackBtn';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ 공통 Stack 생성 함수
const createScreenStack = (name, component, navigationTitle) => {
  return ({ navigation, route }) => (
    <Stack.Navigator>
      <Stack.Screen
        name={name}
        component={component}
        initialParams={route.params} // ✅ 여기서 전달!!
        options={{
          title: navigationTitle,
          headerLeft: () => <BackBtn onPress={() => navigation.goBack()} />,
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


const DrawerNavigatorRoutes = ({route}) => {
  const userParams = route?.params || {};
  console.log('🚪 Drawer로 넘어온 params:', userParams);
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
        initialParams={userParams} // 전체 파라미터 전달
      />

      {/* ✅ 설정 스크린 */}
      <Drawer.Screen
        name="SettingsScreenStack"
        options={{
          drawerLabel: 'Settings',
        }}
        component={createScreenStack('SettingsScreen', SettingsScreen, 'Settings')}
      />

      {/* ✅ 카메라 스크린 */}
      <Drawer.Screen
        name="CameraScreenStack"
        options={{
          drawerLabel: 'Camera',
        }}
        component={createScreenStack('CameraScreen', CameraScreen, 'Camera')}
      />

      {/* ✅ 커뮤니티 스크린 */}
      <Drawer.Screen
        name="CommunityScreenStack"
        options={{
          drawerLabel: 'Community',
        }}
        component={createScreenStack('CommunityScreen', CommunityScreen, 'Community')}
      />

      {/* ✅ 수하물 정보 스크린 */}
      <Drawer.Screen
        name="InfoScreenStack"
        options={{
          drawerLabel: 'Info',
        }}
        component={createScreenStack('InfoScreen', InfoScreen, 'Info')}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
