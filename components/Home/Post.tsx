import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post as PostType } from '../../app/screens/Home/index';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text>{post.user.name}</Text>
      <Text style={styles.body}>{post.body}</Text>
      <Text style={styles.footer}>
        {post.totalComments.count} comments •{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginVertical: 5,
  },
  footer: {
    fontSize: 12,
    lineHeight: 16,
    color: '#777',
  },
});

export default Post;
