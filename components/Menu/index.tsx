import { useState } from "react";
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  Image,
  StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Menu = () => {
  const [visible, setVisible] = useState(false);
  return(
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo-blog.jpg')} style={ styles.image } />
      <TouchableOpacity>
        <Icon name="currency-eth" size={26} color="#fff" />
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}>
          <SafeAreaView></SafeAreaView>
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

  }
});

export default Menu;