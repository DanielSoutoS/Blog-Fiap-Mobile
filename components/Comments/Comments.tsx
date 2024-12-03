import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CommentsProps {
  body: string,
  user: string
}

const Comments: React.FC<CommentsProps> = ({ body, user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.writer}>
         <Icon name="account-outline" style={styles.iconWriter} />
         {user}
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
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginVertical: 5,
  },
  writer: {
    fontSize: 14,
    lineHeight: 18,
    color: '#006400',
    marginBottom: 10,
    marginTop: 10
  },
  iconWriter: {
    fontSize: 14,
    color: '#006400',
    marginRight: 5
  }
});

export default Comments;
