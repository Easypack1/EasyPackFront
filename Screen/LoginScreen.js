import React, { useState, createRef } from 'react';
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

  // ✅ 타임아웃 설정 함수
  const fetchWithTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('서버 응답 시간이 초과되었습니다.')), timeout)
      ),
    ]);
  };

  // ✅ 로그인 처리 함수
  const handleSubmitPress = async () => {
    if (!userId || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrortext('');

    try {
      const response = await fetchWithTimeout('http://54.153.203.196:8082/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId, // ✅ 필드명 수정
          password: password, // ✅ 필드명 수정
        }),
      });

      // ✅ JSON 응답인지 확인 후 처리
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json();

        if (response.ok) {
          console.log('✅ 로그인 성공:', jsonResponse);

          // ✅ 사용자 정보 출력
          console.log('사용자 정보:', jsonResponse);

          // ✅ 로그인 성공 후 다음 화면으로 이동
          navigation.replace('DrawerNavigationRoutes', {
            userData: jsonResponse, // 사용자 데이터 전달
            travelDestination: jsonResponse.travelDestination, // ✅ travelDestination 함께 전달
          });
        } else {
          console.log('❌ 로그인 실패:', jsonResponse);
          setErrortext(jsonResponse.message || '로그인에 실패했습니다.');
        }
      } else {
        // ✅ JSON 형식이 아닌 경우 텍스트 출력
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
        <View>
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

            {/* ✅ 아이디 입력 필드 */}
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(userId) => setUserId(userId)}
                placeholder="아이디"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            {/* ✅ 비밀번호 입력 필드 */}
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(password) => setPassword(password)}
                placeholder="비밀번호"
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>

            {/* ✅ 오류 메시지 출력 */}
            {errortext !== '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}

            {/* ✅ 로그인 버튼 */}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}
            >
              <Text style={styles.buttonTextStyle}>로그인</Text>
            </TouchableOpacity>

            {/* ✅ 회원가입 링크 */}
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('RegisterScreen')}
            >
              EASY PACK이 처음이시라면 회원가입을 해주세요!
            </Text>
          </KeyboardAvoidingView>
        </View>
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
