// PostDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostDetailScreen = ({ route }) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.country}>[{post.country}]</Text>
      <Text style={styles.review}>{post.review}</Text>
      <Text style={styles.meta}>❤️ 좋아요: {post.likes}</Text>
      <Text style={styles.meta}>💬 댓글: {post.comments}</Text>
      <Text style={styles.date}>{new Date(post.date).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  country: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  review: {
    fontSize: 16,
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
});

export default PostDetailScreen;
