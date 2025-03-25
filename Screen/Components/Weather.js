import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

const useWeather = () => {
  const [weather, setWeather] = useState(null);

  const fetchWeather = async (location) => {
    if (!location) {
      alert("여행지를 입력해주세요!");
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=3243e2c8255daabd18e2a71355b860bf`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        alert("해당 지역의 날씨 정보를 찾을 수 없습니다.");
        return;
      }

      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return { weather, fetchWeather };
};

const Weather = () => {
  const { weather, fetchWeather } = useWeather();

  const handleFetchWeather = (location) => {
    fetchWeather(location);
  };

  return (
    <View style={styles.container}>
      <Button title="일본 (도쿄) 날씨" onPress={() => handleFetchWeather('Tokyo, Japan')} />
      <Button title="중국 (베이징) 날씨" onPress={() => handleFetchWeather('Beijing, China')} />
      <Button title="베트남 (하노이) 날씨" onPress={() => handleFetchWeather('Hanoi, Vietnam')} />
      <Button title="태국 (방콕) 날씨" onPress={() => handleFetchWeather('Bangkok, Thailand')} />
      <Button title="싱가포르 날씨" onPress={() => handleFetchWeather('Singapore')} />

      {weather ? (
        <View style={styles.weatherInfo}>
          <Text style={styles.title}>날씨 정보</Text>
          <Text>도시: {weather.name}</Text>
          <Text>기온: {(weather.main.temp - 273.15).toFixed(2)}°C</Text>
          <Text>날씨: {weather.weather[0].description}</Text>
        </View>
      ) : (
        <Text>날씨 정보를 불러오려면 버튼을 눌러주세요.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Weather;




