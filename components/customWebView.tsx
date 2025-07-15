import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Linking, Platform, RefreshControl, ScrollView, Share, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
const { downloadAsync, documentDirectory } = FileSystem;

let defaultUrl = 'https://unterritoriodascoprire.it'; // Replace with your default URL

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

    //#region Ios download
    let downloadDocument = async (eventData) => {
      let filename = decodeURI(eventData.nativeEvent.downloadUrl).split('/').pop() || null;
      if(filename !== null && filename.startsWith("download?resource=")) {
        filename = filename.replace("download?resource=", "").replace(/%20/g, " ").replace(/%2F/g, "/");
        filename = filename.split('/').pop() || filename; // Ensure we get the last part of the path
      }
      let fileURI = await downloadAsync(
      eventData.nativeEvent.downloadUrl,
      `${documentDirectory}${filename}`,
      {
      },
    );
    await onShare(fileURI.uri);
    };

    const onShare = async (url) => {
    try {
      return Share.share({
        message: 'Seleziona dove vuoi salvare il file',
        url: url,
      });
    } catch (error) {
      return error;
    }
  };
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
                onFileDownload={downloadDocument}
                onMessage={(event) => {console.log("Message from WebView:", event.nativeEvent.data)}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalFileAccessFromFileURLs={true}
                mixedContentMode={'always'}
            />
        </ScrollView>
        </View>
    )
}

export default CustomWebView;