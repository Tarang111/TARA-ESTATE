import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Image } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import COLORS from '@/color';
import { formatMoney } from '@/lib/utilis';
import { useEstateStore } from '@/store/property';

const Search = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // Added filter state
  // const [allProperties, setAllProperties] = useState([]);
  const [bed, setbed] = useState("Any")
const [nfilter,setnfilter]=useState(0)
 
  const [visible, setVisible] = useState(false);
  const [sprice, setsprice] = useState("")
  const [eprice, seteprice] = useState("")
     const allProperties = useEstateStore((state :any) => state.estates);
      const fetchEstates = useEstateStore((state:any) => state.fetchEstates);
       const loading=useEstateStore((state:any)=>state.isloading)
  useEffect(() => {
  fetchEstates()
    // const fetchAllData = async () => {
    //   try {
    //     const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/properties`);
    //     setAllProperties(response.data.pdata);
    //   } catch (error) {
    //     console.error("Error fetching properties:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchAllData();
  }, []);
  function handlefilter() {
   if(bed!=="Any")
   {
    setnfilter(prev=>prev+1)
   }
  

   if(filterType!=="All")
   {
    setnfilter(prev=>prev+1)
   }
   
   if(sprice!==""||eprice!=="")
   {
    setnfilter(prev=>prev+1)
   }
 
  }
 
 const filteredData = useMemo(() => {
   
   return allProperties.filter((item: any) => {
    
    
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.address.toLowerCase().includes(query.toLowerCase()) ||
      item.price.toString().includes(query) ||
      JSON.stringify(item.area_sqft).includes(query);

    // 2. Property Type Filter
    const matchesType = filterType === "All" || item.type.toLowerCase() === filterType.toLowerCase();

    // 3. Bedrooms Filter
    const matchesBed = bed === "Any" || item.bedrooms.toString() === bed;

    // 4. Price Range Filter
    const min = sprice ? parseInt(sprice) : 0;
    const max = eprice ? parseInt(eprice) : Infinity;
    const matchesPrice = item.price >= min && item.price <= max;

    return matchesQuery && matchesType && matchesBed && matchesPrice;
  });
}, [query, filterType, bed, sprice, eprice, allProperties]);
  return (
    <SafeAreaView className='flex-1' style={{ backgroundColor: COLORS.background }}>
      <View className='w-[95%] mx-auto mt-4'>
        <Text className='font-bold text-xl mb-2'>Search Properties</Text>

        {/* Search Input */}
        <View className='border flex-row  w-[95%] mx-auto rounded-lg items-center' style={{ backgroundColor: COLORS.inputBackground }} onFocus={() => { router.push('/search') }}>
          <TextInput
            placeholder='Search here'
            className=' w-[90%]'
            placeholderTextColor={'black'}
            onChangeText={setQuery}

          />
         <View>
           <Ionicons name="options" size={28} color={'#7d2150'} className=' p-0.5 rounded-lg' onPress={() => { setVisible(true),setnfilter(0) }} />
            <View className='bg-red-800 absolute right-0 rounded-full  w-4 h-4 flex justify-center items-center'>
              <Text className='text-white text-[10px]'>{nfilter>0?nfilter:0}</Text>
            </View>
         </View>
        </View>

        {/* Filter Buttons */}
        <View className='w-[95%] mx-auto flex-row gap-2 mt-2'>
          {filterType!=="All"&&
        <View style={{backgroundColor:COLORS.textDark}} className='flex-row gap-1 px-1 py-1 items-center rounded-lg'>
            <Text className=' w-fit  font-bold text-white ' style={{backgroundColor:COLORS.textDark}}>{filterType}</Text>
            <Ionicons name="close-circle-outline" size={20} color={'white'} onPress={()=>{setFilterType("All")}}/>
        </View>
          
          }
          {bed!=="Any"&&
           <View style={{backgroundColor:COLORS.textDark}} className='flex-row gap-1 px-1 py-1 items-center rounded-lg'>
           <Text className=' w-fit  font-bold text-white ' style={{backgroundColor:COLORS.textDark}}>{bed} beds</Text>
            <Ionicons name="close-circle-outline" size={20} color={'white'} onPress={()=>{setbed("Any")}}/>
        </View>
       
          
          }
        </View>
       

        {loading ? (
          <ActivityIndicator className="mt-10" size="large" color="#7d2150" />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item: any) => item.id.toString()}
            className="mt-4 mb-20"
            renderItem={({ item }) => {

              return (
                <TouchableOpacity className='w-full p-1 flex-row gap-5 rounded-lg ' style={{ backgroundColor: COLORS.cardBackground }} onPress={() => { router.push(`/properties/${item.id}` as any) }} >
                  <Image
                    source={{ uri: item.images[0] }}
                    resizeMode='cover'
                    style={{ width: '28%', height: 100 }}
                    className='rounded-lg'
                  />


                  <View className='w-[67%] '>

                    <View className='flex-row  justify-between '>
                      <Text className='font-bold' style={{ color: COLORS.textDark }}>{item.title.slice(0, 26)}...</Text>

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
                </TouchableOpacity>
              )
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            ListEmptyComponent={
              <Text className="text-center mt-10 text-gray-400">No properties match your filter.</Text>
            }
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          {/* Overlay */}
          <View className="flex-1 bg-black/50 justify-end">

            {/* Modal Content - Aligned to bottom */}
            <View className="w-full  bg-white rounded-t-[30px] p-6 pb-10 shadow-lg" >

              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text className="text-2xl font-bold">✕</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold">Filters</Text>
                <TouchableOpacity className='border  px-3 py-2 rounded-lg  ' style={{ backgroundColor: COLORS.textDark }} onPress={() => { setFilterType("All"), setbed("Any"), seteprice(""), setsprice("") }}>
                  <Text className='font-bold text-white'>Reset</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Property Type Section */}
                <Text className="font-bold text-lg mb-4">Property Type</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {['All', 'Apartment', 'House', 'Villa', 'Studio'].map((item) => (
                    <TouchableOpacity key={item} className={`px-5 py-2 rounded-full border ${item === filterType ? 'bg-[#5a1836]' : 'bg-white border-gray-300'}`} onPress={() => { setFilterType(item) }} >
                      <Text className={item === filterType ? 'text-white' : 'text-gray-700'}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Bedrooms Section */}
                <Text className="font-bold text-lg mb-4">Bedrooms</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {['Any', '1', '2', '3', '4'].map((item) => (
                    <TouchableOpacity key={item} className={`px-6 py-2 rounded-xl border ${item === bed ? 'bg-[#5a1836]' : 'bg-white border-gray-300'}`} onPress={() => { setbed(item) }}>
                      <Text className={item === bed ? 'text-white' : 'text-gray-700'}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Price Range Section */}
                <Text className="font-bold text-lg mb-4">Price Range (₹)</Text>
                <View className="flex-row justify-between gap-1 mb-4">
                  <TextInput
                    className='border w-[49%] rounded-lg border-gray-700 '
                    placeholder='₹0'
                    keyboardType="number-pad"
                    value={sprice}
                    onChangeText={setsprice}
                  />
                  <TextInput
                    className='border w-[49%] rounded-lg border-gray-700 '
                    placeholder='Any ₹'
                    keyboardType="number-pad"
                    value={eprice}
                    onChangeText={seteprice}
                  />


                </View>
              </ScrollView>

              {/* Apply Button */}
              <TouchableOpacity
                onPress={() => {setVisible(false),handlefilter()}}
                className="bg-[#5a1836] p-4 rounded-xl items-center mt-4"
              >
                <Text className="text-white font-bold text-lg">Apply Filters</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Search;