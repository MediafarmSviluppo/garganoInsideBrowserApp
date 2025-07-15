import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Linking, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { WebView } from 'react-native-webview';

let defaultUrl = 'https://example.com'; // Replace with your default URL

type CustomWebViewProps = {
  url: string;
  webViewRef: React.RefObject<null>;
}

const CustomWebView = (props: CustomWebViewProps) => {
  defaultUrl = props.url || defaultUrl;

  //#region Android back button handling
    const [canGoBack, setCanGoBack] = useState(false);
    const onAndroidBackPress = useCallback(() =>{
      if (canGoBack) {
          props.webViewRef.current?.goBack();
          return true; // prevent default behavior (exit app)
        }
        return false;
      }, 
      [canGoBack]);

    useEffect(() => {
      if (Platform.OS === 'android') {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
        return () => {
          backHandler.remove();
        };
      }
    }, [onAndroidBackPress]);

    //#endregion

    //#region Android pull to refresh
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      props.webViewRef.current?.reload();
      setTimeout(() => {
        setRefreshing(false);
      }, 1500);
    }, []);

    const [refresherEnabled, setEnableRefresher] = useState(true);

    const handleScroll = (event:any) => {
      const yOffset = Number(event.nativeEvent.contentOffset.y)
      if (yOffset === 0) {
        setEnableRefresher(true)
      } else {
        setEnableRefresher(false)
      }
    }
    //#endregion

    //#region WebView functions
    const onNavigationStateChange = (navState) => {
      if (!navState.url.startsWith(defaultUrl)) {
        props.webViewRef.current?.stopLoading(); 
        Linking.openURL(navState.url)
      }
    }
    //#endregion

    return (
      <View style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={refresherEnabled} />
          }>
            <WebView source={{ uri: props.url }} 
                onNavigationStateChange={onNavigationStateChange} 
                onScroll={handleScroll}
                pullToRefreshEnabled={true}
                allowsBackForwardNavigationGestures={true} // per iOS
                style={{ flex: 1 }} 
                ref={props.webViewRef}
                onLoadProgress={event => {
                    setCanGoBack(event.nativeEvent.canGoBack);
                }}
            />
        </ScrollView>
        </View>
    )
}

export default CustomWebView;