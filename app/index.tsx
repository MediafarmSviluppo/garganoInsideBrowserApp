import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BackHandler, Linking, Platform, StatusBar, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';

const defaultUrl = 'https://unterritoriodascoprire.it/'

export default function Index() {

  const colorScheme = useColorScheme();
  const [canGoBack, setCanGoBack] = useState(false);

  const webViewRef = useRef(null);

  const onAndroidBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  }, [canGoBack]);

useEffect(() => {
  if (Platform.OS === 'android') {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      backHandler.remove();
    };
  }
}, [onAndroidBackPress]);

  return (
    <>
    <StatusBar barStyle={`${colorScheme === "light" ? "dark": "light"}-content`} backgroundColor={colorScheme ==="light" ? "#fff":"#000"} translucent={true} />
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <WebView source={{ uri: defaultUrl }} 
      onnavigationStateChange={onNavigationStateChange} 
      pullToRefreshEnabled={true}
      allowsBackForwardNavigationGestures={true} // per iOS
      style={{ flex: 1 }} 
      ref={webViewRef}
      onLoadProgress={event => {
        setCanGoBack(event.nativeEvent.canGoBack);
      }}
      />
    </SafeAreaView>
    </>
  );
}

const onNavigationStateChange = (navState) => {
  if (!navState.url.startsWith(defaultUrl)) {
    Linking.openURL(navState.url)
  }
}


