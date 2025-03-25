// Import React and Component
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // ✅ 저장된 토큰 상태 확인
        const token = await AsyncStorage.getItem('access_token');
        console.log('🔑 저장된 토큰:', token);

        // ✅ 상태에 따라 경로 설정
        if (token) {
          // ✅ 토큰이 있으면 DrawerNavigationRoutes로 이동
          navigation.replace('DrawerNavigationRoutes');
        } else {
          // ✅ 토큰이 없으면 Auth로 이동 (로그인 화면)
          navigation.replace('Auth');
        }
      } catch (error) {
        console.log('❌ 상태 확인 오류:', error);
        navigation.replace('Auth');
      }
    };

    // ✅ 1.5초 후 상태 확인
    setTimeout(() => {
      checkLoginStatus();
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* ✅ 로고 이미지 */}
      <Image
        source={require('../Image/easypack.png')}
        style={styles.logo}
      />
      {/* ✅ 로딩 인디케이터 */}
      <ActivityIndicator
        color="#3886a8"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: '90%',
    resizeMode: 'contain',
    margin: 30,
  },
  activityIndicator: {
    height: 80,
  },
});
