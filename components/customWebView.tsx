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
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      props.webViewRef.current?.reload();
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);
    //#endregion
//
    return (
      <View style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            <WebView source={{ uri: props.url }} 
                onNavigationStateChange={onNavigationStateChange} 
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

//#region WebView functions
const onNavigationStateChange = (navState) => {
  if (!navState.url.startsWith(defaultUrl)) {
    Linking.openURL(navState.url)
  }
}
//#endregion

export default CustomWebView;