import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhilippinesBoard = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadPosts = async () => {
        try {
          const storedPosts = await AsyncStorage.getItem('posts');
          if (storedPosts) {
            const allPosts = JSON.parse(storedPosts);
            const PhilippinesPosts = allPosts.filter(post => post.country === '필리핀');
            PhilippinesPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPosts(PhilippinesPosts);
          } else {
            setPosts([]);
          }
        } catch (e) {
          console.error('Failed to load posts', e);
        }
      };
      loadPosts();
    }, [])
  );

  const handlePostPress = (post) => {
    navigation.navigate('PostDetailScreen', { post });
  };

  const handleWritePress = () => {
    navigation.navigate('ReviewScreenStack');
  };

  const handleBackPress = () => {
    navigation.navigate('CommunityScreenStack');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item)}
    >
      <Text style={styles.arrowIcon}>←</Text>
      <View style={styles.postTextContainer}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.postPreview} numberOfLines={1}>
          {item.content}
        </Text>
      </View>
      <Text style={styles.postDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>필리핀 게시판</Text>
        <TouchableOpacity style={styles.writeButton} onPress={handleWritePress}>
          <Text style={styles.writeButtonText}>✏️ 글쓰기</Text>
        </TouchableOpacity>
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 게시글이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  writeButton: { padding: 8, backgroundColor: '#007AFF', borderRadius: 5 },
  writeButtonText: { color: '#fff', fontWeight: 'bold' },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  arrowIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#333',
  },
  postTextContainer: {
    flex: 1,
  },
  postTitle: { fontSize: 16, fontWeight: 'bold' },
  postPreview: { fontSize: 14, color: '#666', marginTop: 4 },
  postDate: { fontSize: 12, color: '#999', marginLeft: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
});

export default PhilippinesBoard;
