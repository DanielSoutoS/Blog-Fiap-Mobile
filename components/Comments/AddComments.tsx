import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { commentPost } from '@/app/ApiStructure';
import { GlobalContext } from '@/app/contexts/GlobalContext';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export interface Comment { 
  id: number; 
  body: string; 
  active: boolean; 
  postId: number; 
  createdAt: Date; 
}
export interface CommentObject {
  postId: number;
  onCommentPosted: (comment: Comment) => void;
}


const AddComments = ({ CommentObject }: { CommentObject: CommentObject }) => {
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const { getCookie } = React.useContext(GlobalContext);
  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    try {
      const token = await getCookie('token');
      if (!token) {
        console.error("Token não encontrado no cookie!");
        return;
      }
      const { url, options } = commentPost(CommentObject.postId, text, token);
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data)
      CommentObject.onCommentPosted(data)
      setText('');
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Ocorreu um erro desconhecido.');
          }
    } 
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu comentário..."
          multiline={true} 
          numberOfLines={3}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={handleSubmit} disabled={!text}>
          <Icon name="plus-circle-outline" style={styles.iconPlus} />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlus: {
    color:"#2F4F4F",
    fontSize: 20,
    paddingBottom: 15,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AddComments;