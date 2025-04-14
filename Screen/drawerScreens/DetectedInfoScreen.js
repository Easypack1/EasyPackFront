// DetectedInfoScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DetectedInfoScreen = ({ route, navigation }) => {
  const { label, imageUri } = route.params;

  const getGuidanceText = (label) => {
    const l = label.toLowerCase();
    switch (l) {
      case 'bottle':
        return '이 물품은 액체류로 간주될 수 있습니다. 100ml 이하 용기에 담아 투명 지퍼백에 보관하세요.';
      case 'laptop':
        return '노트북은 보안 검색 시 별도로 꺼내 검사해야 합니다.';
      case 'suitcase':
      case 'backpack':
        return '기내 수하물 또는 위탁 수하물로 분류될 수 있으며 크기와 무게 제한을 확인하세요.';
      case 'phone':
        return '휴대폰은 전자기기로 기내 반입 가능하지만, 비행 중 모드 전환이 필요할 수 있습니다.';
      default:
        return '이 사물에 대한 구체적인 안내 정보가 없습니다. 공항 보안 요원의 지시에 따르세요.';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>감지된 사물: {label.toUpperCase()}</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.subtitle}>안내 사항</Text>
      <Text style={styles.guidance}>{getGuidanceText(label)}</Text>

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
