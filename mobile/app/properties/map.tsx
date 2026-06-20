import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/color';

const Mapp = () => {
  const { lat, lang ,title} = useLocalSearchParams<any>();
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lang);
  const openInMaps = () => {
      // Create the URL scheme for maps
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${latitude},${longitude}`;
      const label = title;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });
  if (!url) return;
      Linking.openURL(url);
    };
  // Convert params to numbers explicitly
 const router=useRouter()

  return (
    // Flex-1 ensures the container fills the screen

    <SafeAreaView className="flex-1">
   <View className='flex-row items-center justify-between '>
    <Text className=' font-bold'>{title.slice(0,25)}...</Text>
    <TouchableOpacity className='border p-1 rounded-lg ' style={{backgroundColor:COLORS.textDark }}
     onPress={openInMaps}
    >
      <Text className='text-xl text-white'> <Ionicons name="airplane-sharp"/> Google maps</Text>
    </TouchableOpacity>
   </View>
      <WebView
        source={{ 
          uri: `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.003}%2C${latitude - 0.003}%2C${longitude + 0.003}%2C${latitude + 0.003}&layer=mapnik&marker=${latitude}%2C${longitude}` 
        }}
        
        className="flex-1"
      />
        <View className='absolute left-3 top-28'>
                    <Ionicons name="arrow-back" className='border rounded-full bg-gray-500/50' size={26} onPress={()=>{router.push("/")}}/>
                </View>
    </SafeAreaView>
  );
};

export default Mapp;