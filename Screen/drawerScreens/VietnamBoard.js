import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, Image, TextInput, Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PROFILE_IMG = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

const VietnamBoard = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editReview, setEditReview] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const loadReviews = async () => {
        try {
          const storedReviews = await AsyncStorage.getItem('reviews');
          if (storedReviews) {
            const allReviews = JSON.parse(storedReviews);
            const japanPosts = allReviews.filter(post => post.country === '베트남');
            japanPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            const postsWithExtras = japanPosts.map(p => ({
              ...p,
              liked: p.liked || false,
              comments: p.comments || [],
            }));
            setPosts(postsWithExtras);
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

  const toggleLike = async (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, liked: !post.liked };
      }
      return post;
    });
    setPosts(updatedPosts);
    await AsyncStorage.setItem('reviews', JSON.stringify(updatedPosts));
  };

  const handleCommentChange = (postId, text) => {
    setCommentInput({ ...commentInput, [postId]: text });
  };

  const addComment = async (postId) => {
    const text = commentInput[postId];
    if (!text || text.trim() === '') return;
    const newComment = {
      id: Date.now().toString(),
      text: text.trim(),
      date: new Date().toISOString(),
      nickname: '닉네임',
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

    setComments(prev => ({
      ...prev,
      [postId]: [...(comments[postId] || []), newComment]
    }));

    setCommentInput({ ...commentInput, [postId]: '' });

    await AsyncStorage.setItem('reviews', JSON.stringify(updatedPosts));
  };

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

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditReview(post.review);
  };

  const saveEdit = async () => {
    if (editTitle.trim() === '' || editReview.trim() === '') {
      Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    const updatedPosts = posts.map(post => {
      if (post.id === editingPostId) {
        return { ...post, title: editTitle, review: editReview };
      }
      return post;
    });
    setPosts(updatedPosts);
    setEditingPostId(null);
    setEditTitle('');
    setEditReview('');
    await AsyncStorage.setItem('reviews', JSON.stringify(updatedPosts));
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle('');
    setEditReview('');
  };

  const handleWritePress = () => {
    navigation.navigate('ReviewScreenStack');
  };

  const handleBackPress = () => {
    navigation.navigate('CommunityScreenStack');
  };

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: DEFAULT_PROFILE_IMG }} style={styles.profileImage} />
        <View style={styles.nameRatingContainer}>
          <Text style={styles.nickname}>닉네임</Text>
          <Text style={styles.postRating}>⭐️ {item.rating}점</Text>
        </View>

        {/* 삭제 버튼과 수정 버튼을 한 줄로 */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.deletePostButton}
            onPress={() => deletePost(item.id)}
          >
            <Text style={styles.deletePostText}>삭제</Text>
          </TouchableOpacity>

          {editingPostId !== item.id && (
            <TouchableOpacity
              style={styles.editButtonInline}
              onPress={() => startEditing(item)}
            >
              <Text style={styles.editButtonText}>수정</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {editingPostId === item.id ? (
        <>
          <TextInput
            style={styles.editTitleInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="제목을 입력하세요"
          />
          <TextInput
            style={styles.editReviewInput}
            value={editReview}
            onChangeText={setEditReview}
            placeholder="내용을 입력하세요"
            multiline
          />
          <View style={styles.editButtonsRow}>
            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{item.title}</Text>
          <Text style={styles.postReview}>{item.review}</Text>
        </>
      )}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => toggleLike(item.id)}
          style={styles.likeButton}
        >
          <Text style={{ fontSize: 18 }}>{item.liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.liked ? 1 : 0}</Text>
      </View>

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
        <Text style={styles.headerTitle}>베트남 게시판</Text>
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
    justifyContent: 'space-between',
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
    color: '#777',
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deletePostButton: {
    padding: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
marginRight: 6,
},
deletePostText: { color: '#fff' },
editButtonInline: {
padding: 6,
backgroundColor: '#007AFF',
borderRadius: 5,
},
editButtonText: { color: '#fff' },

editTitleInput: {
borderWidth: 1,
borderColor: '#ccc',
padding: 6,
borderRadius: 5,
marginBottom: 6,
},
editReviewInput: {
borderWidth: 1,
borderColor: '#ccc',
padding: 6,
borderRadius: 5,
height: 60,
marginBottom: 6,
textAlignVertical: 'top',
},
editButtonsRow: {
flexDirection: 'row',
justifyContent: 'flex-end',
gap: 10,
marginBottom: 6,
},
saveButton: {
backgroundColor: '#007AFF',
paddingHorizontal: 10,
paddingVertical: 6,
borderRadius: 5,
},
saveButtonText: { color: '#fff' },
cancelButton: {
backgroundColor: '#ccc',
paddingHorizontal: 10,
paddingVertical: 6,
borderRadius: 5,
},
cancelButtonText: { color: '#000' },

postReview: {
fontSize: 15,
marginBottom: 6,
},
actionsRow: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 6,
},
likeButton: {
padding: 5,
marginRight: 6,
},
likeCount: {
fontSize: 14,
},
commentList: {
marginTop: 6,
marginBottom: 6,
},
commentItem: {
flexDirection: 'row',
marginBottom: 4,
alignItems: 'flex-start',
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
fontSize: 13,
},
commentInputRow: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 6,
},
commentInput: {
flex: 1,
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 5,
padding: 6,
marginRight: 6,
},
commentSubmitButton: {
paddingVertical: 6,
paddingHorizontal: 10,
backgroundColor: '#007AFF',
borderRadius: 5,
},
commentSubmitText: {
color: '#fff',
},
postFooter: {
marginTop: 6,
alignItems: 'flex-end',
},
postDate: {
fontSize: 12,
color: '#777',
},
emptyContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
emptyText: {
fontSize: 16,
color: '#777',
},
});

export default VietnamBoard;
   
