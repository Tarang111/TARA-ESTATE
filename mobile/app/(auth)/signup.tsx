import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useClerk, useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import COLORS from "../../color"

const Signup = () => {
  const { setActive } = useClerk();
  const { signUp, fetchStatus, errors } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const isloading = fetchStatus === "fetching";
  const router = useRouter();

  async function signupkaro() {
    const { error } = await signUp.password({
      emailAddress: email,
      firstName,
      lastName,
      password,
    });
    if (error) return alert("OOPS!!! TRY AGAIN");
    if (!error) await signUp.verifications.sendEmailCode();
  }

  const onVerifyPress = async () => {
    if (!signUp) return;
    try {
      await signUp.verifications.verifyEmailCode({ code });
      if (signUp.status === 'complete') {
        await setActive({ session: signUp.createdSessionId });
        router.replace('/');
      } else {
        console.log('Status is still:', signUp.status);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(err.errors?.[0]?.longMessage || "Verification failed.");
    }
  };

  if (signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address")) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: COLORS.background }}>
        <Image source={require("../../assets/images/taraestate-removebg-preview.png")} className="w-40 h-32 mb-8" resizeMode="contain" />
        <Text className="text-2xl font-bold mb-2" style={{ color: COLORS.textDark }}>Verify your account</Text>
        <Text className="mb-8 text-center" style={{ color: COLORS.textDark }}>We sent a code to {email}</Text>

        <TextInput
          className="w-full border rounded-xl px-4 py-3 mb-4"
          style={{ backgroundColor: COLORS.inputBackground, color: COLORS.placeholderText }}
          placeholder="Enter verification code"
          placeholderTextColor="#000000"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity onPress={onVerifyPress} disabled={isloading} style={{ backgroundColor: COLORS.primary }} className="w-full py-4 rounded-xl items-center mb-4">
          {isloading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Verify</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signUp.verifications.sendEmailCode()} className="py-2">
          <Text style={{ color: COLORS.textPrimary }}>I need a new code</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: COLORS.background }} keyboardShouldPersistTaps="handled">
      <View className='flex-1 justify-center px-6 py-2'>
        <Image source={require("../../assets/images/taraestate-removebg-preview.png")} className='w-32 h-20' resizeMode='cover' />
        <Text className='text-3xl font-bold' style={{ color: COLORS.textDark }}>Create Account</Text>
        <Text className='text-xl font-extralight mb-4' style={{ color: COLORS.textDark }}>Find your Dream home</Text>
        
        <View className='flex-row gap-2'>
          <TextInput className='border rounded-xl w-[48%] px-4 py-3' style={{ backgroundColor: COLORS.inputBackground, color: COLORS.placeholderText }} placeholder='First Name' placeholderTextColor="#000000" autoCapitalize='words' value={firstName} onChangeText={setFirstName} />
          <TextInput className='border rounded-xl w-[48%] px-4 py-3' style={{ backgroundColor: COLORS.inputBackground, color: COLORS.placeholderText }} placeholder='Last Name' placeholderTextColor="#000000" autoCapitalize='words' value={lastName} onChangeText={setLastName} />
        </View>

        <View className='gap-3 mt-4'>
          <TextInput className='border rounded-xl w-full px-4 py-3' style={{ backgroundColor: COLORS.inputBackground, color: COLORS.placeholderText }} placeholder='Email' placeholderTextColor="#000000" keyboardType='email-address' value={email} onChangeText={setEmail} />
          {errors.fields.emailAddress && <Text className="text-red-500 px-4">{errors.fields.emailAddress.message}</Text>}

          <TextInput className='border rounded-xl w-full px-4 py-3' style={{ backgroundColor: COLORS.inputBackground, color: COLORS.placeholderText }} placeholder='Password' placeholderTextColor="#000000" secureTextEntry value={password} onChangeText={setPassword} />
          {errors.fields.password && <Text className="text-red-500 px-4">{errors.fields.password.message}</Text>}
        </View>

        <TouchableOpacity disabled={isloading} className='mt-6 py-4 rounded-xl' style={{ backgroundColor: COLORS.primary }} onPress={signupkaro}>
          {isloading ? <ActivityIndicator color="white" /> : <Text className='text-white font-bold text-center'>Sign up</Text>}
        </TouchableOpacity>

        <View className='flex-row justify-center mt-4'>
          <Text style={{ color: COLORS.textPrimary }}>Already have an account? </Text>
          <Link href={"/(auth)/signin"}> <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>Sign in</Text></Link>
        </View>
      </View>
    </ScrollView>
  );
}

export default Signup;