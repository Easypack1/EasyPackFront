import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const WriteScreen = () => {
  const [text, setText] = useState('');
  const navigation = useNavigation(); // 네비게이션 사용

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('CommunityScreenStack')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>여행기를 작성해주세요</Text>
      </View>

      {/* 글쓰기 입력 박스 */}
      <TextInput
        style={styles.inputBox}
        multiline
        placeholder="여행 경험을 자유롭게 작성하세요!"
        value={text}
        onChangeText={setText}
      />

      {/* 사진 첨부하기 버튼 */}
      <TouchableOpacity style={styles.photoButton}>
        <Ionicons name="camera" size={20} color="#000000" style={styles.icon} />
        <Text style={styles.photoButtonText}>사진 첨부하기</Text>
      </TouchableOpacity>

      {/* 제출 버튼 */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>제출</Text>
      </TouchableOpacity>

      {/* 별점 리뷰 남기기 */}
      <TouchableOpacity onPress={() => navigation.navigate('ReviewScreen')}>
        <Text style={styles.starReviewText}>간편하게 별점 리뷰 남기러가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10, // 아이콘과 간격 조정
  },
  inputBox: {
    height: 350, 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  photoButton: {
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 정렬
    backgroundColor: '#D3D3D3', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  icon: {
    marginRight: 8, // 아이콘과 텍스트 간격 조정
  },
  photoButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  starReviewText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default WriteScreen;
