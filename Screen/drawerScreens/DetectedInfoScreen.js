import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetectedInfoScreen = ({ route, navigation }) => {
  const { label, imageUri } = route.params;
  const [guidanceText, setGuidanceText] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ 서버에 감지 정보 보내고, 안내문구 받아오기
  const fetchDetectedInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken'); // 필요하면 가져오기
      const response = await fetch('http://13.236.230.193:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: label,
          imageUrl: imageUri,
          detectedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 서버 응답:', data);
        setGuidanceText(data.guidanceText); // 서버가 내려준 안내문구
      } else {
        console.error('❌ 서버 오류', await response.text());
        setGuidanceText('안내 정보를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 통신 오류', error);
      setGuidanceText('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetectedInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3886a8" />
        <Text>정보를 불러오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>감지된 사물: {label.toUpperCase()}</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.subtitle}>안내 사항</Text>
      <Text style={styles.guidance}>{guidanceText}</Text>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>돌아가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetectedInfoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  image: {
    width: 250,
    height: 350,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  guidance: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3886a8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
