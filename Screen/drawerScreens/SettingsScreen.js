import React, { useState, useEffect } from 'react';
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

const SettingsScreen = () => {
  const [userInfo, setUserInfo] = useState({
    id: '',
    password: '',
    nickname: '',
    country: '',
    airline: '',
  });

  // ✅ 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        let parsedData = null;

        if (storedUserData) {
          parsedData = JSON.parse(storedUserData);
        } else {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (!storedUserId) {
            Alert.alert('오류', '로그인 정보를 찾을 수 없습니다.');
            return;
          }

          const response = await fetch(`http://13.236.230.193:8082/api/user/${storedUserId}`);
          const data = await response.json();
          parsedData = data;
        }

        setUserInfo({
          id: parsedData.userId,
          password: parsedData.password,
          nickname: parsedData.nickname,
          country: parsedData.travelDestination,
          airline: parsedData.airline,
        });
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
        Alert.alert('오류', '유저 정보를 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (key, value) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://13.236.230.193:8082/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.id,
          password: userInfo.password,
          nickname: userInfo.nickname,
          travelDestination: userInfo.country,
          airline: userInfo.airline,
        }),
      });

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
      <Text style={styles.header}>프로필</Text>

      <View style={styles.profileImageContainer}>
        <Image source={require('../../Image/usericon.png')} style={styles.profileImage} />
      </View>

      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyLabel}>아이디</Text>
        <Text style={styles.readOnlyText}>{userInfo.id}</Text>
      </View>

      <TextInput
        style={styles.input}
        value={userInfo.password}
        onChangeText={(text) => handleChange('password', text)}
        placeholder="비밀번호"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={userInfo.nickname}
        onChangeText={(text) => handleChange('nickname', text)}
        placeholder="닉네임"
      />

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

      <RNPickerSelect
        onValueChange={(value) => handleChange('airline', value)}
        value={userInfo.airline}
        placeholder={{ label: '핬공사 선택', value: null }}
        items={[
          { label: '대한핬공', value: '대한항공' },
          { label: '아시아나핬공', value: '아시아나항공' },
          { label: '제주핬공', value: '제주항공' },
          { label: '티웨이핬공', value: '티웨이항공' },
          { label: '진에어핬공', value: '진에어항공' },
        ]}
        style={pickerSelectStyles}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  profileImageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  readOnlyField: {
    marginBottom: 15,
  },
  readOnlyLabel: {
    color: '#777',
    fontSize: 14,
    marginBottom: 4,
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
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 15,
  },
};

export default SettingsScreen;
