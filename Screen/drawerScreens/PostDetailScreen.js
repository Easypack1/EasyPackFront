import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostDetailScreen = ({ route, navigation }) => {
  const post = route.params?.post;

  if (!post || !post.date || !post.review) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>게시글 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const STORAGE_KEY_COMMENTS = `@comments_${post.id || post.date}`;
  const STORAGE_KEY_LIKES = `@likes_${post.id || post.date}`;

  // 게시글 좋아요 상태
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [hasLiked, setHasLiked] = useState(false);

  // 댓글 리스트 (댓글과 대댓글 포함)
  const [comments, setComments] = useState([]);
  // 새 댓글 작성 관련 상태
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');

  // 댓글별 좋아요 누른 상태 저장용 (댓글 id: true/false)
  const [commentLikesStatus, setCommentLikesStatus] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        // 댓글 불러오기
        const storedComments = await AsyncStorage.getItem(STORAGE_KEY_COMMENTS);
        if (storedComments) setComments(JSON.parse(storedComments));

        // 게시글 좋아요 불러오기
        const storedLikes = await AsyncStorage.getItem(STORAGE_KEY_LIKES);
        if (storedLikes !== null) {
          setLikes(parseInt(storedLikes, 10));
          setHasLiked(true);
        }

        // 댓글 좋아요 상태 불러오기 (댓글 좋아요 상태도 저장해도 좋음)
        // 여기서는 단순 초기화 (개선 가능)
      } catch (e) {
        console.log('데이터 불러오기 실패', e);
      }
    };
    loadData();
  }, []);

  // 게시글 좋아요
  const handleLike = async () => {
    if (hasLiked) {
      Alert.alert('이미 좋아요를 눌렀습니다.');
      return;
    }
    const newLikes = likes + 1;
    setLikes(newLikes);
    setHasLiked(true);
    Alert.alert('좋아요!', '게시글을 좋아요 했습니다.');

    try {
      await AsyncStorage.setItem(STORAGE_KEY_LIKES, newLikes.toString());
    } catch (e) {
      console.log('좋아요 저장 실패', e);
    }
  };

  // 댓글 좋아요 처리 (댓글 id 사용)
  const handleCommentLike = (commentId) => {
    if (commentLikesStatus[commentId]) {
      Alert.alert('이미 좋아요를 누른 댓글입니다.');
      return;
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, likes: (comment.likes || 0) + 1 };
      }
      return comment;
    });

    setComments(updatedComments);
    setCommentLikesStatus((prev) => ({ ...prev, [commentId]: true }));

    // 댓글 저장
    AsyncStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updatedComments)).catch((e) =>
      console.log('댓글 좋아요 저장 실패', e),
    );
  };

  // 대댓글 좋아요 처리 (commentId, replyId 사용)
  const handleReplyLike = (commentId, replyId) => {
    if (commentLikesStatus[replyId]) {
      Alert.alert('이미 좋아요를 누른 대댓글입니다.');
      return;
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            return { ...reply, likes: (reply.likes || 0) + 1 };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setComments(updatedComments);
    setCommentLikesStatus((prev) => ({ ...prev, [replyId]: true }));

    AsyncStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updatedComments)).catch((e) =>
      console.log('대댓글 좋아요 저장 실패', e),
    );
  };

  // 새 댓글 추가
  const addComment = async () => {
    if (!newAuthor.trim() || !newComment.trim()) {
      Alert.alert('닉네임과 댓글 내용을 모두 입력하세요.');
      return;
    }

    const newId = Date.now().toString(); // 간단 id 생성
    const newEntry = {
      id: newId,
      author: newAuthor.trim(),
      text: newComment.trim(),
      likes: 0,
      replies: [],
    };

    const updatedComments = [...comments, newEntry];
    setComments(updatedComments);
    setNewAuthor('');
    setNewComment('');

    try {
      await AsyncStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updatedComments));
    } catch (e) {
      console.log('댓글 저장 실패', e);
    }
  };

  // 댓글 삭제
  const deleteComment = (commentId) => {
    Alert.alert('댓글 삭제', '정말 이 댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          const updatedComments = comments.filter((c) => c.id !== commentId);
          setComments(updatedComments);
          try {
            await AsyncStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updatedComments));
          } catch (e) {
            console.log('댓글 삭제 저장 실패', e);
          }
        },
      },
    ]);
  };

  // 대댓글 추가 (reply 작성 input 관리)
  // 각 댓글별로 대댓글 입력 상태 관리 (replyAuthor, replyText)
  const [replyInputs, setReplyInputs] = useState({}); // { commentId: { author: '', text: '' } }

  const setReplyInput = (commentId, field, value) => {
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        [field]: value,
      },
    }));
  };

  const addReply = async (commentId) => {
    const input = replyInputs[commentId];
    if (!input?.author?.trim() || !input?.text?.trim()) {
      Alert.alert('닉네임과 답글 내용을 모두 입력하세요.');
      return;
    }

    const newReply = {
      id: Date.now().toString(),
      author: input.author.trim(),
      text: input.text.trim(),
      likes: 0,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...comment.replies, newReply] };
      }
      return comment;
    });

    setComments(updatedComments);

    // 입력 초기화
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: { author: '', text: '' },
    }));

    try {
      await AsyncStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updatedComments));
    } catch (e) {
      console.log('대댓글 저장 실패', e);
    }
  };

  // 대댓글 삭제
  const deleteReply = (commentId, replyId) => {
    Alert.alert('답글 삭제', '정말 이 답글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter((r) => r.id !== replyId),
              };
            }
            return comment;
          });
          setComments(updatedComments);
          try {
            await AsyncStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updatedComments));
          } catch (e) {
            console.log('답글 삭제 저장 실패', e);
          }
        },
      },
    ]);
  };

  // 댓글 렌더 함수 (댓글과 대댓글을 포함)
  const renderReply = (commentId, reply) => (
    <View key={reply.id} style={styles.replyRow}>
      <Text style={styles.replyText}>
        {reply.author} : {reply.text}
      </Text>
      <View style={styles.replyButtons}>
        <TouchableOpacity onPress={() => handleReplyLike(commentId, reply.id)}>
          <Text style={styles.replyLike}>❤️ {reply.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteReply(commentId, reply.id)}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.commentAuthor}>{item.author}</Text>
        <Text style={styles.commentItem}>{item.text}</Text>
        <View style={styles.commentButtons}>
          <TouchableOpacity onPress={() => handleCommentLike(item.id)}>
            <Text style={styles.commentLike}>❤️ {item.likes || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteComment(item.id)}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* 대댓글 리스트 */}
        <View style={styles.repliesContainer}>
          {item.replies.map((reply) => renderReply(item.id, reply))}
        </View>

        {/* 대댓글 입력 */}
        <View style={styles.replyInputContainer}>
          <TextInput
            placeholder="답글 닉네임"
            value={replyInputs[item.id]?.author || ''}
            onChangeText={(text) => setReplyInput(item.id, 'author', text)}
            style={[styles.replyInput, { flex: 0.3 }]}
          />
          <TextInput
            placeholder="답글 입력"
            value={replyInputs[item.id]?.text || ''}
            onChangeText={(text) => setReplyInput(item.id, 'text', text)}
            style={[styles.replyInput, { flex: 0.6 }]}
          />
          <Button title="추가" onPress={() => addReply(item.id)} />
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* 상단 뒤로가기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로가기</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.country}>[{post.country ?? '알 수 없음'}]</Text>
      <Text style={styles.review}>{post.review ?? '(내용 없음)'}</Text>

      <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
        <Text style={styles.likeText}>❤️ 좋아요 {likes}</Text>
      </TouchableOpacity>

      <Text style={styles.meta}>💬 댓글 {comments.length}</Text>
      <Text style={styles.date}>
        {new Date(post.date).toLocaleString() ?? '날짜 없음'}
      </Text>

      {/* 댓글 목록 */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListEmptyComponent={<Text style={styles.noComments}>아직 댓글이 없습니다.</Text>}
        style={styles.commentList}
      />

      {/* 새 댓글 입력 */}
      <View style={styles.newCommentContainer}>
        <TextInput
          placeholder="닉네임"
          value={newAuthor}
          onChangeText={setNewAuthor}
          style={[styles.commentInput, { flex: 0.3, marginRight: 8 }]}
        />
        <TextInput
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChangeText={setNewComment}
          style={[styles.commentInput, { flex: 0.6, marginRight: 8 }]}
          multiline
        />
        <Button title="추가" onPress={addComment} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },

  header: { marginBottom: 10 },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },

  country: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  review: { fontSize: 16, marginBottom: 10 },
  meta: { fontSize: 14, color: '#555', marginBottom: 5 },
  date: { fontSize: 12, color: '#999', marginTop: 10 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 50 },

  likeButton: {
    backgroundColor: '#FF4081',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  likeText: { color: 'white', fontWeight: 'bold' },

  commentList: { marginTop: 20, flexGrow: 0 },
  commentRow: {
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  commentItem: { fontSize: 14, color: '#333', marginBottom: 4 },
  commentButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentLike: {
    fontSize: 14,
    color: '#FF4081',
    marginRight: 12,
  },
  deleteIcon: { fontSize: 16, color: '#FF3B30' },

  noComments: { fontSize: 14, color: '#888', fontStyle: 'italic' },

  newCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxHeight: 80,
  },

  repliesContainer: {
    paddingLeft: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    marginTop: 5,
  },
  replyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyText: { fontSize: 13, color: '#555', flex: 1 },
  replyButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  replyLike: {
    fontSize: 13,
    color: '#FF4081',
    marginRight: 10,
  },

  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    fontSize: 13,
  },
});

export default PostDetailScreen;
