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
import Weather from './Screen/Components/Weather';  // ✅ Weather.js 추가

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
          headerLeft: () => <BackBtn onPress={() => navigation.goBack()} />, // ✅ 뒤로 가기 버튼 처리
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

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* ✅ SplashScreen (앱 실행 시 처음 나타나는 화면) */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        
        {/* ✅ 로그인 및 회원가입 화면 */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />

        {/* ✅ Drawer Navigation (메인 네비게이션) */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          options={{ headerShown: false }}
        />

        {/* ✅ 추가된 Weather 스크린 */}
        <Stack.Screen
          name="Weather"
          component={Weather}
          options={{ title: '날씨 정보' }}  // 📌 "날씨 정보"라는 제목 표시
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;




