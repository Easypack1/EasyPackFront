import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  // 🔥 특정 도시 이름 설정 (예: 도쿄)
  const TARGET_CITY = "Seoul"; 

  const getWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${TARGET_CITY}&appid=${API_KEY}&units=metric`
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

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="black"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}°
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={30} // 아이콘 크기 조금 줄임
                  color="black"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
    padding: 20, // 여백 추가로 레이아웃 밀리지 않도록
  },
  city: {
    flex: 0.5,  // city 부분의 비율을 줄여서 공간을 절약
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,  // 아래 요소와 간격 조정
  },
  cityName: {
    fontSize: 24, // 글자 크기 적절히 조정
    fontWeight: "500",
    color: "black",
  },
  weather: {
    paddingBottom: 20, // 전체 날씨 정보 아래에 여백 추가
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 30, // 날씨 카드 하단에 여백 추가
  },
  temp: {
    marginTop: 20, // 위쪽 여백
    fontWeight: "600",
    fontSize: 35,  // 글자 크기 조정
    color: "black",
  },
  description: {
    marginTop: 5,
    fontSize: 18,  // 글자 크기 조정
    color: "black",
    fontWeight: "500",
  },
  tinyText: {
    marginTop: 5,
    fontSize: 14,  // 글자 크기 조정
    color: "black",
    fontWeight: "500",
  },
});








