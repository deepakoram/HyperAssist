import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated,Clipboard,Alert } from 'react-native';
import { useAppContext } from './Context/AppContext';
import { useNavigation } from "@react-navigation/native";
import DropdownMenu from './Components/DropDownMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopConfirm from './Components/PopConfirm';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";



type MyComponentProps = {
  modalHandle: () => void;
};
const Toolbar: React.FC<MyComponentProps> = ({ cacheHandle,filterModalodalHandle, modalHandle, refreshHandle }: any) => {
  const navigation = useNavigation();
  const [rotation] = useState(new Animated.Value(0));
  const { cacheStatus, setCacheStatus,date, setDate, setLoginModal, loginModal, filterData,setFilterdata } = useAppContext();
  const options = ["Table", "Copy Id Token", "Reset Onboarding", "Cache"];

  const[dropdownVisible, setDropdownVisible] = useState(false);
  const[emailResponse, setEmailResponse] = useState("");
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const handlePressIn = () => {
    Animated.spring(rotation, {
      toValue: 1, // Rotate the image by 360 degrees (1 full rotation)
      useNativeDriver: true, // To enable native driver for better performance
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(rotation, {
      toValue: 0, // Reset the rotation back to 0 (initial position)
      useNativeDriver: true,
    }).start();
  };

  // Interpolate the rotation value for smooth animation
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // Rotation from 0 to 360 degrees
  });
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleConfirm = () => {
    setDialogVisible(false);
    console.log("Confirmed!");
  };

  const handleCancel = () => {
    setDialogVisible(false);
    console.log("Cancelled!");
  };
  const onOptionChange = async(e:any)=>{
    if(e === 'Table'){
       navigation.navigate('TableDetails')
    }else if(e === "Reset Onboarding"){
      let initialData = {
        product: null,
        merchant_id: null,
        assignee: null
      }
      try {
        // const jsonValue = JSON.stringify(initialData);
        await AsyncStorage.removeItem('onboarding');
        setFilterdata({...initialData})
        window.onboardingGlobalFunction?.();
        // navigation.navigate('Home')
      } catch (e) {
        // saving error
      }
    }else if(e === "Logout"){
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage cleared successfully!');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
      window.onboardingGlobalFunction?.();
      window.myGlobalFunction?.();
    }else if(e === "Cache"){
      setCacheStatus(prev=>!prev)
    }else{
      const id_token: string | null = await AsyncStorage.getItem('id_token');
      if(id_token){
       Clipboard.setString(id_token); // Copies the string to the clipboard
       Alert.alert('Copied to Clipboard', 'The text has been copied successfully!');
      }
    }
  }
  const getLocalStorage = async () => {
    const email_data: any = await AsyncStorage.getItem('email-response');
    if (email_data) setEmailResponse(JSON.parse(email_data))
  }
useEffect(()=>{
  getLocalStorage();
},[])
  return (
    <View style={styles.toolbar}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image style={styles.icon} source={require('./../assets/ticket-token-one.png')} />
        {/* <Text style={styles.text}>SuperFast</Text> */}
         
        {/* <Text style={{marginLeft:5}}>{filterData?.assignee || "All"}</Text> */}
      </View>
      
      <TouchableOpacity
         style={{flexDirection:'row',alignItems:'center', flex:1,borderRadius:5,paddingVertical:5,paddingHorizontal:10,backgroundColor: '#EDEDED'}}
          onPress={() => {
            navigation.navigate('SearchTicket')
          }}>
          <Image style={[styles.tabIcon, { marginRight:5 }]} source={require('./../assets/search_icon.png')} />
          <Text style={{color:'grey'}}>Search Ticket Number</Text>
        </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 100, paddingLeft:10 }}>

        <TouchableOpacity style={styles.button} onPress={() => {
          ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
          refreshHandle()
        } }
        onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.Image
            style={[styles.tabIcon, { transform: [{ rotate }] }]} // Apply the animated rotation
            source={require('./../assets/refresh-icon.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {
          ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
          modalHandle()}}>
          <Image style={styles.tabIcon} source={require('./../assets/setting.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {
          ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
          setDropdownVisible(true);
          }}>
          <Image style={styles.tabIcon} source={require('./../assets/menu.png')} />
        </TouchableOpacity>
      </View> 
      <DropdownMenu dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} options={options} onOptionChange={(e:any)=>onOptionChange(e)}>
        <View style={{flexWrap:'wrap',padding:10,borderRadius:24, borderColor:'grey', borderWidth:1,flexDirection:'row',gap:10,alignItems:'center'}}>
        <Image style={{ width: 16, height: 16, resizeMode: 'contain' }} source={require('./../assets/profile.png')} />
          <Text>{emailResponse?.data?.user?.email}</Text>
        </View>
      </DropdownMenu>
      <PopConfirm
        isVisible={dialogVisible}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 15,
    width: 15,
    marginLeft: 3,
    objectFit: 'contain',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 62,
    backgroundColor: '#F6F8F9',
    borderBottomColor:'#EDEDED',
    borderBottomWidth:1
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  tabIcon:{
   height: 15, 
   width: 15, 
   marginLeft: 3, 
   objectFit: 'contain',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter Display',
    color: '#2B2B2B',
  },
  button:{
    // backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
    // padding:5
  }
});

export default Toolbar;
