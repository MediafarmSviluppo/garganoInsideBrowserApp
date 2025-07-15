import CustomWebView from '@/components/customWebView';
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from 'expo-splash-screen';
import React, {
  useRef
} from 'react';
import { Platform, StatusBar, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.setOptions({
  duration: 400,
  fade: true,
})

export default function Index() {
  const defaultUrl = "https://unterritoriodascoprire.it/"
/**/ 
  const colorScheme = useColorScheme();  

  let webView = useRef(null);

  return (
    <>
    <StatusBar barStyle={`${colorScheme === "light" ? "dark": "light"}-content`} backgroundColor={colorScheme ==="light" ? "#fff":"#000"} translucent={true} />
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <CustomWebView url={defaultUrl} webViewRef={webView} />
      {Platform.OS === 'ios' ? 
      <TouchableOpacity style={{
        backgroundColor: "#000", // Replace with your primary color
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 40,
          left: 30,
          elevation: 5, // For Android shadow
          shadowColor: "#000", // For iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
            }} onPress={() => {webView.current?.goBack()}}>
              <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
        : <></>}
    </SafeAreaView>
    </>
  );
}
