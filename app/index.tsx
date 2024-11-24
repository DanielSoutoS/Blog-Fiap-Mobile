import { Text, View, TextInput, Button, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
// import { AppRoutes } from "@/routes/app.routes";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
