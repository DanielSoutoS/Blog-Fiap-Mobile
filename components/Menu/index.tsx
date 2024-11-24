import { useState } from "react";
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  Image,
  Text,
  StyleSheet } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../types";


interface MenuProps {
  navigation: NavigationProp<any>;
}

const Menu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return(
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo-blog.jpg')} style={ styles.image } />
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Icon name="currency-eth" size={26} color="#fff" />
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}>
          <SafeAreaView style={ styles.modalContainer } onTouchStart={() => setVisible(false)}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}> 
              <Text style={styles.menuItem}>Home</Text> 
            </TouchableOpacity> 
            <TouchableOpacity onPress={() => navigation.navigate('Login')}> 
              <Text style={styles.menuItem}>Login</Text> 
            </TouchableOpacity>
          </SafeAreaView>
      </Modal>
    </View>
  )
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
  },
  menuItem: {
    fontSize: 16,
    color: '#fff',
    padding: 15,
  }
});

export default Menu;