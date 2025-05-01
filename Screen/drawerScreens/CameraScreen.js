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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('📷 카메라 권한 상태:', status);
      setHasPermission(status === 'granted');
      setCameraType(Camera?.Constants?.Type?.back ?? 0);
    })();
  }, []);

  const sendToServer = async (photoUri) => {
    const destination = await AsyncStorage.getItem('travelDestination');
    const airline = await AsyncStorage.getItem('airline');

    console.log('📤 AsyncStorage에서 로딩된 값 →', { destination, airline });

    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      setIsDetecting(true);
      setDetectionFailed(false);

      const response = await fetch('http://13.236.230.193:8000/predict', {
        method: 'POST',
        headers: {
          'x-country': destination || 'unknown',
          'x-airline': airline || 'unknown',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('🧠 YOLO 감지 결과 JSON:', result);

      if (result.detections?.length > 0) {
        const detected = result.detections[0];
        navigation.navigate('DetectedInfoScreen', {
          label: detected.label,
          description: detected.description || '안내 정보가 없습니다.',
          imageUri: photoUri,
        });
      } else {
        setDetectionFailed(true);
      }
    } catch (err) {
      console.error('❌ 서버 요청 오류:', err);
      Alert.alert('서버 오류', '감지 정보를 가져오는 데 실패했습니다.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) {
      Alert.alert('카메라 준비 중');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('📸 촬영된 사진:', photo);
      if (photo?.uri) await sendToServer(photo.uri);
    } catch (error) {
      console.error('📷 촬영 오류:', error);
      Alert.alert('촬영 중 오류 발생');
    }
  };

  const handleManualSubmit = async () => {
    if (!manualLabel.trim()) {
      Alert.alert('입력 오류', '물품 이름을 입력해주세요.');
      return;
    }

    try {
      setIsDetecting(true);

      const destination = await AsyncStorage.getItem('travelDestination');
      const airline = await AsyncStorage.getItem('airline');

      const response = await fetch('http://13.236.230.193:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-country': destination || 'unknown',
          'x-airline': airline || 'unknown',
        },
        body: JSON.stringify({
          label: manualLabel.trim(),
          imageUrl: null,
          detectedAt: new Date().toISOString(),
        }),
      });

      const result = await response.json();
      console.log('🧠 수동 입력 결과:', result);

      navigation.navigate('DetectedInfoScreen', {
        label: manualLabel.trim(),
        description: result.description || result.guidance || '안내 정보가 없습니다.',
        imageUri: null,
      });
    } catch (err) {
      console.error('❌ 수동 입력 서버 오류:', err);
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

      {!detectionFailed && (
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
      )}

      {detectionFailed && (
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
