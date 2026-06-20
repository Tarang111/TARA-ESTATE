import React, { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import COLORS from '@/color';
import { useUser } from '@clerk/expo';
import axios from 'axios';

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
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function getdata() {
      if (!isLoaded) return;

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://${IP_ADDRESS}:3000/getuserbyid`,
          {
            params: { id: user.id },
          }
        );

        setAdmin(!!res.data?.user?.is_admin);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getdata();
  }, [isLoaded, user?.id]);

  if (!isLoaded || loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return Platform.OS === "ios" ? (
    <IOSTabs admin={admin} />
  ) : (
    <AndroidTabs admin={admin} />
  );
}