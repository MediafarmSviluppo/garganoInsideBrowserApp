import React from 'react'
import { Linking, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

const Webview = () => {
  return (
    <WebView 
      source={{ uri: 'http://192.168.0.133:8000' }}
      onnavigationStateChange={onNavigationStateChange} />
  )
}

const onNavigationStateChange = (navState) => {
  console.log('Navigation state changed:', navState);
  // You can handle navigation state changes here
  // For example, you can check if the URL has changed
  if (!navState.url.startsWith('http://192.168.0.133:8000')) {
    console.log('Navigated to:', navState.url);
    Linking.openURL(navState.url)
  }
}

export default Webview

const styles = StyleSheet.create({})