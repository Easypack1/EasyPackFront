import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const cameraRef = useRef(null);

  // 여행지 및 항공사 정보 상태
  const [travel_destination, setTravelDestination] = useState('');
  const [airline, setAirline] = useState('');

  // 권한 요청 + 사용자 정보 불러오기
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        setCameraType(Camera?.Constants?.Type?.back ?? 0);
      } else {
        setHasPermission(false);
      }

      try {
        const destination = await AsyncStorage.getItem('travel_destination');
        const airlineData = await AsyncStorage.getItem('airline');
        setTravelDestination(destination || '');
        setAirline(airlineData || '');
      } catch (err) {
        console.error('❌ AsyncStorage 오류:', err);
        Alert.alert('오류', '여행지 정보를 불러오지 못했습니다.');
      }
    })();
  }, []);

  const sendToServer = async (photoUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      setIsDetecting(true);
      const response = await fetch('http://13.236.230.193:8000/predict', {
        method: 'POST',
        headers: {
          'x-country': travel_destination,
          'x-airline': airline,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('🧠 YOLO 감지 결과:', result);

      if (result.detections?.length > 0) {
        const firstObject = result.detections[0];
        const label = firstObject.label;

        navigation.navigate('DetectedInfoScreen', {
          label,
          imageUri: photoUri,
        });
      } else {
        Alert.alert('감지된 물체 없음', '아무것도 감지되지 않았어요.');
      }
    } catch (err) {
      console.error('❌ 서버 요청 오류:', err);
      Alert.alert('에러', '서버 요청 중 문제가 발생했습니다.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          await sendToServer(photo.uri);
        } else {
          Alert.alert('오류', '사진 촬영에 실패했습니다.');
        }
      } catch (error) {
        console.error('📸 촬영 오류:', error);
        Alert.alert('에러', '촬영 도중 오류가 발생했습니다.');
      }
    } else {
      Alert.alert('오류', '카메라가 준비되지 않았습니다.');
    }
  };

  if (hasPermission === null || cameraType === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>카메라 초기화 중...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>카메라 접근 권한이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        ratio="16:9"
      />

      {/* 🎯 촬영 버튼 */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
          disabled={isDetecting}
        >
          <Text style={styles.captureText}>
            {isDetecting ? '분석 중...' : '촬영하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
    zIndex: 50,
  },
  captureButton: {
    backgroundColor: '#3886a8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  captureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
