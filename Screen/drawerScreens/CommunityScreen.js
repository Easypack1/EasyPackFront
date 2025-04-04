import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const countryList = ['일본', '미국', '베트남', '필리핀', '태국'];

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('전체');
  const [sorted, setSorted] = useState(false);

  // 🔹 AsyncStorage에서 리뷰 데이터 불러오기
  useFocusEffect(
    React.useCallback(() => {
      const loadReviews = async () => {
        const storedReviews = await AsyncStorage.getItem('reviews');
        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        }
      };
      loadReviews();
    }, [])
  );

  // 🔥 리뷰 삭제 함수
  const deleteReview = async (id) => {
    Alert.alert(
      '삭제 확인',
      '이 리뷰를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          onPress: async () => {
            const updatedReviews = reviews.filter((review) => review.id !== id);
            setReviews(updatedReviews);
            await AsyncStorage.setItem('reviews', JSON.stringify(updatedReviews));
          },
        },
      ],
      { cancelable: true }
    );
  };

  // ⭐ 별점순 정렬
  const toggleSort = () => {
    const sortedReviews = [...reviews].sort((a, b) => (sorted ? a.rating - b.rating : b.rating - a.rating));
    setReviews(sortedReviews);
    setSorted(!sorted);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>커뮤니티</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReviewScreenStack')}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* 필터 & 정렬 버튼 */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={['전체', ...countryList]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, selectedCountry === item && styles.activeFilter]}
              onPress={() => setSelectedCountry(item)}
            >
              <Text style={styles.filterText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
          <Text style={styles.sortText}>{sorted ? '낮은 별점순' : '높은 별점순'}</Text>
        </TouchableOpacity>
      </View>

      {/* 리뷰 목록 */}
      <FlatList
        data={reviews.filter((review) => selectedCountry === '전체' || review.country === selectedCountry)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.rating}>⭐ {item.rating}점</Text>
              <TouchableOpacity onPress={() => deleteReview(item.id)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={styles.reviewText}>{item.review}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>작성된 여행기가 없습니다.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#007AFF',
  },
  sortText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewItem: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: { fontSize: 16, fontWeight: 'bold' },
  reviewText: { fontSize: 14, marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' },
});

export default CommunityScreen;
