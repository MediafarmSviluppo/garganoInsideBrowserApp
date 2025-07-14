import CustomWebView from '@/components/customWebView';
import React, {
  useRef
} from 'react';
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const defaultUrl = "https://unterritoriodascoprire.it/"

  const colorScheme = useColorScheme();  

  let webView = useRef(null);

  return (
    <>
    <StatusBar barStyle={`${colorScheme === "light" ? "dark": "light"}-content`} backgroundColor={colorScheme ==="light" ? "#fff":"#000"} translucent={true} />
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <CustomWebView url={defaultUrl} webViewRef={webView} />
    </SafeAreaView>
    </>
  );
}




