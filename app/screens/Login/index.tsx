import { Text, View, TextInput, Button, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native' // para navegar entre telas de forma dinâmica

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit screens/login/index.tsx to edit this screen.</Text>
    </View>
  );
}
