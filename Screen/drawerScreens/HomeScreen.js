import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.topRightImageContainer}>
        <Image source={require('../../Image/usericon.png')} style={styles.topRightImage} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.easyText}>Easy</Text>
          <Text style={styles.packText}>Pack</Text>
        </Text>

        {/* 🔹 검색 박스 안에 search.png 아이콘 추가 */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchBox} placeholder="검색어 입력" />
          <Image source={require('../../Image/search.png')} style={styles.searchIcon} />
        </View>

        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <Image source={require('../../Image/camera.png')} style={styles.icon1} />
            <Text style={styles.menuText}>물품촬영</Text>
          </View>
          <View style={styles.menuItem}>
            <Image source={require('../../Image/community.png')} style={styles.icon2} />
            <Text style={styles.menuText}>커뮤니티</Text>
          </View>
          <View style={styles.menuItem}>
            <Image source={require('../../Image/info.png')} style={styles.icon3} />
            <Text style={styles.menuText}>수하물 정보</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
         
          <TouchableOpacity style={styles.button1}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText1}>나의 항공사 규정 확인하러 가기</Text>
              <Image source={require('../../Image/point.png')} style={styles.buttonImage} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button2}>
            <Text style={styles.buttonText2}>여행지 사진</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button3}>
            <Text style={styles.buttonText3}>여행지 날씨</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  easyText: {
    color: 'skyblue',
    fontSize: 30,
    fontWeight: 'bold',
  },
  packText: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },

 
  searchContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    position: 'relative', 
  },


  searchBox: {
  
    flex: 1, 
    height: 40,
    paddingLeft: 10,
  },

  
  searchIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 10, 
  },

  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  menuItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  icon1: { width: 50, height: 50, marginBottom: 5 },
  icon2: { width: 50, height: 50, marginBottom: 5 },
  icon3: { width: 50, height: 50, marginBottom: 5 },
  menuText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },

  button1: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    width: '80%',
    height: 50,
    marginBottom: 20,
  },
  button2: {
    backgroundColor: '#c8d7eb',
    padding: 15,
    borderRadius: 15,
    width: '85%',
    height: 250,
    marginBottom: 20,
  },
  button3: {
    backgroundColor: '#c8d7eb',
    padding: 15,
    borderRadius: 15,
    width: '85%',
    height: 100,
    marginBottom: 20,
  },

  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%',
  },

  buttonText1: {
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 10, 
  },
  

  
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 10, 
  },

  buttonText2: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText3: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  
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
