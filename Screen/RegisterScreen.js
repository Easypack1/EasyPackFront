import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);

  const [terms, setTerms] = useState({
    termsOfUse: false,
    privacyPolicy: false,
    personalInfo: false,
    marketing: false,
  });

  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [travelDestination, setTravelDestination] = useState('');
  const [airline, setAirline] = useState('');

  const isRequiredTermsAccepted = () => terms.termsOfUse && terms.privacyPolicy;

  const handleTermChange = (term) => {
    setTerms({ ...terms, [term]: !terms[term] });
  };

  const handleAcceptAllTerms = () => {
    const allChecked = !(terms.termsOfUse && terms.privacyPolicy && terms.personalInfo && terms.marketing);
    setTerms({
      termsOfUse: allChecked,
      privacyPolicy: allChecked,
      personalInfo: allChecked,
      marketing: allChecked,
    });
  };

  const handleNext = () => {
    if (step === 1 && !isRequiredTermsAccepted()) {
      Alert.alert('알림', '필수 약관에 모두 동의해야 합니다.');
      return;
    }
    if (step === 2) {
      if (!userId || !nickname || !password || password !== passwordConfirm) {
        Alert.alert('알림', '아이디, 닉네임, 비밀번호를 정확히 입력해주세요.');
        return;
      }
    }
    if (step === 3) {
      if (!travelDestination || !airline) {
        Alert.alert('알림', '여행지와 항공사를 선택해주세요.');
        return;
      }
      handleRegister();
      return;
    }
    setStep(step + 1);
  };

  const handleRegister = async () => {
    const dataToSend = {
      user_id: userId,
      nickname,
      password,
      travel_destination: travelDestination,
      airline,
    };

    console.log('📢 전송 데이터:', dataToSend);

    try {
      const response = await fetch('http://13.236.230.193:8082/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseJson = await response.json();
        if (response.ok) {
          Alert.alert('성공', '회원가입이 완료되었습니다.', [
            { text: '로그인하기', onPress: () => navigation.replace('LoginScreen', { travelDestination }) }
          ]);
        } else {
          Alert.alert('실패', responseJson.message || '회원가입에 실패했습니다.');
        }
      } else {
        const textResponse = await response.text();
        Alert.alert('오류', textResponse || '서버에서 잘못된 응답을 받았습니다.');
      }
    } catch (error) {
      console.error('❌ 서버 연결 오류:', error.message);
      Alert.alert('에러', '서버와의 연결에 실패했습니다.');
    }
  };

  const renderPicker = (label, value, setValue, items) => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => {
            const options = items.map(item => item.label);
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: [...options, '취소'],
                cancelButtonIndex: options.length,
              },
              (buttonIndex) => {
                if (buttonIndex !== options.length) {
                  setValue(items[buttonIndex].value);
                }
              }
            );
          }}
        >
          <Text style={{ fontSize: 16, color: value ? 'black' : '#888' }}>
            {items.find(item => item.value === value)?.label || `${label} 선택`}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <RNPickerSelect
          onValueChange={setValue}
          value={value}
          placeholder={{ label: `${label} 선택`, value: null }}
          items={items}
          style={pickerSelectStyles}
        />
      );
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressBarContainer}>
      {[1, 2, 3].map((n) => (
        <View key={n} style={[styles.progressBar, step >= n && styles.activeProgress]} />
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderProgressBar()}

      {step === 1 && (
        <View>
          <Text style={styles.title}>서비스 이용 약관에 동의해 주세요</Text>
          {['termsOfUse', 'privacyPolicy', 'personalInfo', 'marketing'].map((term) => (
            <TouchableOpacity key={term} style={styles.checkbox} onPress={() => handleTermChange(term)}>
              <Text>
                {terms[term] ? '✅' : '⬜'} {term === 'termsOfUse' && '이용 약관에 동의 (필수)'}
                {term === 'privacyPolicy' && '개인정보 수집 및 이용 동의 (필수)'}
                {term === 'personalInfo' && '개인정보 이용 안내 (선택)'}
                {term === 'marketing' && '마케팅 수신 동의 (선택)'}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.checkbox} onPress={handleAcceptAllTerms}>
            <Text>
              {terms.termsOfUse && terms.privacyPolicy && terms.personalInfo && terms.marketing ? '✅' : '⬜'} 전체 동의하기
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.title}>아이디와 비밀번호를 입력해 주세요.</Text>
          <TextInput style={styles.input} placeholder="아이디" value={userId} onChangeText={setUserId} />
          <TextInput style={styles.input} placeholder="닉네임" value={nickname} onChangeText={setNickname} />
          <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="비밀번호 확인" secureTextEntry value={passwordConfirm} onChangeText={setPasswordConfirm} />
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.title}>나라와 항공사를 선택해주세요.</Text>
          {renderPicker('여행지', travelDestination, setTravelDestination, [
            { label: '베트남', value: '베트남' },
            { label: '미국', value: '미국' },
            { label: '일본', value: '일본' },
            { label: '태국', value: '태국' },
            { label: '필리핀', value: '필리핀' },
          ])}

          {renderPicker('항공사', airline, setAirline, [
            { label: '대한항공', value: '대한항공' },
            { label: '아시아나항공', value: '아시아나항공' },
            { label: '제주항공', value: '제주항공' },
            { label: '티웨이항공', value: '티웨이항공' },
            { label: '진에어항공', value: '진에어항공' },
          ])}
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
    justifyContent: 'center',
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
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#dbdbdb',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3886a8',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginHorizontal: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
    color: 'black',
    marginBottom: 10,
  },
  inputAndroid: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
    color: 'black',
    marginBottom: 10,
  },
};

export default RegisterScreen;
