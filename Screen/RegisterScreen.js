import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);

  // ✅ Step 1 State
  const [terms, setTerms] = useState({
    termsOfUse: false, // 필수
    privacyPolicy: false, // 필수
    personalInfo: false, // 선택
    marketing: false, // 선택
  });

  // ✅ Step 2 State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // ✅ Step 3 State
  const [country, setCountry] = useState('');
  const [airline, setAirline] = useState('');

  // ✅ 필수 약관 체크 확인 함수
  const isRequiredTermsAccepted = () => {
    return terms.termsOfUse && terms.privacyPolicy;
  };

  // ✅ 전체 동의 버튼 동작
  const handleAcceptAllTerms = () => {
    const newTermsState = !(
      terms.termsOfUse &&
      terms.privacyPolicy &&
      terms.personalInfo &&
      terms.marketing
    );

    setTerms({
      termsOfUse: newTermsState,
      privacyPolicy: newTermsState,
      personalInfo: newTermsState,
      marketing: newTermsState,
    });
  };

  // ✅ 개별 약관 체크 동작
  const handleTermChange = (term) => {
    setTerms({ ...terms, [term]: !terms[term] });
  };

  // ✅ 다음 단계로 진행 처리
  const handleNext = () => {
    if (step === 1) {
      if (!isRequiredTermsAccepted()) {
        Alert.alert('알림', '필수 약관에 모두 동의해야 합니다.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!userId || !password || password !== passwordConfirm) {
        Alert.alert('알림', '아이디와 비밀번호를 정확히 입력해주세요.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!country || !airline) {
        Alert.alert('알림', '국가와 항공사를 선택해주세요.');
        return;
      }
      handleRegister();
    }
  };

  // ✅ 회원가입 처리 함수
  const handleRegister = async () => {
    const dataToSend = {
      user_id: userId,
      password,
      country,
      airline,
    };

    try {
      const response = await fetch('http://10.0.2.2:8081/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        Alert.alert('성공', '회원가입이 완료되었습니다.', [
          { text: '로그인하기', onPress: () => navigation.navigate('LoginScreen') }
        ]);
      } else {
        Alert.alert('실패', responseJson.message);
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('에러', '회원가입 중 문제가 발생했습니다.');
    }
  };

  // ✅ 단계별 표시기 렌더링
  const renderProgressBar = () => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, step >= 1 && styles.activeProgress]} />
        <View style={[styles.progressBar, step >= 2 && styles.activeProgress]} />
        <View style={[styles.progressBar, step >= 3 && styles.activeProgress]} />
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ 상단 단계 표시기 */}
      {renderProgressBar()}

      {/* ✅ Step 1: 약관 동의 */}
      {step === 1 && (
        <View>
          <Text style={styles.title}>서비스 이용 약관에 동의해 주세요</Text>

          {/* ✅ 개별 약관 */}
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleTermChange('termsOfUse')}>
            <Text>{terms.termsOfUse ? '✅' : '⬜'} 이용 약관에 동의 (필수)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleTermChange('privacyPolicy')}>
            <Text>{terms.privacyPolicy ? '✅' : '⬜'} 개인정보 수집 및 이용 동의 (필수)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleTermChange('personalInfo')}>
            <Text>{terms.personalInfo ? '✅' : '⬜'} 개인정보 이용 안내 (선택)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleTermChange('marketing')}>
            <Text>{terms.marketing ? '✅' : '⬜'} 마케팅 수신 동의 (선택)</Text>
          </TouchableOpacity>

          {/* ✅ 전체 동의 (맨 아래로 이동) */}
          <TouchableOpacity
            style={styles.checkbox}
            onPress={handleAcceptAllTerms}>
            <Text>
              {isRequiredTermsAccepted() && terms.personalInfo && terms.marketing ? '✅' : '⬜'} 전체 동의하기
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ Step 2: 아이디 및 비밀번호 */}
      {step === 2 && (
        <View>
          <Text style={styles.title}>아이디와 비밀번호를 입력해 주세요.</Text>
          <TextInput
            style={styles.input}
            placeholder="아이디"
            value={userId}
            onChangeText={setUserId}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            secureTextEntry
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
          />
        </View>
      )}


      {step === 3 && (
        <View>
          <Text style={styles.title}>나라와 항공사를 선택해주세요.</Text>
          <RNPickerSelect
            onValueChange={(value) => setCountry(value)}
            placeholder={{ label: '국가 선택', value: null }}
            items={[
            { label: '베트남', value: 'vietnam' },
            { label: '미국', value: 'usa' },
            { label: '일본', value: 'japan' },
            { label: '태국', value: 'thailand' },
            { label: '필리핀', value: 'philippines' },
            ]}
          />
          <RNPickerSelect
            onValueChange={(value) => setAirline(value)}
            placeholder={{ label: '항공사 선택', value: null }}
            items={[
            { label: '대한항공', value: '대한항공' },
            { label: '아시아나항공', value: '아시아나항공' },
            { label: '제주항공', value: '제주항공' },
            { label: '티웨이항공', value: '티웨이항공' },
            { label: '진에어항공', value: '진에어항공' },
            ]}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{step < 3 ? '다음' : '완료'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center'
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressBar: {
    height: 3,
    width: '30%',
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  activeProgress: {
    backgroundColor: '#2e2d2d',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: '#dbdbdb',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#3886a8',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  }
});

export default RegisterScreen;