import { View, Text, Image, FlatList ,TouchableOpacity, ActivityIndicator, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '@/color'
import axios from 'axios'
import { useUser } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import { formatMoney } from '@/lib/utilis'
import { useRouter } from 'expo-router'
import { useEstateStore } from '@/store/property'

const saved = () => {

   const IP_ADDRESS = "172.24.35.184";

   const {user}=useUser()
   const router=useRouter()
const sdata = useEstateStore((state: any) => state.saved);
   const savedd = useEstateStore((state: any) => state.savedIds || []); // Fallback to empty array
   const loading = useEstateStore((state: any) => state.isLoading);
   const fetchSaved = useEstateStore((state: any) => state.fetchSavedProperties);

   useEffect(() => {
     if (user?.id) {
       fetchSaved(user.id);
     }
   }, [user?.id]); // Only runs when user ID is available

   // If sdata is undefined, fallback to []
   const dataToRender = sdata.map((item:any)=>item.property)
  if(loading)
  {
    return <ActivityIndicator size={40} className='flex-1 ' style={{ backgroundColor:COLORS.background}}/>
  }
  return (
    <View className='flex-1' style={{backgroundColor:COLORS.background}}>
      <SafeAreaView>
        <View className='w-[95%] mx-auto mt-2 '>
        <Text className='text-2xl font-bold'>Saved Properties</Text>
        <Text className='text-[14px] font-extralight mb-3'>{sdata.length} Property saved</Text>

        <FlatList
          data={dataToRender}
          keyExtractor={item => item.id}
         className='mb-32'
          renderItem={({ item }) => {

            return (
              <TouchableOpacity className={`w-full p-1 flex-row gap-5 rounded-lg ${item.is_sold?'bg-white/35':'bg-[#fff5f8]'} `}  onPress={() => { router.push(`/properties/${item.id}` as any) }} >
                <Image
                  source={{ uri: item.images[0] }}
                  resizeMode='cover'
                  style={{ width: '28%', height: 100 }}
                  className='rounded-lg'
                />

             
                <View className='w-[67%] '>
                  
                     <View className='flex-row  justify-between '>
                    <Text className='font-bold'style={{ color: COLORS.textDark }}>{item.title.slice(0,26)}...</Text>
                    <Ionicons name="heart" color={(savedd.includes(item.id)?'red':'black')} size={20}/>
                  </View>
                  <Text className='font-bold ' style={{ color: COLORS.textDark }}>
                    <Ionicons name="location-outline" size={15} />
                    {item.address}
                  </Text>
                  <View >
                    <Text className='font-bold text-emerald-700'>₹{formatMoney(item.price)}</Text>
                    <View className='flex-row items-center'>

                      <View className="flex-row items-center justify-center gap-1">
                        <Ionicons name="bed-outline" size={16} color="black" />
                        <Text className="text-[13px]">
                          {item.bedrooms}
                        </Text>
                      </View>
                      <Text>    <Ionicons name="expand-outline" />{item.area_sqft} Sqft</Text>
                    </View>
                  </View>
                </View>
               {item.is_sold&&<View className='absolute bg-red-600 w-30 rounded-lg  left-2 p-1 top-2 justify-center'>
                  <Text className='text-white text-[14px] text-center font-bold'>
                    Sold🥺
                  </Text>
                </View>}
              </TouchableOpacity>
            )
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        />
        {
          sdata.length==0&&
          <View className='mt-48 mx-auto items-center justify-center'>
            <Ionicons name='heart-dislike' color={'red'} size={50}/>
            <Text className='text-xl font-bold'>NO SAVED PROPERTIES</Text>
          </View>
        }
      </View>
  </SafeAreaView>
    </View>
  )
}

export default saved