// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Loader from './Components/loader';


const RegisterScreen = (props) => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordchk, setUserPasswordchk] = useState('');
  const [country, setCountry] = useState('');
  const [airline, setAirline] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [errortext2, setErrortext2] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const idInputRef = createRef();
  const passwordInputRef = createRef();
  const passwordchkInputRef = createRef();
  const nameInputRef = createRef();
  const countryInputRef = createRef();
  const airlineInputRef = createRef();


  const handleSubmitButton = async () => {
    setErrortext('');
    setLoading(true);

    if (!userName) {
        alert('이름을 입력해주세요');
        return;
    }
    if (!userId) {
        alert('ID를 입력해주세요');
        return;
    }
    if (!userPassword) {
        alert('비밀번호를 입력해주세요');
        return;
    }
    if (userPasswordchk !== userPassword) {
        alert('비밀번호가 일치하지 않습니다');
        return;
    }
    if (!country) {
      alert('국가를 선택해주세요');
      return;
  }
  if (!airline) {
    alert('항공사를 선택해주세요');
    return;
}

    setLoading(true);

    // 서버로 보낼 데이터
    const dataToSend = {
      user_nick: userName,
      user_id: userId,
      password: userPassword,
      country: country,
      airline: airline,
    };

    try {
      const response = await fetch('http://10.0.2.2:8081/api/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }

      const responseJson = await response.json();
      console.log("📢 회원가입 응답:", responseJson);

      setLoading(false);

      if (responseJson.status === 'success') {
          console.log('✅ 회원가입 성공! 성공 화면 출력');
          setIsRegistraionSuccess(true);
      } else {
          setErrortext2(responseJson.message || '회원가입 실패. 다시 시도해주세요.');
      }
  } catch (error) {
      setLoading(false);
      console.error('❌ 회원가입 요청 실패:', error);
      setErrortext2('서버 오류. 다시 시도해주세요.');
  }
};



  if (isRegistraionSuccess) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={{flex: 2}}>
          <View
            style={{
              height: 90, // 대략 hp(13)
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../Image/success.png')}
              style={{
                height: 80, // 대략 wp(20)
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
            />
          </View>
          <View
            style={{
              height: 50, // 대략 hp(7)
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontSize: 16}}> {/* 대략 wp('4%') */}
              회원가입이 완료되었습니다.
            </Text>
          </View>

          <View style={{height: 140, justifyContent: 'center'}}> {/* 대략 hp(20) */}
            <View style={styles.btnArea}>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.5}
                onPress={() => props.navigation.navigate('LoginScreen')}>
                <Text style={{color: 'white', fontSize: 16}}> {/* 대략 wp('4%') */}
                  로그인하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Image
            source={require('../Image/Register.png')}
            style={{width: 160, resizeMode: 'contain'}}
          />
        </View>
        <View style={styles.TextArea}>
          <Text style={styles.Text}>회원가입하여 여행 짐싸주는 </Text>
          <Text style={styles.Text}>EASYPACK을 사용해보세요 </Text>
        </View>
      </View>

      <View style={styles.formArea}>
        <TextInput
          style={styles.textFormTop}
          placeholder={'아이디(5자 이상, 영문, 숫자)'}
          onChangeText={(userId) => setUserId(userId)}
          ref={idInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current && passwordInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormMiddle}
          secureTextEntry={true}
          placeholder={'비밀번호(8자 이상)'}
          onChangeText={(UserPassword) => setUserPassword(UserPassword)}
          ref={passwordInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordchkInputRef.current && passwordchkInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormBottom}
          secureTextEntry={true}
          placeholder={'비밀번호 확인'}
          onChangeText={(UserPasswordchk) =>
            setUserPasswordchk(UserPasswordchk)
          }
          ref={passwordchkInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            nameInputRef.current && nameInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
      </View>

      <View style={{flex: 0.5, justifyContent: 'center'}}>
        {userPassword !== userPasswordchk ? (
          <Text style={styles.TextValidation}>
            비밀번호가 일치하지 않습니다.
          </Text>
        ) : null}
      </View>

      <View style={styles.formArea2}>
        <TextInput
          style={styles.textFormTop}
          placeholder={'닉네임'}
          onChangeText={(UserName) => setUserName(UserName)}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            countryInputRef.current && countryInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
          <RNPickerSelect
          style={{...pickerSelectStyles}}
          ref={countryInputRef}
          onValueChange={(Country) => setCountry(Country)}
          placeholder={{label: '여행지를 선택해주세요', value: null}}
          items={[
            { label: '베트남', value: 'vietnam' },
            { label: '미국', value: 'usa' },
            { label: '일본', value: 'japan' },
            { label: '태국', value: 'thailand' },
            { label: '필리핀', value: 'philippines' },
          ]}

        />
        <RNPickerSelect
          style={{...pickerSelectStyles}}
          ref={airlineInputRef}
          onValueChange={(Airline) => setAirline(Airline)}
          placeholder={{label: '항공사를 선택해주세요', value: null}}
          items={[
            { label: '대한항공', value: '대한항공' },
            { label: '아시아나항공', value: '아시아나항공' },
            { label: '제주항공', value: '제주항공' },
            { label: '티웨이항공', value: '티웨이항공' },
            { label: '진에어항공', value: '진에어항공' },
          ]}
        />
      </View>

      <View style={{flex: 0.7, justifyContent: 'center'}}>
        {errortext2 !== '' ? (
          <Text style={styles.TextValidation}>{errortext2}</Text>
        ) : null}
      </View>

      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={handleSubmitButton}>
            <Text style={{color: 'white', fontSize: 16}}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 3}} />
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: 28, // 화면 너비의 7%로 대체
    paddingRight: 28, // 화면 너비의 7%로 대체
  },
  topArea: {
    flex: 1.5,
    paddingTop: 8, // 화면 너비의 2%로 대체
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',

  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    paddingTop: 24, // 화면 높이의 3%로 대체
  },
  alertArea: {
    height: 600, // 화면 너비의 150%로 대체
  },
  Text: {
    fontSize: 16, // 화면 너비의 4%로 대체
  },
  TextValidation: {
    fontSize: 16, // 화면 너비의 4%로 대체
    color: 'red',
  },
  formArea: {
    flex: 4,
    justifyContent: 'center',
    marginBottom: -40, // 화면 높이의 -5%로 대체
  },
  formArea2: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -16, // 화면 높이의 -2%로 대체
  },
  textFormTop: {
    borderWidth: 2,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: 48, // 화면 높이의 6%로 대체
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormMiddle: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    width: '100%',
    height: 48, // 화면 높이의 6%로 대체
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormBottom: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: 48, // 화면 높이의 6%로 대체
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnArea: {
    height: 64, // 화면 높이의 8%로 대체
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 12, // 화면 높이의 1.5%로 대체
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  inputIOS: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: 48, // 화면 높이의 6%로 대체
    paddingLeft: 10,
    paddingRight: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: 48, // 화면 높이의 6%로 대체
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputAndroid: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    color: 'black',
    height: 48, // 화면 높이의 6%로 대체
    width: 310, // 화면 너비의 86%로 대체
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});


