import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionFailed, setDetectionFailed] = useState(false);
  const [manualLabel, setManualLabel] = useState('');
  const cameraRef = useRef(null);

  const API_URL = 'http://13.236.230.193:8000/predict';

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setCameraType(Camera?.Constants?.Type?.back ?? 0);
    })();
  }, []);

  const getUserInfo = async () => {
    const travelDestination = await AsyncStorage.getItem('travelDestination');
    const airline = await AsyncStorage.getItem('airline');
    return { travelDestination: travelDestination || 'unknown', airline: airline || 'unknown' };
  };

  const handleImageDetection = async (photoUri) => {
    const { travelDestination, airline } = await getUserInfo();

    console.log('📤 서버 전송값 (자동 감지):', {
      country: travelDestination,
      airline,
      item_name: '',
    });

    const formData = new FormData();
    formData.append('file', { uri: photoUri, name: 'photo.jpg', type: 'image/jpeg' });
    formData.append('country', travelDestination);
    formData.append('airline', airline);
    formData.append('item_name', '');

    setIsDetecting(true);
    setDetectionFailed(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('🧠 YOLO 감지 결과:', result);

      if (result.detections?.length > 0) {
        const topResult = result.detections[0];
        console.log('📌 감지된 label:', topResult.label);
        console.log('📌 감지된 category:', topResult.category);
        console.log('📌 감지된 description:', topResult.description);

        navigation.navigate('DetectedInfoScreen', {
          label: topResult.label,
          description: topResult.description || '안내 정보가 없습니다.',
          imageUri: photoUri,
        });
      } else {
        setDetectionFailed(true);
      }
    } catch (err) {
      console.error('❌ YOLO 요청 오류:', err);
      Alert.alert('서버 오류', '감지 정보를 가져오는 데 실패했습니다.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) {
      return Alert.alert('카메라 준비 중입니다.');
    }

    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('📸 촬영된 사진:', photo);
      if (photo?.uri) await handleImageDetection(photo.uri);
    } catch (error) {
      Alert.alert('촬영 오류', '사진을 찍는 중 문제가 발생했습니다.');
    }
  };

const handleManualSubmit = async () => {
  if (!manualLabel.trim()) {
    return Alert.alert('입력 오류', '물품 이름을 입력해주세요.');
  }

  const { travelDestination, airline } = await getUserInfo();

  console.log('📤 서버 전송값 (수동 입력):', {
    country: travelDestination,
    airline,
    item_name: manualLabel.trim(),
  });

  const formData = new FormData();
  formData.append('country', travelDestination);
  formData.append('airline', airline);
  formData.append('item_name', manualLabel.trim());

  setIsDetecting(true);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('🧠 수동입력 결과:', result);

    if (result.detections?.length > 0) {
      const topResult = result.detections[0];

      // ✅ label은 직접 입력한 item_name 값으로 지정
      navigation.navigate('DetectedInfoScreen', {
        label: manualLabel.trim(),
        description: topResult.description || '안내 정보가 없습니다.',
        imageUri: null,
      });
    } else {
      Alert.alert('결과 없음', '해당 물품에 대한 규정을 찾을 수 없습니다.');
    }
  } catch (err) {
    Alert.alert('서버 오류', '정보를 불러올 수 없습니다.');
  } finally {
    setIsDetecting(false);
    setDetectionFailed(false);
    setManualLabel('');
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

      {!detectionFailed ? (
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
      ) : (
        <View style={styles.manualInputArea}>
          <Text style={styles.manualPrompt}>감지 실패: 직접 입력해주세요</Text>
          <TextInput
            style={styles.textInput}
            placeholder="예: 칫솔, 노트북"
            placeholderTextColor="#ccc"
            value={manualLabel}
            onChangeText={setManualLabel}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleManualSubmit}>
            <Text style={styles.submitButtonText}>제출하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setDetectionFailed(false);
              setManualLabel('');
            }}
          >
            <Text style={styles.retryText}>🔄 재촬영</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
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
  manualInputArea: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 60,
  },
  manualPrompt: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
  },
  textInput: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3886a8',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#ff6666',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
