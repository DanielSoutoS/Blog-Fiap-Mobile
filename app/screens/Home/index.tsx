// Home.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar } from '../../../components/Home/SearchBar'; // Ajuste o caminho se necessário
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native'
import { getPostsByPage, getSearchPosts } from '../../ApiStructure';
import { GlobalContext } from '../../contexts/GlobalContext';
import Post from '@/components/Home/Post';
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1b4d3e'
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
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

export type RootStackParamList = {
  ViewPost: {
    post: Post;
  };
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
  const { searchTerm, isSearching, setIsSearching, setSearchTerm, setCurrentPage, currentPage } = React.useContext(GlobalContext);

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

      const postsPerPage = 2;
      setTotalPages(
        data.totalPages || Math.ceil(data.totalPosts / postsPerPage),
      );
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiap Blog Home</Text>
      <SearchBar onSearch={handleSearch} />
      {posts && posts.length > 0 ? (
        <>
        {posts.map((post) => (
          <TouchableOpacity key={post.id} onPress={() => handlePress(post)}>
            <Post key={post.id} post={post} />
          </TouchableOpacity>
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
      
    </View>
  );
}
