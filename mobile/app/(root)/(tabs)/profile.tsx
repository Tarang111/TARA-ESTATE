import { View, Text, TouchableOpacity, ActivityIndicator, Image, Modal, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/expo'
import { Redirect, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '@/color'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'

const profile = () => {
     const {signOut}=useAuth()
    const {user,isLoaded,isSignedIn}=useUser()
   const IP_ADDRESS = "172.24.35.184";
  const router=useRouter()
  const [visible,setvisible]=useState(false)
  const [userdata,setuserdata]=useState<any>(null)
   const [loading,setLoading]=useState(true)
 
  async function getdata() {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://${IP_ADDRESS}:3000/getuserbyid`, {
        params: { id: user.id }
      });
  
      setuserdata(res.data?.user)
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getdata();
  }, [user]);
  const avatarUrl = `https://api.dicebear.com/10.x/adventurer/png?seed=${userdata?.first_name}`;
   async function logout() {
    await signOut()
  
    
  } 
  if(!isSignedIn)
  {
    <Redirect href={"/(auth)/signin"}/>
  }
    if(loading)
  {
    return <ActivityIndicator size={40} className='flex-1 ' style={{ backgroundColor:COLORS.background}}/>
  }
  return (
    <View className='flex-1 ' style={{backgroundColor:COLORS.background}}>

    <SafeAreaView  className='flex justify-center items-center gap-2 mt-20'>



    <View className='w-28 h-28    rounded-full border-2' style={{borderColor:COLORS.textDark , backgroundColor:COLORS.inputBackground}}>
     
     <Image
      source={{uri:avatarUrl}}
      style={{width:'100%',height:'100%'}}
     resizeMode='cover'
     />
<View className='absolute right-0'>
  <Text className='text-3xl'>🛸</Text>
</View>
    </View>
    <View className=' gap-4'>
     <View className='items-center'>
       <Text  className='text-xl font-bold'>{userdata.first_name.toUpperCase() + userdata.last_name.toUpperCase()}</Text>
      <Text  className='text-xl font-light'>{userdata.email}</Text>
     </View>
      <View className='gap-4'>
        <TouchableOpacity className='w-96 border rounded-xl px-2 justify-between py-1 flex-row items-center' style={{backgroundColor:COLORS.textDark}}
       onPress={()=>{router.push("/(root)/(tabs)/saved")}}
      >
        <Text className='text-xl text-white font-bold'>Saved Properties</Text>
        <Ionicons name='arrow-forward-outline' color={'white'} size={25}/>
      </TouchableOpacity>

       <TouchableOpacity onPress={()=>{setvisible(true)}} className='w-96 border rounded-xl px-2 justify-between py-1 flex-row items-center' style={{backgroundColor:COLORS.textDark}}>
        <Text className='text-xl text-white font-bold'>Notifications</Text>
        <Ionicons name='arrow-forward-outline' color={'white'} size={25}/>
      </TouchableOpacity>

       <TouchableOpacity onPress={()=>{setvisible(true)}} className='w-96 border rounded-xl px-2 justify-between py-1 flex-row items-center' style={{backgroundColor:COLORS.textDark}}>
        <Text className='text-xl text-white font-bold'>Setting</Text>
        <Ionicons name='arrow-forward-outline' color={'white'} size={25}/>
      </TouchableOpacity>

       <TouchableOpacity onPress={()=>{
        const email = 'mishratarang123@gmail.com';
  const subject = 'App Feedback';
  const body = 'I would like to report an issue...';

  Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
       }} className='w-96 border rounded-xl px-2 justify-between py-1 flex-row items-center' style={{backgroundColor:COLORS.textDark}}>
        <Text className='text-xl text-white font-bold'>Help & support</Text>
        <Ionicons name='arrow-forward-outline' color={'white'} size={25}/>
      </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity 
        onPress={()=>{logout()}}
        className='border px-1 py-2   flex-row items-center gap-3 w-48 rounded-lg bg-red-700 '>
          <Ionicons name='log-out' size={26} color={'white'}/>
          <Text className='text-xl font-bold text-center text-white'>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
    <Modal
     visible={visible}
     transparent={true}
     animationType='slide'
     onRequestClose={()=>{setvisible(false)}}
     className='flex-1'
    >
      <View className='flex-1 justify-center'>
        <View className='h-40 bg-white w-[95%] mx-auto  justify-center items-center rounded-xl border'>
          <Text className='font-bold text-bold'>THIS FEATURE IS CURRENTLY UNAVAILABLE</Text>
            <Ionicons name="close" className='border w-fit rounded-full bg-red-900 ' color={'white'} size={26} onPress={()=>{setvisible(false)}}/>
        </View>
      </View>

    </Modal>
    </SafeAreaView>
    </View>
  )
}

export default profile