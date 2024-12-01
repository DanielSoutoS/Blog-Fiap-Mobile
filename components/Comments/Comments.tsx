import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CommentsProps {
  body: string
}

const Comments: React.FC<CommentsProps> = ({ body }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.body}>{body}</Text>
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
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginVertical: 5,
  }
});

export default Comments;
