import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useAuth, useUser } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import "../global.css"

export default function Index() {
   const { isSignedIn, isLoaded,signOut } = useAuth()




const router=useRouter()
async function handlelogout() {
  await signOut()
  router.replace("/(auth)/signin")
}
  // Input ke liye states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const IP_ADDRESS = "10.53.218.184"; 
  if (!isLoaded) {
    return null
  }
  if (!isSignedIn) {
    return <Redirect href="/(auth)/signup" />
  }
  else{
     
    return <Redirect href={"/(root)/(tabs)/"}/>
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  form: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }
});