import { View, Text, Image, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/expo'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '@/color'
import { Ionicons } from '@expo/vector-icons'
import { formatMoney } from '@/lib/utilis'
import { useEstateStore } from '@/store/property'
const index = () => {
  const {success}=useLocalSearchParams<any>()
  const { user, isLoaded, isSignedIn } = useUser()
  // const [userdata, setuserdata] = useState<any>({})
  const [loadingf,setloadingf]=useState(false)
    const [loadingp,setloadingp]=useState(false)
  const [fpdata, setfpdata] = useState<any>([])
  const [pdata, setpdata] = useState<any>([])
    // const [sdata, setsdata] = useState<any>([])
    const estates = useEstateStore((state :any) => state.estates);
    const fetchEstates = useEstateStore((state:any) => state.fetchEstates);
      const efstates = useEstateStore((state :any) => state.featured);
  const fetchfEstates=useEstateStore((state:any)=>state.getFeaturedProperties)
  const loading=useEstateStore((state:any)=>state.isloading)
  const fetchsave=useEstateStore((state:any)=>state.fetchSavedProperties)
  const sdata=useEstateStore((state:any)=>state.savedIds)
  const fetchuser=useEstateStore((state:any)=>state.fetchuser)
    const userdata = useEstateStore((state :any) => state.userr);
const refreshTrigger = useEstateStore((state: any) => state.refreshTrigger);
  const router = useRouter()
  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signin"} />
  }

  
useEffect(() => {
  if (user?.id) {
  if (userdata?.id && userdata.id !== user.id) {
       useEstateStore.getState().invalidatelogout();
    }
    useEstateStore.setState({ 
      estatesFetched: false, 
      featuredFetched: false, 
      savedFetched: false, 
      fetchuserr: false 
    });

    // 2. Fetch fresh data
    fetchuser(user);
    fetchsave(user.id);
    fetchEstates();
    fetchfEstates();
  }
}, [user?.id]);
  return (
    <SafeAreaView className='flex-1' style={{ backgroundColor: `${COLORS.background}` }} >
      <View className='flex flex-row justify-between items-center w-[95%]  mx-auto'>
        <Image
          source={require('../../../assets/images/taraestate-removebg-preview.png')}
          style={{ width: 105, height: 90 }}
        />
        <Text className='font-bold text-xl'>Hello! {userdata?.first_name}🤗</Text>
      </View>
      <View className='border flex-row  w-[95%] mx-auto rounded-lg items-center' style={{backgroundColor:COLORS.inputBackground}} onFocus={()=>{router.push('/search')}}>
        <TextInput
          placeholder='Search here'
          className=' w-[90%]'
          placeholderTextColor={'black'}
        />
        <Ionicons name="options" size={28} color={'#7d2150'} className=' p-0.5 rounded-lg' onPress={()=>{router.push("/search")}}/>
      </View>
      <View className='w-[95%] mx-auto mt-2'>
        <Text className='text-xl font-bold'>Featured</Text>
       
        {loading?
        <ActivityIndicator size={40} color={'blue'}/>
        :
        efstates.length>0?
          <FlatList
          data={efstates}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity className='w-80 p-1 rounded-lg ' style={{ backgroundColor: COLORS.cardBackground }} onPress={() => { router.push(`/properties/${item.id}` as any) }} >
                <Image
                  source={{ uri: item.images[0] }}
                  resizeMode='cover'
                  style={{ width: '100%', height: 150 }}
                  className='rounded-lg'
                />

                <View className='absolute p-2' >
                  <Text className='border rounded-lg px-2 ' style={{ backgroundColor: COLORS.background, color: COLORS.textDark }} >{item.type.toUpperCase()}</Text>
                </View>
                <View className=' '>
                  <View className='flex-row justify-between p-1'>
                    <Text className='font-bold'>{item.title}</Text>
                    <Ionicons name="heart" color={(sdata.includes(item.id)?'red':'black')} size={20}/>
                  </View>
                  <Text className='font-bold '>
                    <Ionicons name="location-outline" size={15} />
                    {item.address}
                  </Text>
                  <View className='flex-row items-center justify-between'>
                    <Text className='font-bold text-emerald-700'>₹{formatMoney(item.price)}</Text>
                    <View className='flex-row items-center'>

                      <View className="flex-row items-center justify-center gap-1">
                        <Ionicons name="bed-outline" size={18} color="black" />
                        <Text className="text-[13px]">
                          {item.bedrooms}
                        </Text>
                      </View>
                      <Text>    <Ionicons name="expand-outline" />{item.area_sqft}</Text>
                    </View>
                  </View>
                </View>
                 {item.is_sold&&<View className='absolute bg-red-600 w-30 rounded-lg  right-2 p-1 top-2 justify-center'>
                  <Text className='text-white text-xl text-center font-bold'>
                    Sold🥺
                  </Text>
                </View>}
              </TouchableOpacity>
            )
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5, gap: 10 }}
        />:<Text>NO PROPERTY FOUND</Text>}
      </View>


      <View className='w-[95%] mx-auto mt-2 flex-1'>
        <Text className='text-xl font-bold'>Properties</Text>

       {loading?
        <ActivityIndicator size={40} color={'blue'}/>
        : <FlatList
          data={estates}
          keyExtractor={item => item.id}

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
                    <Ionicons name="heart" color={(sdata.includes(item.id)?'red':'black')} size={20}/>
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
        />}
      </View>

    </SafeAreaView>
  )
}

export default index