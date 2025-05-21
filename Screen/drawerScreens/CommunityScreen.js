import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect, CurrentRenderContext } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const countryList = ['일본', '미국', '베트남', '필리핀', '태국'];

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [latestPosts, setLatestPosts] = useState({});
  const [popularPosts, setPopularPosts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadReviews = async () => {
        const storedReviews = await AsyncStorage.getItem('reviews');
        if (storedReviews) {
          const reviews = JSON.parse(storedReviews);
          const grouped = {};

          countryList.forEach((country) => {
            const filtered = reviews
              .filter((r) => r.country === country)
              .sort((a, b) => new Date(b.date) - new Date(a.date));
            if (filtered.length > 0) {
              grouped[country] = filtered[0];
            }
          });

          const popular = reviews.filter(
            (r) => (r.likes || 0) >= 5 || (r.comments?.length || 0) >= 5
          );
          popular.sort((a, b) => {
            const aScore = (a.likes || 0) + (a.comments?.length || 0);
            const bScore = (b.likes || 0) + (b.comments?.length || 0);
            return bScore - aScore;
          });

          setLatestPosts(grouped);
          setPopularPosts(popular.slice(0, 5));
        }
      };
      loadReviews();
    }, [])
  );

  const handleBoardPress = (country) => {
    const routes = {
      일본: 'JapanBoardStack',
      미국: 'USABoardStack',
      베트남: 'VietnamBoardStack',
      필리핀: 'PhilippinesBoardStack',
      태국: 'ThailandBoardStack',
    };
    navigation.navigate(routes[country]);
  };

  const handlePostPress = (post) => {
    navigation.navigate('PostDetailScreen', { post });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
      </View>

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>🎒여행기</Text>
      </View>

      <View style={styles.boardListContainer}>
        {countryList.map((country) => (
          <TouchableOpacity
            key={country}
            onPress={() => handleBoardPress(country)}
            style={styles.boardItem}
          >
            <Text style={styles.boardTitle}>{country} 게시판</Text>
            <Text
              style={styles.previewText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {latestPosts[country]?.review
                ? `- ${latestPosts[country].review}`
                : '게시글이 없습니다.'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.popularSection}>
        <Text style={styles.popularTitle}>🔥 실시간 인기글</Text>
        {popularPosts.length === 0 ? (
          <Text style={styles.noPopularText}>인기 게시글이 없습니다.</Text>
        ) : (
          popularPosts.map((post, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePostPress(post)}
              style={styles.popularItem}
            >
              <Text style={styles.popularText} numberOfLines={1}>
                {post.review}
              </Text>
              <Text style={styles.popularInfo}>
                {post.author || '익명'} · ❤️ {post.likes || 0} · 💬{' '}
                {post.comments?.length || 0}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 10 },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: -5,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subTitleContainer: { marginLeft: 30, marginBottom: 10 },
  subTitle: { fontSize: 23, fontWeight: 'bold', color: '#333' },
  boardListContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  boardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  boardTitle: { fontSize: 16, fontWeight: 'bold' },
  previewText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    maxWidth: '60%',
  },
  popularSection: {
    marginHorizontal: 15,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff6f0',
    borderRadius: 10,
    marginBottom: 30,
    height : 200,
  },
  popularTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e85a00',
  },
  noPopularText: {
    fontSize: 14,
    color: '#999',
    
  },
  popularItem: {
    marginBottom: 8,
  },
  popularText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  popularInfo: {
    fontSize: 13,
    color: '#777',
  },
});

export default CommunityScreen;
