import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ route }) => {
  const [userInfo, setUserInfo] = useState({
    userId: '',
    password: '',
    nickname: '',
    country: '',
    airline: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        let userData = route.params?.userData;

        if (!userData) {
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            userData = JSON.parse(storedUserData);
          } else {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) {
              Alert.alert('오류', '로그인 정보를 찾을 수 없습니다.');
              return;
            }

            const response = await fetch(`http://13.236.230.193:8082/api/user/${storedUserId}`);
            const data = await response.json();
            userData = data;
          }
        }

        setUserInfo({
          userId: userData.userId || userData.id,
          password: userData.password,
          nickname: userData.nickname,
          country: userData.travelDestination || userData.country,
          airline: userData.airline,
        });
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
        Alert.alert('오류', '유저 정보를 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchUserInfo();
  }, [route.params]);

  const handleChange = (key, value) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('🛡️ 토큰 확인:', token);
      const response = await fetch('http://13.236.230.193:8082/api/user/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          password: userInfo.password,
          nickname: userInfo.nickname,
          travelDestination: userInfo.country,
          airline: userInfo.airline,
        }),
      });

      const responseText = await response.text();
      console.log('📥 서버 응답:', response.status, responseText);

      if (response.ok) {
        Alert.alert('저장 완료', '회원 정보가 저장되었습니다.');
      } else {
        Alert.alert('오류', '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 오류:', error);
      Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>프로필</Text>

        <View style={styles.profileImageContainer}>
          <Image source={require('../../Image/usericon.png')} style={styles.profileImage} />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>아이디</Text>
          <Text style={styles.readOnlyText}>{userInfo.userId}</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={userInfo.password}
            onChangeText={(text) => handleChange('password', text)}
            placeholder="비밀번호"
            secureTextEntry
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            value={userInfo.nickname}
            onChangeText={(text) => handleChange('nickname', text)}
            placeholder="닉네임"
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>여행 국가</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange('country', value)}
            value={userInfo.country}
            placeholder={{ label: '국가 선택', value: null }}
            items={[
              { label: '베트남', value: 'vietnam' },
              { label: '미국', value: 'usa' },
              { label: '일본', value: 'japan' },
              { label: '태국', value: 'thailand' },
              { label: '필리핀', value: 'philippines' },
            ]}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>항공사</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange('airline', value)}
            value={userInfo.airline}
            placeholder={{ label: '항공사 선택', value: null }}
            items={[
              { label: '대한항공', value: '대한항공' },
              { label: '아시아나항공', value: '아시아나항공' },
              { label: '제주항공', value: '제주항공' },
              { label: '티웨이항공', value: '티웨이항공' },
              { label: '진에어항공', value: '진에어항공' },
            ]}
            style={pickerSelectStyles}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>수정</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { alignItems: 'center', paddingBottom: 24 },
  header: { fontSize: 28, fontWeight: 'bold', marginTop: 24, marginBottom: 20 },
  profileImageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  inputBox: {
    width: '90%',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  readOnlyText: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f5f5f5',
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    width: '90%',
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    width: '100%',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    width: '100%',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
};

export default SettingsScreen;
