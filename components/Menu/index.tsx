import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { GlobalContext } from '@/app/contexts/GlobalContext';

interface MenuProps {
  navigation: NavigationProp<any>;
}

const Menu = () => {
  const { data, userLogout, logged } = React.useContext(GlobalContext);

  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={require('@/assets/images/logo-blog.jpg')}
          style={styles.image}
        />
      </TouchableOpacity>
      {data && (
        <Text style={styles.welcomeMessage}>Seja bem vindo, {data.name}!</Text>
      )}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Icon name="currency-eth" size={26} color="#fff" />
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}
        animationType="fade" // Adicione uma animação se desejar
      >
        {/* Aqui usamos TouchableWithoutFeedback */}
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={{ flex: 1 }}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.menuItem}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                {!logged ? (
                  <Text style={styles.menuItem}>Login</Text>
                ) : (
                  <Text
                    style={styles.menuItem}
                    onPress={() => {
                      userLogout();
                      navigation.navigate('Home');
                    }}
                  >
                    Logout
                  </Text>
                )}
              </TouchableOpacity>
              {data && data.role === 'admin' && (
                <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
                  <Text style={styles.menuItem}>Admin</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderBottomEndRadius: 4,
    borderBottomStartRadius: 4,
    position: 'absolute',
    minWidth: 150,
    top: 60,
    right: 0,
  },
  menuItem: {
    fontSize: 16,
    color: '#fff',
    padding: 15,
  },
  welcomeMessage: {
    color: 'white',
  },
});

export default Menu;
