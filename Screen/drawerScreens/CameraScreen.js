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

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        setCameraType(Camera?.Constants?.Type?.back ?? 0);
      } else {
        setHasPermission(false);
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
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('🧠 YOLO 감지 결과:', result);

      // ✅ 변경된 키: result.detections
      if (result.detections?.length > 0) {
        setDetectedObjects(result.detections);

        const firstObject = result.detections[0];
        const label = firstObject.label;

        navigation.navigate('DetectedInfoScreen', {
          label,
          imageUri: photoUri,
        });
      } else {
        setDetectedObjects([]);
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

      {/* 🔲 감지된 박스 오버레이 */}
      <View style={styles.overlay}>
        {detectedObjects.map((obj, idx) => {
          const [x, y, w, h] = obj.bbox;
          return (
            <View
              key={idx}
              style={[
                styles.bbox,
                {
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  width: `${w * 100}%`,
                  height: `${h * 100}%`,
                },
              ]}
            >
              <Text style={styles.bboxLabel}>{obj.label.toUpperCase()}</Text>
            </View>
          );
        })}
      </View>

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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  bbox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    zIndex: 20,
  },
  bboxLabel: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 4,
    position: 'absolute',
    top: -18,
    left: 0,
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
