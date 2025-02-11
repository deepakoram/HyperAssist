/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';



const firebaseConfig = {
    apiKey: "AIzaSyDGAYifQeMNDpAsEQUiZpJPtd-qOqe3HnY",
    authDomain: "pushnotificationjuspay.firebaseapp.com",
    projectId: "pushnotificationjuspay",
    storageBucket: "pushnotificationjuspay.firebasestorage.app",
    messagingSenderId: "240569209498",
    appId: "1:240569209498:web:9ff5ecb4360b5552820523"
  };
  
  // Check if Firebase apps are already initialized
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const storeData = async (data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('notification-data', jsonValue);
      login(true);
    } catch (e) {
      // saving error
      login(false);
    }
  };
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    storeData(remoteMessage)
  });
  
AppRegistry.registerComponent(appName, () => App);
