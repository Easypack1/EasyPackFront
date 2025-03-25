import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import DrawerNavigationRoutes from './Screen/DrawerNavigationRoutes';
import BackBtn from './Screen/Components/BackBtn';

// Import Weather Component
import Weather from './Screen/Components/Weather';  // 경로를 정확하게 수정

const Stack = createStackNavigator();

// Stack Navigator for Login, Register and Logout Screen
const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerBackImage: BackBtn,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerBackImage: BackBtn,
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          options={{ headerShown: false }}
        />
        {/* Add Weather component as a screen */}
        <Stack.Screen
          name="Weather"
          component={Weather}
          options={{ title: '날씨 정보' }}  // title을 설정해서 화면 제목을 추가할 수 있음
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



