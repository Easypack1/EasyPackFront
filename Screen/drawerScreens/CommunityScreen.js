import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const countryList = ['일본', '미국', '베트남', '필리핀', '태국'];

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [latestPosts, setLatestPosts] = useState({});

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

          setLatestPosts(grouped);
        }
      };
      loadReviews();
    }, [])
  );

  const handleBoardPress = (country) => {
    switch (country) {
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
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
      </View>

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>여행기</Text>
      </View>

      <FlatList
        data={countryList}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.boardListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleBoardPress(item)}
            style={styles.boardItem}
          >
            <Text style={styles.boardTitle}>{item} 게시판</Text>
            <Text
              style={styles.previewText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {latestPosts[item]?.review
                ? `- ${latestPosts[item].review}`
                : '게시글이 없습니다.'}
            </Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
  subTitleContainer: { marginLeft: 50, marginBottom: 10 },
  subTitle: { fontSize: 23, fontWeight: 'bold', color: '#333' },
  boardListContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
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
  separator: { height: 5 },
});

export default CommunityScreen;
