import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '@/app/contexts/GlobalContext';
export default function Login() {
  const { userLoginFunc } = React.useContext(GlobalContext);
  const [username, setUsername] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      return;
    }
    const res = await userLoginFunc(username, password);
    if (res.success) {
      Alert.alert('Login bem-sucedido', 'Seja bem vindo!');
      navigation.navigate('Home');
    } else {
      setError(res.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}

      <TouchableOpacity
        style={styles.linkText}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>
          Ainda não possui uma conta? Clique aqui
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#2f855a', // Verde escuro
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#2f855a', // Verde escuro
    textDecorationLine: 'underline',
  },
  registerButtonText: {
    color: '#2f855a', // Verde escuro
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
