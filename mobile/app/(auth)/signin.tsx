import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "@/color";
import { useEstateStore } from "@/store/property";
export default function SignInScreen() {
  const  invalidate=useEstateStore((state:any)=>state.invalidatelogout)
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
useEffect(()=>{
   useEstateStore.setState({ 
        estatesFetched: false, 
        featuredFetched: false, 
        savedFetched: false, 
        fetchuserr: false 
      });
  
invalidate()
},[])
  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );
      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  const isLoading = fetchStatus === "fetching";

  if (signIn.status === "needs_client_trust") {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: COLORS.background }}>
        <Image
          source={require("../../assets/images/taraestate-removebg-preview.png")}
          className="w-32 h-52 mb-4"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mb-2">Verify your account</Text>
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter verification code"
          placeholderTextColor="#000000"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity onPress={onVerifyPress} disabled={isLoading} className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4">
          {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Verify</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: COLORS.background }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-2">
        <Image
          source={require("../../assets/images/taraestate-removebg-preview.png")}
          className="w-32 h-20"
          resizeMode="cover"
        />
        <Text className="text-3xl font-bold mb-2" style={{ color: COLORS.textDark }}>Welcome back</Text>
        <Text className="text-gray-500 mb-8" style={{ color: COLORS.textDark }}>Sign in to your account</Text>

        <TextInput
          style={{ backgroundColor: COLORS.inputBackground, color: COLORS.placeholderText }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Email address"
          placeholderTextColor="#000000"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={{ backgroundColor: COLORS.inputBackground, color: COLORS.placeholderText }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          placeholder="Password"
          placeholderTextColor="#000000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={onSignInPress}
          style={{ backgroundColor: COLORS.primary }}
          disabled={isLoading}
          className="w-full py-4 rounded-xl items-center"
        >
          {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-center">Sign In</Text>}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text style={{ color: COLORS.textPrimary }}>Don't have an account? </Text>
          <Link href={"/signup"}>
            <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>Sign up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}