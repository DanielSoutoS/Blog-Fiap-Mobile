import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getPostById } from "../../ApiStructure";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import { ScrollView } from 'react-native-gesture-handler';

export interface postInicial {
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


export default function ViewPost() {
  const [post, setPost] = useState<postInicial | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { post: postInicial } = route.params as { post: postInicial | any };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchPostDetalhes = async () => {
      try {
        const token = 'token';
        if (!token) {
          console.error("Token não encontrado no cookie!");
          setLoading(false);
          return;
        }
        if (postInicial) { 
          setPost(postInicial);
          setLoading(false);
          return;
        }

        const { url, options } = await getPostById(postInicial.id, token);
        const response = await fetch(url, options);
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes da notícia:", error);
        setLoading(false);
      }
    };
    fetchPostDetalhes();
  }, [postInicial]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!post) {
    return <Text>Nenhuma notícia encontrada.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-left" style={styles.iconBack} />
      </TouchableOpacity>
      <Text style={styles.titulo}>{post.title}</Text> 
      <Text style={styles.writer}>
        <Icon name="fountain-pen-tip" style={styles.iconWriter} />
        {post.user.name}
      </Text>
      <Text style={styles.conteudo}>{post.body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  iconBack: {
    color:"#2F4F4F",
    fontSize: 26,
    paddingBottom: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 10,
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
  },
  conteudo: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});