// SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { GlobalContext } from '../../app/contexts/GlobalContext';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { searchTerm, setSearchTerm } = React.useContext(GlobalContext);
  // const [term, setTerm] = React.useState('');

  const handleChange = (text: string) => {
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar..."
        value={searchTerm}
        onChangeText={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Estilos para o container da barra de pesquisa
    padding: 10,
  },
  input: {
    // Estilos para o TextInput
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
});
