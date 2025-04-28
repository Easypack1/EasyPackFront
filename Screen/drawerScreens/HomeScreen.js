import React, { useEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, TouchableOpacity,
  TextInput, Image, StyleSheet, ActivityIndicator
} from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = "dc421962c7495a4d3ad76358390c896c";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('📡 fetchUserInfo() - token:', token);
      const response = await fetch('http://13.236.230.193:8082/api/auth/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('🏡 최신 사용자 정보:', data);
      setUserData(data);
    } catch (error) {
      console.error('❌ 사용자 정보 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserInfo(); 
    });
    return unsubscribe;
  }, [navigation]);

  const getWeather = async (destination) => {
    let cityName = '';
    switch (destination) {
      case 'vietnam': cityName = 'Hanoi'; break;
      case 'usa': cityName = 'New York'; break;
      case 'japan': cityName = 'Tokyo'; break;
      case 'thailand': cityName = 'Bangkok'; break;
      case 'philippines': cityName = 'Manila'; break;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== "200") throw new Error(data.message);

      setCity(data.city.name);
      const filteredList = data.list.filter(({ dt_txt }) =>
        dt_txt.endsWith("03:00:00")
      );
      setDays(filteredList);
    } catch (error) {
      console.error("🌦️ 날씨 정보 로딩 실패:", error);
    }
  };

  useEffect(() => {
    if (userData?.travelDestination) {
      getWeather(userData.travelDestination);
    }
  }, [userData]);

  const getBackgroundImage = () => {
    switch (userData?.travelDestination) {
      case 'vietnam': return require('../../Image/vietnam.jpeg');
      case 'usa': return require('../../Image/usa.jpeg');
      case 'japan': return require('../../Image/japan.jpeg');
      case 'thailand': return require('../../Image/thailand.jpeg');
      case 'philippines': return require('../../Image/philippines.jpeg');
      default: return require('../../Image/default.jpeg'); // 혹시 null 대비
    }
  };

  const menuItems = [
    { id: '1', label: '물품촬영', icon: require('../../Image/camera.png'), route: 'CameraScreenStack' },
    { id: '2', label: '커뮤니티', icon: require('../../Image/community.png'), route: 'CommunityScreenStack' },
    { id: '3', label: '수하물 정보', icon: require('../../Image/info.png'), route: 'InfoScreenStack' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.topRightImageContainer}
        onPress={() => navigation.navigate('SettingsScreenStack')}>
        <Image source={require('../../Image/usericon.png')} style={styles.topRightImage} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.easyText}>Easy</Text>
          <Text style={styles.packText}>Pack</Text>
        </Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="검색어 입력"
            placeholderTextColor="#999"
          />
          <Image source={require('../../Image/search.png')} style={styles.searchIcon} />
        </View>

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonWhite]}
          onPress={() => navigation.navigate('AirlineInfoScreenStack', {
            airline: userData?.airline || null,
          })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTextGrey}>나의 항공사 규정 확인하러 가기</Text>
            <Image source={require('../../Image/point.png')} style={styles.buttonImage} />
          </View>
        </TouchableOpacity>

        <View style={styles.imageBox}>
          <Image source={getBackgroundImage()} style={styles.backgroundImage} />
        </View>
      </View>

      <View style={styles.weatherContainer}>
        <Text style={styles.weatherTitle}>{city}</Text>
        {days.length === 0 ? (
          <ActivityIndicator color="black" style={{ marginLeft: 10 }} size="large" />
        ) : (
          <View style={styles.day}>
            <Fontisto name={icons[days[0].weather[0].main]} size={25} color="black" />
            <Text style={styles.temp}>{parseFloat(days[0].main.temp).toFixed(1)}°</Text>
            <Text style={styles.description}>{days[0].weather[0].main}</Text>
            <Text style={styles.tinyText}>{days[0].weather[0].description}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // (styles는 그대로)
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  content: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  easyText: { color: 'skyblue', fontSize: 32, fontWeight: 'bold' },
  packText: { color: 'black', fontSize: 32, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', width: '90%',
    borderColor: '#ccc', borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 12, marginBottom: 20,
  },
  searchBox: { flex: 1, height: 40, fontSize: 16 },
  searchIcon: { width: 20, height: 20 },
  menuContainer: {
    flexDirection: 'row', justifyContent: 'space-around',
    width: '100%', marginBottom: 25,
  },
  menuItem: { alignItems: 'center' },
  icon: { width: 50, height: 50, marginBottom: 8 },
  menuText: { fontSize: 16, color: '#333' },
  weatherContainer: {
    marginTop: 10, width: '100%', flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  weatherTitle: { fontSize: 15, fontWeight: 'bold', marginRight: 10 },
  day: { flexDirection: 'row', alignItems: 'center' },
  temp: { fontWeight: '600', fontSize: 20, color: 'black', marginLeft: 10 },
  description: { fontSize: 15, color: 'black', fontWeight: '500', marginLeft: 10 },
  tinyText: { fontSize: 10, color: 'black', fontWeight: '500', marginLeft: 5 },
  buttonContainer: { alignItems: 'center', width: '100%' },
  button: {
    padding: 15, borderRadius: 12, width: '85%',
    marginBottom: 20, alignItems: 'center',
  },
  buttonWhite: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ccc' },
  buttonContent: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', width: '100%',
  },
  buttonTextGrey: { color: '#555', fontSize: 16, fontWeight: 'bold' },
  buttonImage: { width: 20, height: 20 },
  topRightImageContainer: { position: 'absolute', top: 10, right: 10 },
  topRightImage: { width: 40, height: 40 },
  imageBox: {
    width: '85%', height: 280, borderRadius: 12,
    marginBottom: 20, overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%', height: '100%',
    resizeMode: 'cover',
  },
});

export default HomeScreen;
