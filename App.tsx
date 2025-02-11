/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { AppProvider } from './screens/Context/AppContext';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Dashboard from './screens/Dashboard';
import StickyBottomView from './screens/BottomStickyView';
import Toolbar from './screens/Toolbar';
import ScreenTwo from './screens/ScreenTwo';
import TicketDetail from './screens/TicketDetail';
import SearchTicket from './screens/SearchTicket';
import HeaderBack from './screens/HeaderBack';
import Home from './screens/Home'
import AuthScreen from './screens/AuthScreen';
import Login, { getIdTokenFromRefreshToken, validateIdToken } from './screens/Login'
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import DashboardDrawer from './screens/DashboardDrawer';
import TicketList from './screens/TicketList';
import Onboarding from './screens/Onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TicketActive from './screens/Components/TicketActive';
import { useAppContext } from './screens/Context/AppContext';
import OnboardingScreen from './screens/Components/OnboardingScreen';
import TableDetails from './screens/TableDetails';
import ChatScreen from './screens/Chat';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './screens/Components/ErrorBoundary';
import LottieView from 'lottie-react-native';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createNativeStackNavigator();
function RootStack() {
  const {ticketCount,merchantFollowUpResp,setTicketCount,matricData,totalTKT} = useAppContext()
  let headerTitle;
  switch (ticketCount?.key) {
   case 'tail_response':
    headerTitle = 'Tail Response'
     break;
   case 'juspay_issue':
    headerTitle = `Juspay Issue Rate - ${matricData?.ticket_level_stats?.juspay_issue_count}`
     break;
   case 'Merchant_followup':
    headerTitle = `Merchant follow up count - ${merchantFollowUpResp?.length}`
     break;
  
   default: 
   headerTitle= `${ticketCount?.key} - ${ticketCount?.value?.length || 0} / ${totalTKT?.length || 0}`
     break;
  }
  // let Title  =ticketCount?.key === 'tail_response' ? " Tail Response" : `${ticketCount?.key} - ${ticketCount?.value?.length || 0} / ${totalTKT?.length || 0}`
  return (
    <SafeAreaProvider>
    <Stack.Navigator initialRouteName="Home">
      {/* <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}      /> */}
      <Stack.Screen name="Home" component={DashboardView} options={{ headerShown: false }}      />
      <Stack.Screen name="Details" component={ScreenTwo} options={{ headerShown: false }}/>
      <Stack.Screen name="TicketDetails" component={TicketDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="TicketList" component={TicketList} options={{ headerShown: true, title:'Ticket List', headerTitleStyle: {
          fontSize: 14,
        }, 
        headerTitleAlign: "center",}}/>
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: true }}/>
      <Stack.Screen name="TableDetails" component={TableDetails} 
      options={{
        headerShown: false,
      }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true, title:'Ticket List', headerTitleStyle: {
          fontSize: 14,
        }, 
        headerTitleAlign: "center", }}/>
      <Stack.Screen name="SearchTicket" component={SearchTicket} options={{ headerShown: true, title:'Search Ticket', headerTitleStyle: {
          fontSize: 14,
        }, 
        headerTitleAlign: "center", }}/>
      <Stack.Screen name="TicketActive" 
      component={TicketActive} 
      options={{ headerShown: true, 
        title:headerTitle,
        headerTitleStyle: {
          fontSize: 14,
        }, 
        headerTitleAlign: "center",
      }}
      />
    </Stack.Navigator>
    </SafeAreaProvider>
    // <SafeAreaProvider>
    //   <Stack.Navigator initialRouteName="Home">
    //     <Stack.Screen name="Home" component={ChatScreen} options={{ headerShown: false }}      />
    //     <Stack.Screen name="Details" component={ChatScreen} options={{ headerShown: false }}/>
    //   </Stack.Navigator>
    // </SafeAreaProvider>
  );
}

function DashboardView(): React.JSX.Element {
  const[localOnboard,setLocalOnboard] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  
  return (
    <>
    {/* <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: backgroundStyle.backgroundColor, marginBottom: 91 }}>
    </ScrollView> */}
      {/* <Toolbar/> */}
      {/* <DashboardDrawer/> */}
      <Home/>
      {/* <TableDetails/> */}
    {/* <StickyBottomView /> */}
    </>
  )
}

function App(): React.JSX.Element {
  
  const isDarkMode = useColorScheme() === 'dark';
  const [currentPath, setCurrentPath] = useState('Home');
  const [loginStatus,setLoginStatus] = useState<any>(false);
  const [iseLoading,setIsLoading] = useState(false)
  const[onBoarded,setOnBoarded] = useState(false);

  const [fcm,setFcm] = useState("");
  const [isSplashVisible, setSplashVisible] = useState(true);

  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  window.myGlobalFunction = () => {
    setLoginStatus(false)
  };
  window.onboardingGlobalFunction = () => {
    setOnBoarded(false)
  };
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  // const renderContent = (currentScreen: string) => {
  //   switch (currentScreen) {
  //     case 'dashboard':
  //       return <ScrollView
  //         contentInsetAdjustmentBehavior="automatic"

  //         style={{ backgroundColor: backgroundStyle.backgroundColor, marginBottom: 91 }}>
  //         <Dashboard/>;
  //       </ScrollView>;

  //     case '2ndScreen':
  //       return <ScreenTwo />
  //     default:
  //       return <ScrollView
  //         contentInsetAdjustmentBehavior="automatic"

  //         style={{ backgroundColor: backgroundStyle.backgroundColor, marginBottom: 91 }}>
  //         <Dashboard/>;
  //       </ScrollView>;
  //   }
  // };
  const login:any = (e:any)=>{
    setLoginStatus(e)  
  }
  const checkFcm = async()=>{
    try {
      const fcmKey = await messaging().getToken();
      setFcm(fcmKey);
    } catch (error) {
      console.log(error,"error")
    }
  }
  const requestNotificationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
          // Notifications can now be shown
        } else {
          console.log('Notification permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    
  };
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  // IOS function
  const getItem =async()=> {
    setIsLoading(true)
    const value: any = await AsyncStorage.getItem('onboarding');
    const token = JSON.parse(value);
    if(token){
      setOnBoarded(true)
      setIsLoading(false)
    }else{
      setOnBoarded(false)
      setIsLoading(false)
    }
  }
   const auth = async()=>{
    setIsLoading(true)
    const authValue: any = await AsyncStorage.getItem('isAuthenticated');
    const isAuthenticated = JSON.parse(authValue);
    if(isAuthenticated){
      const id_token: string | null = await AsyncStorage.getItem('id_token');
      const validTokenResp = await validateIdToken(id_token);
      
      if(validTokenResp?.email){
          setLoginStatus(true)
          setIsLoading(false)
      } else {
        const refresh_token: string | null = await AsyncStorage.getItem('refresh_token');
        if(refresh_token){
          const refreshResp = await getIdTokenFromRefreshToken(refresh_token)
          let id_token = refreshResp?.id_token
          if(id_token){
            await AsyncStorage.setItem('id_token', id_token);
            setLoginStatus(true)
            setIsLoading(false)
          }
        }else{
          await AsyncStorage.removeItem('isAuthenticated');
          setLoginStatus(false)
          setIsLoading(false)
        } 
      }
    }
   }
  useEffect(()=>{
    console.log("my fcm :-" , fcm);
  },[fcm])

  useEffect(()=>{
    auth()
    getItem();
    checkFcm();
    requestUserPermission();
    requestNotificationPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    const timer = setTimeout(() => {
      setSplashVisible(false);
      unsubscribe
    }, 2200); // Simulate a 2-second splash

    return () => clearTimeout(timer);
  },[])
  // isSplashVisible
  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
          {/* <Image style={{ height: 180,width:180, marginLeft: 3,objectFit:'contain' }} source={require('./assets/splash.png')} /> */}
          <LottieView style={{width:48, height:48,marginBottom:10}} source={require('./assets/Lottie/logo.json')} autoPlay loop />
          <Text style={styles.splashHeaderText}>SuperFast</Text>
          <Text style={styles.splashText}>Track and manage</Text>
          <Text style={styles.splashText}>merchant tickets efficiently</Text>
      </View>
    );
  }

  return (
    // <ErrorBoundary>
    <AppProvider>
    <NavigationContainer
    onStateChange={(state) => {
      if (state) {
        // Safely get the current route
        const currentRoute = state.routes[state.index];
        setCurrentPath(currentRoute.name); // Update state with the current route name
      } 
    }}
    >
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={{ height: "100%" }}>
         {/* {currentPath === "Home" ?  <Toolbar /> : <HeaderBack/> } */}
         {!loginStatus ? <Login login= {login}/>:
          !onBoarded ? <OnboardingScreen setOnBoarded={setOnBoarded}/> :
          <RootStack/>
          }
        </View>
      </SafeAreaView>
    </NavigationContainer>
    </AppProvider>
    // </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  tabIcon:{
    height: 15, 
    width: 15, 
    marginLeft: 3, 
    objectFit: 'contain',
    
   },
   splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
   splashHeaderText: { 
    color:'#2B2B2B',
    fontSize: 25, 
    fontWeight: '700' ,
    marginBottom:26
  },
  splashText:{
    fontSize: 14, 
    fontWeight: '400',
    lineHeight:22,
    color:'#454545',
    textAlign:"center"
  }
});

export default App;
