import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  // ✅ 메뉴 아이템 배열 → map으로 렌더링 처리
  const menuItems = [
    {
      id: '1',
      label: '물품촬영',
      icon: require('../../Image/camera.png'),
      route: 'CameraScreenStack',
    },
    {
      id: '2',
      label: '커뮤니티',
      icon: require('../../Image/community.png'),
      route: 'CommunityScreenStack',
    },
    {
      id: '3',
      label: '수하물 정보',
      icon: require('../../Image/info.png'),
      route: 'InfoScreenStack',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 상단 프로필 아이콘 */}
      <View style={styles.topRightImageContainer}>
        <Image source={require('../../Image/usericon.png')} style={styles.topRightImage} />
      </View>

      {/* 🔹 제목 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.easyText}>Easy</Text>
          <Text style={styles.packText}>Pack</Text>
        </Text>

        {/* 🔹 검색 박스 */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchBox}
            placeholder="검색어 입력"
            placeholderTextColor="#999"
          />
          <Image source={require('../../Image/search.png')} style={styles.searchIcon} />
        </View>

        {/* 🔹 메뉴 버튼 → map()으로 반복 렌더링 */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔹 추가 버튼 */}
        <View style={styles.buttonContainer}>
          {/* ✅ 나의 항공사 규정 버튼 */}
          <TouchableOpacity style={[styles.button, styles.buttonWhite]}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTextGrey}>나의 항공사 규정 확인하러 가기</Text>
              <Image source={require('../../Image/point.png')} style={styles.buttonImage} />
            </View>
          </TouchableOpacity>
          
          {/* ✅ 여행지 사진 버튼 */}
          <TouchableOpacity style={[styles.button, styles.buttonBlue]}>
            <Text style={styles.buttonTextBlack}>여행지 사진</Text>
          </TouchableOpacity>

          {/* ✅ 여행지 날씨 버튼 */}
          <TouchableOpacity 
            style={[styles.button, styles.buttonBlue, styles.smallButton]}
            onPress={() => navigation.navigate('Weather')}  // 여행지 날씨 화면으로 이동
          >
            <Text style={styles.buttonTextBlack}>여행지 날씨</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ✅ 스타일 정리 및 통일성 적용
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  easyText: {
    color: 'skyblue',
    fontSize: 32,
    fontWeight: 'bold',
  },
  packText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },

  // 🔹 검색 박스
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },

  // 🔹 메뉴 버튼
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  menuItem: {
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },

  // 🔹 버튼 공통 스타일
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 12,
    width: '85%',
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonWhite: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonBlue: {
    backgroundColor: '#c8d7eb',
  },
  smallButton: {
    height: 50,
  },

  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  buttonTextGrey: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextBlack: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonImage: {
    width: 20,
    height: 20,
  },

  // 🔹 상단 유저 프로필 아이콘
  topRightImageContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  topRightImage: {
    width: 40,
    height: 40,
  },
});

export default HomeScreen;

