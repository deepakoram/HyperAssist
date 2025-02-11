import { useState } from 'react';
import { View, Pressable, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isJuspayDomain} from '../screens/Helpers/hepler';
import { Apis } from './Utils/util';
import Loader from './Components/Loader';
import {
  GoogleSignin,
  GoogleOneTapSignIn,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '266500321895-c09eip2b4kti011s4hnqce5bsmkisqou.apps.googleusercontent.com',
  iosClientId: '266500321895-j6c9uiuv4f0v8ttpfntpclclpcfbvtjb.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  offlineAccess: true,
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

async function getIdTokenAndRefreshToken(server_auth_code){
  const myHeaders = new Headers();
  myHeaders.append("content-type", "application/json");
  myHeaders.append("server_auth_code", server_auth_code);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  let response = await fetch(Apis.LoginApi, requestOptions);
  let jsonResp = await response.json()
  return jsonResp
}

export async function validateIdToken(id_token){
  const myHeaders = new Headers();
  myHeaders.append("content-type", "application/json");
  myHeaders.append("id_token", id_token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  let response = await fetch(Apis.ValidTokenApi, requestOptions);
  let jsonResp = await response.json()
  return jsonResp
}

export async function getIdTokenFromRefreshToken(refresh_token){
  const myHeaders = new Headers();
  myHeaders.append("content-type", "application/json");
  myHeaders.append("refresh_token", refresh_token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  try {
    let response = await fetch(Apis.GetAccessTokenApi, requestOptions);
    let jsonResp = await response.json()
    return jsonResp
  } catch (error) {
    console.log(error,'error');
    
  }
}

export async function getEmailChatData(id, setTicketData){
  let idToken = await AsyncStorage.getItem('id_token');
  const myHeaders = new Headers();
  myHeaders.append("id_token", idToken);
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "issue_id": id
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://studio.juspay.in/turing/fetch/ticketdata", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // console.log(result)
      setTicketData(result)
    })
    .catch((error) => console.error(error));
}

export default function App({login}) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await GoogleLogin();
      let serverAuthCode = response?.data?.serverAuthCode
      if(serverAuthCode && isJuspayDomain(response?.data?.user?.email)){
        let result = await getIdTokenAndRefreshToken(serverAuthCode)
        const emailjsonValue = JSON.stringify(response);
        await AsyncStorage.setItem('email-response', emailjsonValue);
        let id_token = result?.id_token;
        let refresh_token = result?.refresh_token;
        if(id_token){
          const jsonValue = JSON.stringify("Basic ef00555a-cb5d-4996-8917-6427773376e5");
          await AsyncStorage.setItem('auth-token', jsonValue);
          await AsyncStorage.setItem('isAuthenticated', 'true');
          await AsyncStorage.setItem('id_token', id_token);
          if(refresh_token) await AsyncStorage.setItem('refresh_token', refresh_token);
          login(true)
        } else {
          Alert.alert("Unable to contact Google.")
        }
      }else{
        await AsyncStorage.removeItem('isAuthenticated');
        Alert.alert("Please login with juspay credentials, delete app storage from setting")
        return
      }
    } catch (apiError) {
      console.log(apiError)
      await AsyncStorage.removeItem('isAuthenticated');
      setError(
        apiError?.response?.data?.error?.message || 'Something went wrong'
      );
      login(false)
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleGoogleLogin}>
        {loading ? (
          <ActivityIndicator/>
        ) : (
          <Text style={styles.buttonText}>Continue with Google</Text>
        )}
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 20,
    color: '#ff0000',
    fontSize: 14,
    textAlign: 'center',
  },
});
