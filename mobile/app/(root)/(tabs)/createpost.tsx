import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import COLORS from '@/color'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Checkbox from 'expo-checkbox';

import axios from 'axios';
import { router } from 'expo-router';
import { uploadToCloudinary } from '@/lib/cloudinary';
const createpost = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [title,settitle]=useState("")
   const [Price,setprice]=useState("")
   const [type,settype]=useState("Apartment")
   const [bedroom,setbedroom]=useState(0)
   const [bathroom,setbathroom]=useState(0)
   const [area,setarea]=useState("")
    const [city,setcity]=useState("")
     const [address,setaddress]=useState("")
     const [lat,setlat]=useState("")
      const [long,setlong]=useState("")
      const IP_ADDRESS = "172.24.35.184";
      const [isChecked, setChecked] = useState(false);
      const [uploading,setuplading]=useState(false)
      const [loading,setloading]=useState(false)
      const [images,setimages]=useState<string[]>([]);
      const [publicid,setpublicid]=useState<string[]>([]);
    const [Description,setdescription]=useState("")
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map((asset) => asset.uri));
    }
  };
  const handleLocation = async () => {
    setloading(true)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return alert('Permission Denied');
    let loc = await Location.getCurrentPositionAsync({});
   
   setloading(false)
    setlat(loc.coords.latitude.toString())
    setlong(loc.coords.longitude.toString())
  };
  const handlesubmit = async () => {
 setuplading(true)
  try {
 if (
    title.trim() === "" ||
    city.trim() === "" ||
    address.trim() === "" ||
    Description.trim() === "" ||
    Price.trim() === "" ||
    selectedImages.length === 0||
    lat===""||
    long===""||
    area===""||
    bedroom<=0||
    bathroom<=0

  ) {
    Alert.alert("Error", "Please fill in all required fields and select at least one image.");
    return false;
  }
    const uploadedUrls = await Promise.all(
      selectedImages.map((uri) => uploadToCloudinary(uri))
    );
  const secure_urls= uploadedUrls.map((item)=>item.secure_url)
   const urls= uploadedUrls.map((item)=>item.url)
   
   if(secure_urls&&urls)
   {

     const data=await axios.post(`http://${IP_ADDRESS}:3000/createproperty`,{
       title,
       price: Price,
       type,
       bedroom,
       bathroom,
       area,
       city,
       address,
       lat,
       long,
       isChecked,
       description: Description,
       images: secure_urls,    // The array of URLs from Cloudinary
       publicid: urls // The array of IDs from Cloudinary
 
     },{headers:{'Content-Type':'application/json'}})
    if(data.data.success)
    {
     router.push({
       pathname:"/",
       params:{
         success:"kardo"
       }
     })
    }
   }
   
  } catch (e) {
    console.log(e);
    
    Alert.alert("Upload Error", "Try again later.");
  } finally {
    setuplading(false)
  settitle("");
  setprice("");
  settype("Apartment");
  setbedroom(0);
  setbathroom(0);
  setarea("");
  setcity("");
  setaddress("");
  setlat("");
  setlong("");
  setChecked(false);
  setimages([]);
  setpublicid([]);
  setdescription("")
  setSelectedImages([])
  }
};
  if(loading)
  {
    return <View className='flex-1 justify-center items-center gap-4' style={{backgroundColor:COLORS.background}}>
      <Text className='font-bold text-xl'>DETECTING LOCATION PLEASE WAIT😎🤏</Text>
      <ActivityIndicator size={40}/>
    </View>
  
}
if(uploading)
  {
    return <View className='flex-1 justify-center items-center gap-4' style={{backgroundColor:COLORS.background}}>
      <Text className='font-bold text-xl'>Adding Property Wait...🚀</Text>
      <ActivityIndicator size={40}/>
    </View>
  
}
  return (
  <View className='flex-1' style={{backgroundColor:COLORS.background}}>
    <SafeAreaView className='w-[98%] mx-auto '>
      <ScrollView showsVerticalScrollIndicator={false}>

      <View>
        <Text className='text-2xl font-bold mb-10'>Add Property</Text>
         <Text className='font-bold'>Photos</Text>

        {selectedImages.length === 0 ? (
                <TouchableOpacity onPress={pickImage} className='border-2 border-dashed border-gray-400 h-40 justify-center items-center bg-[#f4faf5] rounded-xl' style={{backgroundColor:COLORS.cardBackground}}>
                  <Text className='font-bold text-xl ' style={{color:COLORS.textDark}}>(Max 6)</Text>
                  <Ionicons name='camera-outline' size={40}/>

                </TouchableOpacity>
              ) : (
                <View>
                  <FlatList data={selectedImages} horizontal keyExtractor={(item) => item} renderItem={({ item }) => <Image source={{ uri: item }} className='w-32 h-32 rounded-lg mr-2' />} />
                  <TouchableOpacity className='mt-2 p-2 rounded-lg bg-red-500 w-32' onPress={() => setSelectedImages([])}>
                    <Text className='text-white text-center font-bold'>Discard All</Text>
                  </TouchableOpacity>
                </View>
              )}

<View className='mt-2'>
  <Text className='font-bold'>Title</Text>
  <TextInput 
   className='border rounded-lg'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground}}
   placeholder='ABC building'
   value={title}
   onChangeText={settitle}
  />
</View>

<View className='mt-2'>
  <Text className='font-bold'>Decription</Text>
  <TextInput 
   className='border rounded-lg'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground}}
   placeholder='Super finishing....'
   value={Description}
   onChangeText={setdescription}
  />
</View>

<View className='mt-2'>
  <Text className='font-bold'>Price(₹)</Text>
  <TextInput 
   className='border rounded-lg'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground}}
   placeholder='₹1 to ₹9,99,99,999'
   value={Price}
   onChangeText={setprice}
   keyboardType='number-pad'
  />
</View>
{/* type */}
<View className='mt-2 '>
  <Text className='font-bold mb-2'>Property Type</Text>
  <View className='flex-row gap-2'>
    <TouchableOpacity className={`border rounded-lg w-24 px-1 py-2 ${type=="Apartment"?'bg-[#5a1836]':'bg-gray-500'}`}
    onPress={()=>{
      settype("Apartment")
    }}
    >
      <Text className='text-center font-bold text-white'>Apartment</Text>
    </TouchableOpacity>
      <TouchableOpacity className={`border rounded-lg w-24 px-1 py-2 ${type=="Villa"?'bg-[#5a1836]':'bg-gray-500'}`}
      onPress={()=>{
        settype("Villa")
      }}
    
      >
      <Text className='text-center font-bold text-white'>Villa</Text>
    </TouchableOpacity>
      <TouchableOpacity className={`border rounded-lg w-24 px-1 py-2 ${type=="House"?'bg-[#5a1836]':'bg-gray-500'}`}
      onPress={()=>{
        settype("House")
      }}
      >
      <Text className='text-center font-bold text-white '>House</Text>
    </TouchableOpacity>
      <TouchableOpacity className={`border rounded-lg w-24 px-1 py-2 ${type=="Studio"?'bg-[#5a1836]':'bg-gray-500'}`}
      onPress={()=>{
        settype("Studio")
      }}
      >
      <Text className='text-center font-bold text-white'>Studio</Text>
    </TouchableOpacity>
  </View>
</View>
{/* bedroom bathroom */}
<View className='mt-2 flex-row gap-5'>
 <View>
  <Text className='font-bold mb-1'>Bedrooms</Text>
  <TouchableOpacity className='flex-row items-center border w-36 justify-between p-2 rounded-2xl'>
    {<Ionicons name="remove-outline" size={25} className='' onPress={()=>{setbedroom(prev=>prev-1)}} disabled={bedroom<0}/>}
    <Text className='text-xl font-bold'>{bedroom>0?bedroom:0}</Text>
    <Ionicons name="add" size={25} onPress={()=>{setbedroom(prev=>prev+1)}} />
  </TouchableOpacity>
 </View>


 <View>
  <Text className='font-bold mb-1'>Bathrooms</Text>
  <TouchableOpacity className='flex-row items-center border w-36 justify-between p-2 rounded-2xl'>
    {<Ionicons name="remove-outline" size={25} className='' onPress={()=>{setbathroom(prev=>prev-1)}} disabled={bathroom<0}/>}
    <Text className='text-xl font-bold'>{bathroom>0?bathroom:0}</Text>
    <Ionicons name="add" size={25} onPress={()=>{setbathroom(prev=>prev+1)}} />
  </TouchableOpacity>
 </View>

</View>

<View className='mt-2'>
  <Text className='font-bold'>Area Sqft</Text>
  <TextInput 
   className='border rounded-lg'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground}}
   placeholder='1800...'
   value={area}
   onChangeText={setarea}
   keyboardType='number-pad'
  />
</View>

<View className='mt-2'>
  <Text className='font-bold'>City</Text>
  <TextInput 
   className='border rounded-lg'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground}}
   placeholder='Noida...'
   value={city}
   onChangeText={setcity}
  />
</View>

<View className='mt-2'>
  <Text className='font-bold'>Address</Text>
  <TextInput 
   className='border rounded-lg'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground,minHeight:100}}
   placeholder='xyz colony ....'
   value={address}
   multiline={true}
   textAlignVertical="top"
   onChangeText={setaddress}
  
  />
</View>
{/* lat lan */}
<View className='mt-2'>
<View className='flex-row justify-between items-center'>
    <Text className='font-bold'>Cordinates</Text>
    <TouchableOpacity className='flex-row items-center ' onPress={()=>{handleLocation()}}>
      <Text className='font-bold text-blue-700'>Detect location</Text>
      <Ionicons name='locate' color={'blue'}/>
    </TouchableOpacity>
</View>
  <View className='flex-row gap-2'>
    <View className='w-[48%]'>
      <Text>Latitude</Text>
    <TextInput 
   className='border rounded-lg w-full'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground}}
   placeholder='Latitude'

  value={lat}
   onChangeText={setlat}
   keyboardType='number-pad'
  />
    </View>
  <View className=' w-[48%]'>
    <Text>Longitude</Text>
    <TextInput 
   className='border rounded-lg w-full'
   style={{color:COLORS.placeholderText,backgroundColor:COLORS.inputBackground}}
   placeholder='Longitude'
   value={long}
   onChangeText={setlong}
   keyboardType='number-pad'
  />
  </View>
  </View>

</View>

<View className='flex-row justify-between items-center border rounded-lg p-2 mt-2' style={{backgroundColor:COLORS.inputBackground}}>
 <View>
   <Text className='font-bold'>Featured Property</Text>
  <Text className='font-light'>Show this property on top</Text>
 </View>
<Checkbox
        value={isChecked}
        onValueChange={setChecked}
        color={isChecked ? '#2e5a2e' : undefined}
        style={{ width: 24, height: 24, borderRadius: 20 }}
      />

</View>
<TouchableOpacity className='bg-emerald-900 rounded-lg mt-5 mb-5 py-4 px-3 ' style={{backgroundColor:COLORS.textDark}} onPress={()=>{handlesubmit()}}>
  <Text className='text-white text-center font-bold'>Add Property</Text>
</TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  </View>
  )
}

export default createpost