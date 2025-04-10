import React, { useState, createRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import Loader from './Components/loader';

const LoginScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  // ✅ 로그인 처리 함수
  const handleSubmitPress = async () => {
    if (!userId || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrortext('');

    try {
      // 로그인 요청
      const response = await fetch('http://13.236.230.193:8082/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          password: password,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json();

        if (response.ok) {
          const token = jsonResponse.token;
          console.log('✅ 로그인 성공 - token:', token);

          // ✅ accessToken만 저장
          await AsyncStorage.setItem('accessToken', token);
          await AsyncStorage.setItem('userId', jsonResponse.user?.userId || '');

          // ✅ 로그인 이후 최신 사용자 정보 재조회
          const userInfoResponse = await fetch('http://13.236.230.193:8082/api/auth/user/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = await userInfoResponse.json();
          console.log('✅ 최신 사용자 정보:', userData);

          // ✅ DrawerNavigation으로 이동
          navigation.replace('DrawerNavigationRoutes', {
            token,
            userData, // 최신 정보
          });
        } else {
          console.log('❌ 로그인 실패:', jsonResponse);
          setErrortext(jsonResponse.message || '로그인에 실패했습니다.');
        }
      } else {
        const textResponse = await response.text();
        console.error('❌ 서버 응답 오류:', textResponse);
        setErrortext(textResponse || '서버 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('❌ 서버 연결 오류:', error);
      setErrortext(error.message || '서버와의 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <KeyboardAvoidingView enabled>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../Image/easypack.png')}
              style={{
                width: '50%',
                height: 200,
                resizeMode: 'contain',
                margin: 30,
              }}
            />
          </View>

          {/* 아이디 */}
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={setUserId}
              placeholder="아이디"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>

          {/* 비밀번호 */}
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={setPassword}
              placeholder="비밀번호"
              placeholderTextColor="#8b9cb5"
              secureTextEntry
              ref={passwordInputRef}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              underlineColorAndroid="#f000"
              returnKeyType="done"
            />
          </View>

          {/* 에러 메시지 */}
          {errortext !== '' ? (
            <Text style={styles.errorTextStyle}>{errortext}</Text>
          ) : null}

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitPress}
          >
            <Text style={styles.buttonTextStyle}>로그인</Text>
          </TouchableOpacity>

          {/* 회원가입 링크 */}
          <Text
            style={styles.registerTextStyle}
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            EASY PACK이 처음이시라면 회원가입을 해주세요!
          </Text>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#3886a8',
    borderWidth: 0,
    color: '#FFFFFF',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#3886a8',
  },
  registerTextStyle: {
    color: '#3886a8',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
