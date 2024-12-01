import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { createPost } from '../../ApiStructure';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    const postData = {
      title,
      body,
    };

    if (!title || !body) {
      return setError('Preencha todos os campos');
    }

    try {
      const token = 'token';
      if (!token) {
        console.error("Token não encontrado no cookie!");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { url, options } = createPost(postData, token);
      const response = await fetch(url, options);
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.message || 'Erro ao registrar o post');
      }

      Alert.alert('Sucesso', 'Post registrado com sucesso!');

      setSuccess(true);
      setError('');
      setTitle('');
      setBody('');

      navigation.navigate('Home');
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Ocorreu um erro desconhecido.');
          }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Post</Text>

      {success && <Text style={styles.successMessage}>Post registrado com sucesso!</Text>}

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Conteúdo"
        multiline={true} 
        numberOfLines={10}
        value={body}
        onChangeText={setBody}
        editable={!loading}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerButtonText}>Cadastrar Post</Text>}
      </TouchableOpacity>

      {error && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  iconBack: {
    color:"#2F4F4F",
    fontSize: 26,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  registerButton: {
    backgroundColor: '#2f855a', // Verde escuro
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
