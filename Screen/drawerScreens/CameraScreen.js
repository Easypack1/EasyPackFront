import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
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
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('🧠 YOLO 감지 결과:', result);

      if (result.objects?.length > 0) {
        const objectNames = result.objects.map(obj => obj.label).join(', ');
        Alert.alert('감지된 물체', objectNames);
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
      const photo = await cameraRef.current.takePictureAsync();
      await sendToServer(photo.uri);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) {
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
      />

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
  },
});
