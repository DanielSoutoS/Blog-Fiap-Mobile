// Home.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar } from '../../../components/Home/SearchBar'; // Ajuste o caminho se necessário
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native'
import { getPostsByPage } from '../../ApiStructure';
import Post from '@/components/Home/Post';
import { GlobalContext } from '@/app/contexts/GlobalContext';


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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [posts, setPosts] = React.useState([] as Post[]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { data } = React.useContext(GlobalContext);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Termo de pesquisa:', term);
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fiap Blog Home</Text>
      <SearchBar onSearch={handleSearch} />
      <View style={styles.buttonContainer}>
        {data && (data.role === 'admin' || data.role === 'professor') && (
          <TouchableOpacity onPress={() => navigation.navigate('RegisterPost')} style={styles.newPostButton}>
          <Text style={styles.buttonText}>Cadastrar Post</Text>
          </TouchableOpacity>
        )}
      </View>
      {posts.map((post) => (
        <TouchableOpacity key={post.id} onPress={() => handlePress(post)}>
          <Post key={post.id} post={post} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

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
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  newPostButton: {
    backgroundColor: '#2f855a', // Verde escuro
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
});