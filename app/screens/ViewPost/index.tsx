import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getPostById } from "../../ApiStructure";

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
    <View style={styles.container}>
      <Text style={styles.titulo}>{post.title}</Text> 
      <Text style={styles.conteudo}>{post.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conteudo: {
    fontSize: 16,
  },
});