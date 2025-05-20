import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  // 추가

const JapanBoard = () => {
  const [reviews, setReviews] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadJapanReviews = async () => {
        const storedReviews = await AsyncStorage.getItem('reviews');
        if (storedReviews) {
          const parsedReviews = JSON.parse(storedReviews);
          const japanReviews = parsedReviews.filter((r) => r.country === '일본');
          setReviews(japanReviews);
        } else {
          setReviews([]); // 저장된 리뷰가 없으면 빈 배열로 초기화
        }
      };

      loadJapanReviews();
    }, []) // 빈 배열이라도 괜찮아요, 화면 포커스될 때마다 실행됨
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>일본 게시판</Text>
      {reviews.length === 0 ? (
        <Text style={styles.noPosts}>게시글이 없습니다.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <Text style={styles.reviewText}>⭐ {item.rating}점</Text>
              <Text style={styles.reviewText}>{item.review}</Text>
              <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  noPosts: { fontSize: 16, color: '#999', marginTop: 50, textAlign: 'center' },
  postItem: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 },
  reviewText: { fontSize: 16 },
  dateText: { fontSize: 12, color: '#666', marginTop: 5 },
});

export default JapanBoard;
