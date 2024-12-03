import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, Button, TextInput } from 'react-native';
import { SearchBar } from '../../../components/Home/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { getPostsByPage, deletePost, updatePost } from '../../ApiStructure';
import Post from '@/components/Home/Post';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlobalContext } from '@/app/contexts/GlobalContext';


export type RootStackParamList = {
  ViewPost: {
    post: Post;
  };
  RegisterPost: undefined;
};

export interface Post {
  id: number;
  title: string;
  body: string;
  active: boolean;
  userId: number;
  totalComments: {
    count: number;
  };
  user: {
    name: string;
  };
  createdAt: string;
}

export function Home() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [posts, setPosts] = React.useState([] as Post[]);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newBody, setNewBody] = React.useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { data, getCookie } = React.useContext(GlobalContext);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { url } = getPostsByPage(1);
        const response = await fetch(url);
        const data = await response.json();
        if (data.posts) setPosts(data.posts);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePress = (post: Post) => {
    navigation.navigate('ViewPost', { post });
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    const token = await getCookie('token');
    if (!token) {
      console.error('Token não encontrado no cookie!');
      return;
    }

    try {
      const { url, options } = deletePost(selectedPost.id, token);
      const response = await fetch(url, options);

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== selectedPost.id));
        Alert.alert('Post excluído com sucesso!');
      } else {
        Alert.alert('Erro ao excluir o post.');
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedPost) return;
  
    const token = await getCookie('token');
    if (!token) {
      console.error('Token não encontrado no cookie!');
      return;
    }
  
    try {
      const postData = { title: newTitle, body: newBody };
      const { url, options } = updatePost(selectedPost.id, postData, token);
      const response = await fetch(url, options);
  
      if (response.ok) {
        const data = await response.json();
  
        if (data.post && data.post.title && data.post.body) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === selectedPost.id
                ? { ...post, title: data.post.title, body: data.post.body }
                : post
            )
          );
          Alert.alert('Post atualizado com sucesso!');
        } else {
          console.error('Dados incompletos na resposta da API');
          Alert.alert('Erro ao atualizar o post: dados incompletos');
        }
      } else {
        Alert.alert('Erro ao atualizar o post.');
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      Alert.alert('Erro ao atualizar o post.');
    } finally {
      setEditModalVisible(false);
    }
  };
  
  const handleEditModalOpen = (post: Post) => {
    setSelectedPost(post);
    setNewTitle(post.title);
    setNewBody(post.body);
    setEditModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fiap Blog Home</Text>
      <SearchBar onSearch={handleSearch} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterPost')} style={styles.newPostButton}>
          <Text style={styles.buttonText}>Cadastrar Post</Text>
        </TouchableOpacity>
      </View>
      {posts.map((post) => (
        <View key={post.id} style={styles.postContainer}>
          <TouchableOpacity onPress={() => handlePress(post)} style={styles.postContent}>
            <Post post={post} />
          </TouchableOpacity>

          {data && (data.role === 'professor' || data.role === 'admin') && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => handleEditModalOpen(post)}
                style={styles.editButton}
              >
                <Icon name="pencil" size={24} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedPost(post);
                  setModalVisible(true);
                }}
              >
                <Icon name="delete" size={24} color="#dc3545" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Tem certeza de que deseja excluir este post?</Text>
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#6c757d" />
            <Button title="Confirmar" onPress={handleDelete} color="#dc3545" />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Editar Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Conteúdo"
            multiline
            value={newBody}
            onChangeText={setNewBody}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setEditModalVisible(false)} color="#6c757d" />
            <Button title="Salvar" onPress={handleEdit} color="#007bff" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1b4d3e',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  newPostButton: {
    backgroundColor: '#2f855a',
    padding: 15,
    borderRadius: 5,
    maxWidth: 200,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  postContent: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'absolute',
    top: '30%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
