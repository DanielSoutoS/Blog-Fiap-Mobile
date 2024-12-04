import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getComments, getPostById } from "../../ApiStructure";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import Comments from '@/components/Comments/Comments';
import AddComments from '@/components/Comments/AddComments';
import { GlobalContext } from '@/app/contexts/GlobalContext';

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

export interface CommentsObject {
  page: number;
  post: number;
  comments: {
    count: number;
    rows: {
      id: number,
      body: string,
      active: boolean,
      postId: number,
      createdAt: Date,
      user: {
        name: string
      }
    }[];
  }
}


export default function ViewPost() {
  const [post, setPost] = useState<postInicial | null>(null);
  const [comments, setComments] = useState<CommentsObject | null>(null);
  const { getCookie, data, logged } = React.useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { post: postInicial } = route.params as { post: postInicial | any };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchPostDetalhes = async () => {
      try {
        const token = await getCookie('token') || 'token';
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

const fetchComments = async () => {
      try {
        const token = await getCookie('token') || 'token';
      
        const { url } = await getComments(postInicial?.id, 1, token);
        const response = await fetch(url);
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        setLoading(false);
      }
    }    

  useEffect(() => {
    
    if (postInicial) {
      fetchComments();
    }
  }, [postInicial]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!post) {
    return <Text>Nenhuma notícia encontrada.</Text>;
  }

  const handleCommentPosted = (newComment: CommentsObject['comments']['rows'][0]) => {
    setComments((prevComments) => {
      if (!prevComments) return prevComments;
  
      return {
        ...prevComments,
        comments: {
          ...prevComments.comments,
          rows: newComment.comments.rows,
          count: prevComments.comments.count + 1,
        },
      };
    });
  };
  

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
    {data && logged && <Text style={styles.commentsTitulo}>Comentários:</Text>}
    {data && logged && (
      <AddComments CommentObject={{ postId: post.id, onCommentPosted:handleCommentPosted }} />
    )}
    <ScrollView style={styles.commentContainer} >
        {comments && comments.comments.rows.map((comment) => (
          <Comments key={comment.id} body={comment.body} user={comment.user.name} />
        ))}
    </ScrollView>
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
    paddingBottom: 30,
  },
  commentsTitulo: {
    color: '#1b4d3e',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 10
  },
  commentContainer: {
    marginBottom: 30,
  }
});