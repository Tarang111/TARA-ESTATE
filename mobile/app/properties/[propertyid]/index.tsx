import { View, Text, ScrollView, FlatList, Image, Dimensions,TouchableOpacity, Platform, Linking, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import COLORS from '@/color';
import axios from 'axios';
import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { formatMoney } from '@/lib/utilis';
import { WebView } from 'react-native-webview';


const { width } = Dimensions.get('window');

const index = () => {
  const { propertyid } = useLocalSearchParams();
    const { user, isLoaded, isSignedIn } = useUser()
    const [sdata, setsdata] = useState<any>([])
    const [visible,setvisible]=useState(false)
    const [savedd,setsavedd]=useState<any>([])
  const [property, setproperty] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0); // Track current image index
  const IP_ADDRESS = "172.24.35.184";
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [soldmodal,setsoldmodal]=useState(false)
  const [imageViewerVisible,setImageViewerVisible]=useState(false)
  const [deleting,setdeleting]=useState(false)
  async function getdata() {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://${IP_ADDRESS}:3000/getuserbyid`, {
        params: { id: user.id }
      });
      setAdmin(res.data?.user?.is_admin || false);
      
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function deleteprop() {
    setdeleting(true)
    try {
       const images=await axios.post(`http://${IP_ADDRESS}:3000/delete-images`,{
        publicIds:property.publicIds
       },{headers:{'Content-Type':'application/json'}})
      if(images.data.success)
      {

        const data=await axios.post(`http://${IP_ADDRESS}:3000/deleteprop`,{
         prop_id:propertyid
        },{headers:{'Content-Type':'application/json'}})
        if(data.data.success)
        {
         setvisible(false)
         router.push("/")
        }
      }
    } catch (error) {
      console.log(error);
      
    }
    finally{
      setdeleting(false)
    }
  }
async function marksoldprop() {
    try {
       const data=await axios.post(`http://${IP_ADDRESS}:3000/marksoldprop`,{
        prop_id:propertyid
       },{headers:{'Content-Type':'application/json'}})
       if(data.data.success)
       {
        getproperty()
        setsoldmodal(false)
       }
    } catch (error) {
      console.log(error);
      
    }
  }

  async function getproperty() {
    const data = await axios.get(`http://${IP_ADDRESS}:3000/property`, {
      params: { id: propertyid }
    })
    setproperty(data.data.property)
   
    
  }

 
  async function getsproperties() {
    try {
      const data = await axios.get(`http://${IP_ADDRESS}:3000/savedproperties`,{
         params: { id: user?.id }
      })
     
      setsdata(data.data.sdata)
    const ids = data.data.sdata.map((item: any) => item.property_id);
    setsavedd(ids);
  
   

    } catch (error) {
      console.log(error);

    }
  }
 
 async function handlelike() {
  // 1. Determine if the property is currently saved
  const isCurrentlySaved = savedd.includes(propertyid);

  // 2. OPTIMISTIC UPDATE: Update UI immediately
  if (isCurrentlySaved) {
    // Remove from UI
    setsavedd((prev: any) => prev.filter((id: any) => id !== propertyid));
  } else {
    // Add to UI
    setsavedd((prev: any) => [...prev, propertyid]);
  }

  try {
    // 3. Perform actual server request
    await axios.post(`http://${IP_ADDRESS}:3000/save`, {
      user_id: user?.id,
      p_id: propertyid
    }, { headers: { 'Content-Type': 'application/json' } });

    // 4. (Optional) Sync with server state
    getsproperties(); 
  } catch (error) {
    console.log(error);
    // 5. ROLLBACK: If it fails, revert the UI to the previous state
    getsproperties(); 
  }
}
   useEffect(() => {
    getproperty()
     getdata();
    getsproperties()
  }, [propertyid,user])
if(deleting)
  {
    return <View className='flex-1 justify-center items-center gap-4' style={{backgroundColor:COLORS.background}}>
      <Text className='font-bold text-xl'>Deleting Property Wait...🚀</Text>
      <ActivityIndicator size={40}/>
    </View>
  
}
  return (
    <View className='flex-1 ' style={{ backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
       

        <View style={{ height: 300 }}>
          <FlatList
            data={property?.images}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled // Makes it snap to each image
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setCurrentIndex(Math.round(x / width)); // Calculate index
            }}
            renderItem={({ item }) => (
              <View style={{ width: width  }}>
                <Image
                  source={{ uri: item }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='cover'
                />
              {property?.is_sold&&<View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      justifyContent: 'center', // Center the tape vertically if desired
      zIndex: 30 
    }}>
                <Image
                  source={require('../../../assets/images/editable-psd-warning-tape-danger-stripes-police-crime.png')}
                  style={{ width: '100%', height: '100%' }}
                
                />
              </View>}
              </View>
            )}
          />
          
          {/* Counter Overlay */}
          <View className='absolute bottom-2 right-4 bg-black/50 px-2 py-1 rounded-full'>
            <Text style={{ color: 'white' }}>
              {currentIndex + 1} / {property?.images?.length || 0}
            </Text>
          </View>
          <View className='absolute right-7 top-14'>
              <Ionicons name="heart" color={(savedd.includes(propertyid)?'red':'black')} size={30} onPress={()=>{handlelike()}}/>
          </View>
          <View className='absolute left-3 top-14'>
              <Ionicons name="arrow-back" className='border rounded-full bg-gray-500/50' size={26} onPress={()=>{router.push("/")}}/>
          </View>
        </View>

      <View className='flex-row items-center gap-2'>

          <View  style={{backgroundColor:COLORS.textDark}} className='w-32 rounded-lg ml-1 mt-1 px-1 py-1'>
          <Text className='text-center font-bold text-[12px] text-white'>{property?.type.toUpperCase()}</Text>
          </View>
         {property?.is_sold&& <View   className='w-32 bg-red-700 rounded-lg ml-1 mt-1 px-1 py-1'>
          <Text className='text-center font-bold text-[12px] text-white'>SOLD</Text>
          </View>}
      </View>
          <View className='ml-1 gap-3 p-1'>
            <Text className='text-xl font-bold' style={{color:COLORS.textDark}}>{property?.title}</Text>
             <Text className='font-bold text-xl text-emerald-700'>₹{formatMoney(parseInt(property?.price))}</Text>
            
            

            <View className="flex-row items-center justify-between  w-[96%]">

                                    <View  className='items-center justify-center'>
                                       <Ionicons name="bed-outline" color={"#5a1836"} size={22}  />
                                     <Text className="text-xl text-[#5a1836]">
                                       {property?.bedrooms}
                                     </Text>
                                     <Text className="text-[#5a1836]">Beds</Text>
                                    </View>
                                    <View  className='items-center justify-center'>
                                      <Ionicons name="expand-outline" color={"#5a1836"} size={20}/>
                                      <Text className='text-xl text-[#5a1836]'> {property?.area_sqft}</Text>
                                       <Text className="text-[#5a1836]">Sqft</Text>
                                    </View>
                                     <View  className='items-center justify-center'>
                                      <Ionicons name="water" color={"#5a1836"} size={22}/>
                                      <Text className='text-xl text-[#5a1836]'> {property?.bathrooms}</Text>
                                      <Text className="text-[#5a1836]">Bathrooms</Text>
                                    </View>
                                     <View  className='items-center justify-center gap-1'>
                                      <Ionicons name="home-outline" color={"#5a1836"} size={22}/>
                                      <Text className='text-[14px] text-[#5a1836]'> {property?.type.toUpperCase()}</Text>
                                      <Text className='text-[#5a1836]'>Type</Text>
                                    </View>
             </View>
            
            <View>
              <Text className='text-xl font-bold' style={{color:COLORS.textDark}}>
                Description
              </Text>
              <Text className='text-[16px] font-light' style={{color:COLORS.textDark}}>{property?.description}</Text>
            </View>
            <View>
              <Text className='text-xl font-bold' style={{color:COLORS.textDark}}>
              Location
              </Text>
              <Text className='text-[16px] font-light' style={{color:COLORS.textDark}}><Ionicons name="location" size={16}/>{property?.address},{property?.city}</Text>
            </View>
                    
                                   
             
          </View>
          {/* map */}
          {!property?.is_sold&&<View className="mt-4  px-1">
  <Text className="text-xl font-bold mb-2" style={{ color: COLORS.textDark }}>
    Map View
  </Text>
  
  <TouchableOpacity 
    onPress={() => {

     router.push({
      pathname:"/properties/map",
    params:{
      lat:property?.latitude,
      lang:property?.longitude,
      title:property?.title
    }
     })
    }}
    className="h-56  rounded-xl overflow-hidden border border-gray-200"
  >
    <WebView
      source={{ 
        uri: `https://www.openstreetmap.org/export/embed.html?bbox=${property?.longitude - 0.003}%2C${property?.latitude - 0.003}%2C${property?.longitude + 0.003}%2C${property?.latitude + 0.003}&layer=mapnik&marker=${property?.latitude}%2C${property?.longitude}` 
      }} 
    
      scrollEnabled={false}
      pointerEvents="none"
    />
  </TouchableOpacity>
          </View>}

          {/* whatsapp */}
        { !property?.is_sold&&<TouchableOpacity className='border mt-1 mb-5 bg-emerald-700 gap-2 justify-center  w-[98%] mx-auto px-2 py-2 rounded-lg flex-row items-center'
          onPress={() => {
    const phoneNumber = "918081258060"; // Include country code, no +, no spaces
    const message = `Hello☺️, I am interested in this property. ${property?.images[0]} property_id:${propertyid}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url);
  }}
          >
            <Ionicons name="logo-whatsapp" size={25} color={"#34d399"}/>
            <Text className='text-xl  font-bold text-white'>Contact Agent</Text>
          </TouchableOpacity>}

          {/* Admin function */}
         {admin&&<View className='flex-row gap-1 w-[97%] mx-auto mb-5'>
            <TouchableOpacity className='border px-2 w-[50%] rounded-lg py-4 bg-yellow-800' onPress={()=>{setsoldmodal(true)}}>
              <Text className='font-bold text-center text-white'>{property?.is_sold?'UNMARK':'MARK SOLD'}</Text>
            </TouchableOpacity>
             <TouchableOpacity className='border px-2   w-[50%] rounded-lg py-4 bg-red-800' onPress={()=>{setvisible(true)}}>
              <Text className='font-bold text-center text-white' >Delete</Text>
            </TouchableOpacity>
           </View>}
           <Modal
           transparent={true}
           visible={visible}
       
           animationType='slide'
           onRequestClose={() => setvisible(false)}
           >
            <View className='flex-1 justify-end w-[98%] mx-auto '>
             <View className='h-40 rounded-t-lg gap-10 ' style={{backgroundColor:COLORS.cardBackground}}>
              
              <View  className='flex-row p-1 items-center gap-10'>
                <Ionicons name="close" className='border w-fit rounded-full bg-gray-500/50' size={26} onPress={()=>{setvisible(false)}}/>
                <Text className='text-2xl font-bold'>Are you sure to delete ???</Text>
              </View>

              <View className='flex-row gap-1 w-[97%] mx-auto mb-5'>
            <TouchableOpacity className='border px-2 w-[50%] rounded-lg py-4 bg-red-800' onPress={()=>{deleteprop()}}>
              <Text className='font-bold text-center text-white'>Yes</Text>
            </TouchableOpacity>
             <TouchableOpacity className='border px-2   w-[50%] rounded-lg py-4 bg-emerald-500' onPress={()=>{setvisible(false)}}>
              <Text className='font-bold text-center text-white' >No</Text>
            </TouchableOpacity>
           </View>
             </View>
            </View>

           </Modal>
    
            <Modal
           transparent={true}
           visible={soldmodal}
       
           animationType='slide'
           onRequestClose={() => setsoldmodal(false)}
           >
            <View className='flex-1 justify-end w-[98%] mx-auto '>
             <View className='h-40 rounded-t-lg gap-10 ' style={{backgroundColor:COLORS.cardBackground}}>
              
              <View  className='flex-row p-1 items-center gap-2'>
                <Ionicons name="close" className='border w-fit rounded-full bg-gray-500/50' size={26} onPress={()=>{setsoldmodal(false)}}/>
                <Text className='text-2xl font-bold'>Are you sure to {property?.is_sold?'UNMARK':'MARK'} SOLD ?</Text>
              </View>

              <View className='flex-row gap-1 w-[97%] mx-auto mb-5'>
            <TouchableOpacity className='border px-2 w-[50%] rounded-lg py-4 bg-red-800' onPress={()=>{marksoldprop()}}>
              <Text className='font-bold text-center text-white'>Yes</Text>
            </TouchableOpacity>
             <TouchableOpacity className='border px-2   w-[50%] rounded-lg py-4 bg-emerald-500' onPress={()=>{setsoldmodal(false)}}>
              <Text className='font-bold text-center text-white' >No</Text>
            </TouchableOpacity>
           </View>
             </View>
            </View>

           </Modal>

      
      </ScrollView>
    </View>
  )
}

export default index