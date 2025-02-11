import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';


const AuthScreen = ({ login }: any) => {
  const [token, setToken] = useState("");
  const [fcm,setFcm] = useState("");


  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(token);
      await AsyncStorage.setItem('auth-token', jsonValue);
      login(true);
    } catch (e) {
      // saving error
      login(false);
    }
  };
  const checkFcm = async()=>{
    try {
      const fcmKey = await messaging().getToken();
      setFcm(fcmKey);
    } catch (error) {
      console.log(error,"error")
    }
  }
  useEffect(()=>{
    checkFcm()
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* <Text>
          {fcm}
        </Text> */}
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your token"
          placeholderTextColor="#888"
          onChangeText={(e: any) => setToken(e)}
          autoComplete="off"
          autoCorrect={false} 
        />
        <TouchableOpacity style={styles.button} onPress={storeData}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Light background color
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff', // White card-style background
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    height: 50,
    backgroundColor: '#007bff', // Primary button color
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
