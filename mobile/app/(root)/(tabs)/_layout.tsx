import React, { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import COLORS from '@/color';
import { useUser } from '@clerk/expo';
import axios from 'axios';
import { useEstateStore } from '@/store/property';

const IP_ADDRESS = "172.24.35.184"; 

function AndroidTabs({ admin }: { admin: boolean }) {
   
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: `${COLORS.textDark}`, 
      headerShown: false, 
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }} />
 <Tabs.Screen
  name="createpost"
  options={{
    href: admin ? undefined : null,
    title: 'Create',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="create-sharp" size={size} color={color} />
    ),
  }}
/>
      <Tabs.Screen name="saved" options={{ title: 'Saved', tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}

function IOSTabs({ admin }: { admin: boolean }) {
  console.log(admin);
  
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index"><Icon sf="house.fill" /><Label>Home</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="search"><Icon sf="magnifyingglass" /><Label>Search</Label></NativeTabs.Trigger>
 {admin ? (
    <NativeTabs.Trigger name="createpost">
      <Icon sf="camera.metering.unknown.ar" />
      <Label>Create</Label>
    </NativeTabs.Trigger>
  ) : null}
      <NativeTabs.Trigger name="saves"><Icon sf="bookmark.fill" /><Label>Saves</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile"><Icon sf="person.fill" /><Label>Profile</Label></NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function TabLayout() {
  const { user, isLoaded } = useUser();
  const fetchUser = useEstateStore((state: any) => state.fetchuser);
  const userdata = useEstateStore((state: any) => state.userr);
  
  // Track if we have finished checking the user
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      if (!isLoaded) return;
      if (user) {
        // Wait for the user to be added/fetched
        await fetchUser(user);
      }
      setIsInitializing(false);
    }
    init();
  }, [isLoaded, user]);

  if (!isLoaded || isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Use !! to ensure a boolean is passed to the tab components
  const isAdmin = !!userdata?.is_admin;

  return Platform.OS === "ios" ? (
    <IOSTabs admin={isAdmin} />
  ) : (
    <AndroidTabs admin={isAdmin} />
  );
}