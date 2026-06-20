import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useAuth, useClerk, useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';

import COLORS from "../../color"

const signup = () => {
//   const COLORS = {
//   primary: "#EC407A", 
//   textPrimary: "#7d2150", 
//   textSecondary: "#b06a8f", 
//   textDark: "#5a1836", 
//   placeholderText: "#767676",
//   background: "#fce4ec", 
//   cardBackground: "#fff5f8", 
//   inputBackground: "#fef8fa", 
//   border: "#f8bbd0",
//   white: "#ffffff",
//   black: "#000000",
// };
const { setActive } = useClerk();
    const {signUp,fetchStatus,errors}=useSignUp()
   const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const isloading = fetchStatus==="fetching"
  const [pendingVerification, setPendingVerification] = useState(false);
  const router=useRouter()
   async function signupkaro() {
     const { error }= await signUp.password({
      emailAddress:email,
      firstName,
      lastName
      ,password
     })
      if(error) return alert("OOPS!!! TRY AGAIN")
       if(!error) await signUp.verifications.sendEmailCode()
       
   }
 async function verifycode() {
  await signUp.verifications.verifyEmailCode({
      code,
    });

   if (signUp.status === "complete") {
  await signUp.finalize({
    navigate: ({ decorateUrl }) => {
      const url = decorateUrl("/");
      router.replace(url as any);
    },
  });
}
     else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  

const onVerifyPress = async () => {
  if (!signUp) return;

  try {
    
    const completeSignUp = await signUp.verifications.verifyEmailCode({
      code,
    });

    // 2. Check the status of the RESULT of the attempt
    if (signUp.status === 'complete') {
      // 3. IMPORTANT: Set the session as active
      await setActive({ session: signUp.createdSessionId });
      
      // 4. Redirect to home
      router.replace('/');
    } else {
      // If it's not complete, log why (usually missing phone or other requirements)
      console.log('Status is still:', signUp.status);
      console.log('Missing fields:', signUp.missingFields);
    }
  } catch (err: any) {
    // This catches invalid codes or expired codes
    console.error(JSON.stringify(err, null, 2));
    alert(err.errors?.[0]?.longMessage || "Verification failed. Please check the code.");
  }
};

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") 
    
  ) 
  {
    return (
      <View className={`flex-1 justify-center items-center px-6`} style={{ backgroundColor: COLORS.background }}>
        <Image
           source={require("../../assets/images/taraestate-removebg-preview.png")}
          className="w-40 h-32 mb-8"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mb-2" style={{color:COLORS.textDark}}>
          Verify your account
        </Text>
        <Text className="text-gray-500 mb-8 text-center" style={{color:COLORS.textDark}}>
          We sent a code to {email}
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl  bg-[#fef8fa]  px-4 py-3 mb-4"
          style={{backgroundColor:COLORS.inputBackground, color:COLORS.placeholderText}}
          placeholder="Enter verification code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {errors.fields.code && (
          <Text className="text-red-500 mb-4">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isloading}
          style={{backgroundColor:COLORS.primary}}
          className="w-full  py-4 rounded-xl items-center mb-4"
        >
          {isloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}
          className="py-2"
        >
          <Text className="" style={{color:COLORS.textPrimary}}>I need a new code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signUp.reset()} className="py-2">
          <Text style={{color:COLORS.textPrimary}}>Start over</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
   <ScrollView contentContainerStyle={{flexGrow:1}} className="bg-[#fce4ec]" keyboardShouldPersistTaps="handled" >
     
    <View className='flex-1 justify-center border px-2 py-2 '>
      <Image
       source={require("../../assets/images/taraestate-removebg-preview.png")}
        className='w-32 h-20'
        resizeMode='cover'
        />
        <Text className='text-3xl font-bold text-[#7d2150] '>Create Account</Text>
        <Text className='text-xl font-extralight text-[#7d2150]'>Find your Dream home</Text>
    <View className=' mt-2 flex-row gap-2'>
         <TextInput className='border rounded-xl bg-[#fef8fa] text-[#767676]  w-[45%] px-4 py-3'
           placeholder='First Name '
           autoCapitalize='words'
           value={firstName}
           onChangeText={setFirstName}
          />
          <TextInput className='border rounded-xl bg-[#fef8fa] text-[#767676]  w-[45%] px-4 py-3'
           placeholder='Last Name'
           autoCapitalize='words'
           value={lastName}
           onChangeText={setLastName}
          />
  </View>
<View className='gap-3 mt-2'>
      <TextInput className='border rounded-xl bg-[#fef8fa] text-[#767676]  w-[92%] px-4 py-3'
           placeholder='Email'
          
           keyboardType='email-address'
           value={email}
           onChangeText={setEmail}
          />
          {errors.fields.emailAddress && (
  <Text className="text-red-500 mb-4 px-4">
    {errors.fields.emailAddress.message}
  </Text>
)}

            <TextInput className='border rounded-xl bg-[#fef8fa] text-[#767676]  w-[92%] px-4 py-3'
           placeholder='Password'
           
           
           value={password}
           onChangeText={setPassword}
          />
          {errors.fields.password && (
  <Text className="text-red-500 mb-4 px-4">
    {errors.fields.password.message}
  </Text>
)}

        </View> 
        <TouchableOpacity disabled={isloading} className='w-[80%]  mt-2 px-4 py-3  bg-[#EC407A]  rounded-xl'
         onPress={signupkaro}
        >
            {
              isloading?(<ActivityIndicator className='text-white'/>):
              <Text className='text-white font-bold text-center'>Sign up</Text>
            }
         </TouchableOpacity> 
         <View className='flex-row gap-1 mt-2'>
          <Text>Already have an account?</Text>
         <Link href={"/(auth)/signin"}> <Text >Sign in</Text></Link>
         </View>
    </View>
    </ScrollView>
  )
}

export default signup

