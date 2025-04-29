import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const airlineLogos = {
  대한항공: require('../../Image/koreanAir.png'),
  아시아나항공: require('../../Image/asiana.png'),
  티웨이항공: require('../../Image/tway.png'),
  제주항공: require('../../Image/jeju.png'),
  진에어항공: require('../../Image/jinair.png'),
};

const AirlineInfoScreen = () => {
  const [userData, setUserData] = useState(null);
  const [overweightKg, setOverweightKg] = useState('');
  const [targetFee, setTargetFee] = useState(0);
  const animatedFee = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch('http://13.236.230.193:8082/api/auth/user/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('❌ 사용자 정보 불러오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const airline = userData?.airline || null;

  const getAirlineRules = (airlineName) => {
    switch (airlineName) {
      case '대한항공':
        return '• 위탁 수하물: 23kg까지 무료 (1개)\n• 기내 수하물: 12kg까지 가능';
      case '아시아나항공':
        return '• 위탁 수하물: 23kg까지 무료 (1개)\n• 기내 수하물: 10kg까지 가능';
      case '티웨이항공':
        return '• 위탁 수하물: 15~20kg까지 무료 (노선에 따라 다름)\n• 기내 수하물: 10kg까지 가능';
      case '제주항공':
        return '• 위탁 수하물: 15kg까지 무료\n• 기내 수하물: 10kg까지 가능';
      case '진에어항공':
        return '• 위탁 수하물: 15~20kg까지 무료 (국내선/국제선 상이)\n• 기내 수하물: 10kg까지 가능';
      default:
        return '항공사 규정 정보를 찾을 수 없습니다.';
    }
  };

  const getOverweightChargePerKg = (airlineName) => {
    switch (airlineName) {
      case '대한항공':
      case '아시아나항공':
      case '티웨이항공':
        return 10000;
      case '제주항공':
      case '진에어항공':
        return 2000;
      default:
        return 0;
    }
  };

  const handleCalculate = () => {
    const kg = parseFloat(overweightKg);
    if (isNaN(kg) || kg <= 0) {
      Alert.alert('⚠️ 숫자를 정확히 입력해 주세요.');
      return;
    }
    const feePerKg = getOverweightChargePerKg(airline);
    const totalFee = kg * feePerKg;
    setTargetFee(totalFee);

    // 애니메이션 초기화 및 시작
    animatedFee.setValue(0);
    cardOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(animatedFee, {
        toValue: totalFee,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {airline ? (
        <>
          <View style={styles.header}>
            {airlineLogos[airline] && (
              <Image source={airlineLogos[airline]} style={styles.logo} resizeMode="contain" />
            )}
            <Text style={styles.airlineName}>{airline}</Text>
          </View>

          <View style={styles.ruleBox}>
            <Text style={styles.ruleTitle}>✅ 수하물 규정</Text>
            <Text style={styles.ruleContent}>{getAirlineRules(airline)}</Text>
          </View>

          <View style={styles.ruleBox}>
            <Text style={styles.ruleTitle}>⚖️ 초과 무게 요금 계산기</Text>
            <TextInput
              style={styles.input}
              placeholder="초과 무게를 입력하세요 (kg)"
              keyboardType="numeric"
              value={overweightKg}
              onChangeText={setOverweightKg}
            />
            <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
              <Text style={styles.calcButtonText}>요금 계산하기</Text>
            </TouchableOpacity>

            {targetFee !== 0 && (
              <Animated.View style={[styles.resultCard, { opacity: cardOpacity }]}>
                <Text style={styles.resultTitle}>💰 예상 추가 요금</Text>
                <Text style={styles.resultFee}>
                  {targetFee.toLocaleString()}원
                </Text>
              </Animated.View>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.noAirlineText}>항공사 정보가 없습니다.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 120, height: 80, marginBottom: 10 },
  airlineName: { fontSize: 26, fontWeight: 'bold', color: '#0077b6' },
  ruleBox: {
    backgroundColor: '#ffffff', padding: 25,
    borderRadius: 15, width: '90%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
    alignItems: 'center', marginBottom: 20,
  },
  ruleTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#00796b' },
  ruleContent: { fontSize: 17, textAlign: 'center', color: '#333', lineHeight: 24 },
  noAirlineText: { fontSize: 20, color: 'gray' },
  input: {
    width: '100%', height: 45, borderColor: '#ccc', borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginTop: 10,
    marginBottom: 10,
  },
  calcButton: {
    backgroundColor: '#0077b6', paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 10,
  },
  calcButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  resultCard: {
    marginTop: 15, backgroundColor: '#e0f7fa',
    padding: 20, borderRadius: 15, alignItems: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  resultTitle: { fontSize: 20, color: '#00796b', marginBottom: 10, fontWeight: 'bold' },
  resultFee: { fontSize: 28, fontWeight: 'bold', color: '#d32f2f' },
});

export default AirlineInfoScreen;
