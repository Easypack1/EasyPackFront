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
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import BackBtn from './Components/BackBtn';

// ❌ import { NavigationContainer } from '@react-navigation/native';  // ❌ 삭제

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Stack 생성 함수 (NavigationContainer 제거)
const createScreenStack = (name, component, navigationTitle) => {
  return ({ navigation, route }) => (
    <Stack.Navigator>
      <Stack.Screen
        name={name}
        component={component}
        initialParams={route.params}
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

const DrawerNavigatorRoutes = ({ route }) => {
  console.log('🚪 Drawer로 넘어온 params:', route?.params);
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
        initialParams={{ travelDestination: route.params?.travelDestination }}
      />
      <Drawer.Screen
        name="SettingScreenStack"
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

    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
