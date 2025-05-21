import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const countryList = ['일본', '미국', '베트남', '필리핀', '태국'];

const ReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 선택한 나라가 파라미터로 넘어오면 받음 (없으면 null)
  const initialCountry = route.params?.country || null;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  const handleSubmit = async () => {
    if (!selectedCountry) {
      Alert.alert('알림', '나라를 선택해주세요!');
      return;
    }
    if (review.trim() === '') {
      Alert.alert('알림', '리뷰를 작성해주세요!');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      country: selectedCountry,
      rating,
      review,
      date: new Date().toISOString(),
    };

    try {
      const storedReviews = await AsyncStorage.getItem('reviews');
      const parsedReviews = storedReviews ? JSON.parse(storedReviews) : [];
      const updatedReviews = [...parsedReviews, newReview];
      await AsyncStorage.setItem('reviews', JSON.stringify(updatedReviews));
      Alert.alert('성공', '리뷰가 저장되었습니다!');

      // 저장 후 해당 나라 게시판으로 이동
      switch (selectedCountry) {
        case '일본':
          navigation.navigate('JapanBoardStack');
          break;
        case '미국':
          navigation.navigate('USABoardStack');
          break;
        case '베트남':
          navigation.navigate('VietnamBoardStack');
          break;
        case '필리핀':
          navigation.navigate('PhilippinesBoardStack');
          break;
        case '태국':
          navigation.navigate('ThailandBoardStack');
          break;
        default:
          navigation.goBack();
          break;
      }
    } catch (error) {
      console.error('리뷰 저장 중 오류:', error);
      Alert.alert('오류', '리뷰 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>여행기를 작성해주세요</Text>
          </View>

          <View style={styles.countryListContainer}>
            {countryList.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.countryButton,
                  selectedCountry === item && styles.activeCountry,
                ]}
                onPress={() => setSelectedCountry(item)}
              >
                <Text
                  style={[
                    styles.countryText,
                    selectedCountry === item && styles.activeCountryText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={rating >= star ? 'star' : 'star-outline'}
                  size={28}
                  color={rating >= star ? '#FFD700' : '#CCCCCC'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.inputBox}
            multiline
            placeholder="여행기록을 남겨보세요!"
            placeholderTextColor="#999"
            value={review}
            onChangeText={setReview}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>제출</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerText: { marginLeft: 10, fontSize: 20, fontWeight: 'bold' },
  countryListContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  countryButton: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#eee',
    marginHorizontal: 4,
    marginVertical: 4,
    marginTop: 20,
  },
  activeCountry: { backgroundColor: '#007AFF' },
  countryText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  activeCountryText: { color: '#fff' },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  inputBox: {
    height: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    textAlignVertical: 'top',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ReviewScreen;
