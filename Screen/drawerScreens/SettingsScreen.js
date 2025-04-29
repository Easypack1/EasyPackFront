import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, TextInput, StyleSheet,
  TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator,
  Platform, ActionSheetIOS,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    userId: '',
    password: '',
    nickname: '',
    travel_destination: '',
    airline: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch('http://13.236.230.193:8082/api/auth/user/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('📥 받은 유저 정보:', data);

        setUserInfo({
          userId: data.userId,
          password: '',
          nickname: data.nickname || '',
          travel_destination: data.travel_destination || '',
          airline: data.airline || '',
        });
      } catch (error) {
        console.error('❌ 유저 정보 로딩 실패:', error);
        Alert.alert('오류', '회원 정보를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (key, value) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('accessToken');

      const bodyData = {
        userId: userInfo.userId,
        nickname: userInfo.nickname,
        travel_destination: userInfo.travel_destination,
        airline: userInfo.airline,
      };

      if (userInfo.password.trim() !== '') {
        bodyData.password = userInfo.password;
      }

      console.log('📤 저장 요청 바디:', bodyData);

      const response = await fetch('http://13.236.230.193:8082/api/auth/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const resText = await response.text();
      console.log('📤 저장 응답:', response.status, resText);

      if (response.ok) {
        const updatedRes = await fetch('http://13.236.230.193:8082/api/auth/user/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedUserData = await updatedRes.json();

        console.log('🔄 저장 후 최신 유저 정보:', updatedUserData);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

        Alert.alert('저장 완료', '회원 정보가 저장되었습니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('HomeScreenStack'),
          },
        ]);
      } else {
        Alert.alert('오류', resText || '회원 정보 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      Alert.alert('오류', '회원 정보를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const renderPicker = (field, label, value, items) => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.inputBox}>
          <Text style={styles.label}>{label}</Text>
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
                    handleChange(field, items[buttonIndex].value);
                  }
                }
              );
            }}
          >
            <Text style={{ fontSize: 16, color: value ? 'black' : '#888' }}>
              {items.find(item => item.value === value)?.label || '선택하세요'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.inputBox}>
          <Text style={styles.label}>{label}</Text>
          <RNPickerSelect
            onValueChange={(val) => handleChange(field, val)}
            value={value}
            placeholder={{ label: `${label} 선택`, value: null }}
            items={items}
            style={pickerSelectStyles}
          />
        </View>
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text>회원 정보를 불러오는 중입니다...</Text>
      </SafeAreaView>
    );
  }

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
            placeholder="비밀번호 (수정 시 입력)"
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

        {renderPicker('travel_destination', '여행 국가', userInfo.travel_destination, [
          { label: '베트남', value: 'vietnam' },
          { label: '미국', value: 'usa' },
          { label: '일본', value: 'japan' },
          { label: '태국', value: 'thailand' },
          { label: '필리핀', value: 'philippines' },
        ])}

        {renderPicker('airline', '항공사', userInfo.airline, [
          { label: '대한항공', value: '대한항공' },
          { label: '아시아나항공', value: '아시아나항공' },
          { label: '제주항공', value: '제주항공' },
          { label: '티웨이항공', value: '티웨이항공' },
          { label: '진에어항공', value: '진에어항공' },
        ])}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? '저장 중...' : '수정'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContainer: { alignItems: 'center', paddingBottom: 24 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginTop: 10, marginBottom: 20 },
  profileImageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  inputBox: { width: '90%', marginBottom: 15 },
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
