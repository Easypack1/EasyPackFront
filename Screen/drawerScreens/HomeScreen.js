import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';

const API_KEY = "dc421962c7495a4d3ad76358390c896c"; // 여기에 본인의 API 키 입력

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const HomeScreen = ({ route, navigation }) => {
  const {
    travelDestination,
    userData = {},  // userData가 undefined일 경우를 대비해 기본값 설정
    token, 
  } = route.params || {};
  
  const {
    userId,
    password,
    nickname,
    airline,
  } = userData;
  
  useEffect(() => {
    console.log('🏡 받은 사용자 정보:', {
      userId,
      password,
      nickname,
      travelDestination,
      airline,
      token,
    });
  }, []);

  // ✅ 여행지에 맞는 배경 이미지 가져오기
  const getBackgroundImage = () => {
    switch (travelDestination) {
      case 'vietnam': return require('../../Image/vietnam.jpeg');
      case 'usa': return require('../../Image/usa.jpeg');
      case 'japan': return require('../../Image/japan.jpeg');
      case 'thailand': return require('../../Image/thailand.jpeg');
      case 'philippines': return require('../../Image/philippines.jpeg');
    
    }
  };

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

  // 날씨 상태와 데이터를 관리하는 상태 변수
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  // 날씨 정보 가져오는 함수
  const getWeather = async () => {
    let cityName='';
     // travelDestination 값에 따라 cityName 설정
  switch (travelDestination) {
    case 'vietnam':
      cityName = 'Hanoi'; break;
    case 'usa':
      cityName = 'New York'; break;
    case 'japan':
      cityName = 'Tokyo'; break;
    case 'thailand':
      cityName = 'Bangkok'; break;
    case 'philippines':
      cityName = 'Manila'; break;
  }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== "200") {
        throw new Error(data.message);
      }

      setCity(data.city.name);
      // 하루에 여러 번 데이터가 있는데 오전 3시 기준 데이터만 필터링
      const filteredList = data.list.filter(({ dt_txt }) =>
        dt_txt.endsWith("03:00:00")
      );
      setDays(filteredList);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // 컴포넌트가 처음 렌더링 될 때 날씨 정보를 가져옴
  useEffect(() => {
    if(travelDestination){
    getWeather();
    }
  }, [travelDestination]);

  return (
    <SafeAreaView style={styles.container}>
  <TouchableOpacity 
    style={styles.topRightImageContainer} 
    onPress={() =>
    navigation.navigate('SettingsScreenStack', {
      userData: userData, // ✅ 전달 추가
      token: token, // ✅ 반드시 같이 넘기기
    })
  }
>
  <Image source={require('../../Image/usericon.png')} style={styles.topRightImage} />
</TouchableOpacity>

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
        
        {/* ✅ 여행지 사진을 이미지가 꽉 차게 들어가도록 변경 */}
        <View style={styles.imageBox}>
          <Image 
            source={getBackgroundImage()} // 동적으로 선택된 국가 이미지
            style={styles.backgroundImage} // 이미지 스타일링 추가
          />
        </View>

      </View>

      {/* 🔹 여행지 날씨 바로 아래 렌더링 */}
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherTitle}>{city}</Text>
        {days.length === 0 ? (
          <ActivityIndicator color="black" style={{ marginLeft: 10 }} size="large" />
        ) : (
          <View style={styles.day}>
            <Fontisto
              name={icons[days[0].weather[0].main]}
              size={25}
              color="black"
            />
            <Text style={styles.temp}>
              {parseFloat(days[0].main.temp).toFixed(1)}°
            </Text>
            <Text style={styles.description}>{days[0].weather[0].main}</Text>
            <Text style={styles.tinyText}>{days[0].weather[0].description}</Text>
          </View>
        )}
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

  // 🔹 날씨 섹션
  weatherContainer: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row', // 수평 정렬
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center',
  },
  weatherTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10, // 날씨 데이터와 간격 조정
  },
  day: {
    flexDirection: 'row', // 한 줄 정렬
    alignItems: 'center',
  },
  temp: {
    fontWeight: '600',
    fontSize: 20,
    color: 'black',
    marginLeft: 10, // 아이콘과 간격
  },
  description: {
    fontSize: 15, // 크기 줄임
    color: 'black',
    fontWeight: '500',
    marginLeft: 10, // 온도와 간격
  },
  tinyText: {
    fontSize: 10,
    color: 'black',
    fontWeight: '500',
    marginLeft: 5, // 설명과 간격 조정
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

  // 🔹 여행지 사진 박스 스타일
  imageBox: {
    width: '85%',  // 박스 너비
    height: 270,  // 박스 높이를 설정 (원하는 크기로 조정 가능)
    borderRadius: 12,  // 모서리 둥글게
    marginBottom: 20,  // 하단 여백
    overflow: 'hidden',  // 이미지가 박스를 벗어나지 않도록
  },
  backgroundImage: {
    width: '100%',  // 이미지가 박스 크기에 맞게
    height: '100%',  // 이미지가 박스 크기에 맞게
    resizeMode: 'cover',  // 이미지가 박스를 꽉 채우도록
  },
});

export default HomeScreen;
