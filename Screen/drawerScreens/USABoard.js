import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, Image, TextInput, Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PROFILE_IMG = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

const USABoard = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  // 댓글 상태 따로 저장 (postId: 댓글 배열)
  const [comments, setComments] = useState({});
  // 입력 중인 댓글 텍스트(postId별)
  const [commentInput, setCommentInput] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const loadReviews = async () => {
        try {
          const storedReviews = await AsyncStorage.getItem('reviews');
          if (storedReviews) {
            const allReviews = JSON.parse(storedReviews);
            const japanPosts = allReviews.filter(post => post.country === '미국');
            japanPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            // 좋아요 초기값 없으면 false로 초기화, 댓글도 초기화
            const postsWithExtras = japanPosts.map(p => ({
              ...p,
              liked: p.liked || false,
              comments: p.comments || [],
            }));
            setPosts(postsWithExtras);
            // 댓글 상태 초기화
            const initComments = {};
            postsWithExtras.forEach(p => {
              initComments[p.id] = p.comments;
            });
            setComments(initComments);
          } else {
            setPosts([]);
            setComments({});
          }
        } catch (e) {
          console.error('Failed to load posts', e);
        }
      };
      loadReviews();
    }, [])
  );

  // 좋아요 토글
  const toggleLike = async (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, liked: !post.liked };
      }
      return post;
    });
    setPosts(updatedPosts);
    // AsyncStorage 업데이트
    await AsyncStorage.setItem('reviews', JSON.stringify(updatedPosts));
  };

  // 댓글 입력 텍스트 변경
  const handleCommentChange = (postId, text) => {
    setCommentInput({ ...commentInput, [postId]: text });
  };

  // 댓글 추가
  const addComment = async (postId) => {
    const text = commentInput[postId];
    if (!text || text.trim() === '') return;
    const newComment = {
      id: Date.now().toString(),
      text: text.trim(),
      date: new Date().toISOString(),
      nickname: '닉네임', // 필요하면 실제 닉네임으로 대체
      profileImg: DEFAULT_PROFILE_IMG,
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = [...(post.comments || []), newComment];
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);

    // 댓글 상태 업데이트
    setComments(prev => ({
      ...prev,
      [postId]: [...(comments[postId] || []), newComment]
    }));

    setCommentInput({ ...commentInput, [postId]: '' });

    await AsyncStorage.setItem('reviews', JSON.stringify(updatedPosts));
  };

  // 게시글 삭제
  const deletePost = (id) => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 게시글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedReviews = await AsyncStorage.getItem('reviews');
              if (storedReviews) {
                let allReviews = JSON.parse(storedReviews);
                allReviews = allReviews.filter(post => post.id !== id);
                await AsyncStorage.setItem('reviews', JSON.stringify(allReviews));
                setPosts(posts.filter(post => post.id !== id));
              }
            } catch (e) {
              console.error('Failed to delete post', e);
            }
          },
        },
      ]
    );
  };

  const handleWritePress = () => {
    navigation.navigate('ReviewScreenStack');
  };

  const handleBackPress = () => {
    navigation.navigate('CommunityScreenStack');
  };

  // 게시글 아이템 렌더링
  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: DEFAULT_PROFILE_IMG }} style={styles.profileImage} />
        <View style={styles.nameRatingContainer}>
          <Text style={styles.nickname}>닉네임</Text>
          <Text style={styles.postRating}>⭐️ {item.rating}점</Text>
        </View>

        <TouchableOpacity
          style={styles.deletePostButton}
          onPress={() => deletePost(item.id)}
        >
          <Text style={styles.deletePostText}>삭제</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{item.title}</Text>

      <Text style={styles.postReview}>{item.review}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => toggleLike(item.id)}
          style={styles.likeButton}
        >
          <Text style={{ fontSize: 18 }}>{item.liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.liked ? 1 : 0}</Text>
      </View>

      {/* 댓글 리스트 */}
      <View style={styles.commentList}>
        {(comments[item.id] || []).map(comment => (
          <View key={comment.id} style={styles.commentItem}>
            <Image source={{ uri: comment.profileImg }} style={styles.commentProfileImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.commentNickname}>{comment.nickname}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 댓글 입력창 */}
      <View style={styles.commentInputRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요"
          value={commentInput[item.id] || ''}
          onChangeText={(text) => handleCommentChange(item.id, text)}
        />
        <TouchableOpacity
          style={styles.commentSubmitButton}
          onPress={() => addComment(item.id)}
        >
          <Text style={styles.commentSubmitText}>등록</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postFooter}>
        <Text style={styles.postDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>미국 게시판</Text>
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
  backButton: { padding: 5, marginRight: 10 },
  backButtonText: { fontSize: 20 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  writeButton: { padding: 8, backgroundColor: '#007AFF', borderRadius: 5 },
  writeButtonText: { color: '#fff', fontWeight: 'bold' },

  postItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  nameRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  postRating: {
    fontSize: 14,
    color: '#666',
  },
  deletePostButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
  },
  deletePostText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  postReview: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  likeButton: {
    marginRight: 6,
  },
  likeCount: {
    fontSize: 14,
    color: '#666',
  },

  commentList: {
    marginBottom: 8,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  commentProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  commentNickname: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  commentText: {
    fontSize: 14,
    color: '#444',
  },

  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 4,
    marginBottom: 4,
  },
  commentInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 18,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  commentSubmitButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  commentSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
});

export default USABoard;
