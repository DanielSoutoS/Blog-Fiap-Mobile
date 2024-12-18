import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, Button, TextInput } from 'react-native';
import { SearchBar } from '../../../components/Home/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native'
import { deletePost, getPostsByPage, getSearchPosts, updatePost } from '../../ApiStructure';
import { GlobalContext } from '../../contexts/GlobalContext';
import Post from '@/components/Home/Post';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



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
  const [posts, setPosts] = React.useState([] as Post[]);
  const [totalPages, setTotalPages] = React.useState(1);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { searchTerm, isSearching, setIsSearching, setSearchTerm, setCurrentPage, currentPage, data, getCookie, logged } = React.useContext(GlobalContext);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newBody, setNewBody] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('Tem certeza de que deseja excluir este post?');

  const fetchPosts = async () => {
    try {
      let url, options;
      if (isSearching && searchTerm) {
        ({ url, options } = getSearchPosts(currentPage, searchTerm));
      } else {
        ({ url, options } = getPostsByPage(currentPage));
      }

      const response = await fetch(url, options);
      const data = await response.json();
      if (data.posts) setPosts(data.posts);

      const postsPerPage = 10;
      setTotalPages(
        data.totalPages || Math.ceil(data.totalPosts / postsPerPage),
      );
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  }

  React.useEffect(() => {
    fetchPosts();
  }, []);

  React.useEffect(() => {
    console.log(isSearching)
    console.log("Página Atual:", currentPage);
    console.log("Total de Páginas:", totalPages);
    fetchPosts();
  }, [currentPage, isSearching]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(!!term);
    setCurrentPage(1);
    fetchPosts();
  };
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
        setModalVisible(false);
      } else {
        console.log(setModalMessage)
        setModalMessage('Você não tem permissão para editar/excluir o post.');
        setModalVisible(true);
        Alert.alert('Erro ao excluir o post.');
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      Alert.alert('Erro ao excluir o post.');
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
          setEditModalVisible(false); 
        } else {
          console.error('Dados incompletos na resposta da API');
          Alert.alert('Erro ao atualizar o post: dados incompletos');
        }
      } else {
        setEditModalVisible(false);        
        setModalMessage('Você não tem permissão para editar/excluir o post.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
    }
  };
  
  const handleEditModalOpen = (post: Post) => {
    setSelectedPost(post);
    setNewTitle(post.title);
    setNewBody(post.body);
    setEditModalVisible(true);
  };

  return (
    <ScrollView  style={styles.container}>
      <Text style={styles.title}>Fiap Blog Home</Text>
      <SearchBar onSearch={handleSearch} />
      {data && logged && (data.role === 'professor' || data.role === 'admin') && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterPost')} style={styles.newPostButton}>
            <Text style={styles.buttonText}>Cadastrar Post</Text>
          </TouchableOpacity>
        </View>
      )}
      {posts && posts.length > 0 ? (
        <>
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
        <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={[
                styles.button,
                currentPage === 1 && styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.paginationText}>
              Página {currentPage} de {totalPages}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={[
                styles.button,
                currentPage === totalPages && styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>Próxima</Text>
            </TouchableOpacity>
          </View>
        </>
      ): (
        <Text style={styles.noPostsText}>Nenhum post encontrado nesta página.</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#6c757d" />
            {modalMessage === 'Tem certeza de que deseja excluir este post?' && (
              <Button title="Confirmar" onPress={handleDelete} color="#dc3545" />
            )}
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
    </ScrollView >
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
  postsWrapper: {
    paddingBottom: 20,
  },
  post: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  postText: {
    fontSize: 16,
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    fontSize: 16,
    color: '#333',
  },
  noPostsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
function setModalMessage(arg0: string) {
  throw new Error('Function not implemented.');
}

