import React, { createContext, useState, useContext, ReactNode,useEffect } from 'react';
import { getDates } from '../Helpers/hepler';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the context value type
type AppContextType = {
  date: { startDate: any; endDate: any };
  setDate: React.Dispatch<React.SetStateAction<{ startDate: any; endDate: any }>>;
  setLoginModal:any;
  loginModal:any;
  setFilterdata:any;
  filterData:any;
  setDateReset:any;
  dateReset:any;
  setTicketList:any;
  ticketList:any;
  setMatricData:any;
  matricData:any;
  setTodayStatus:any;
  todayStatus:any;
  setTicketCount:any;
  ticketCount:any;
  setTotalTKT:any;
  totalTKT:any;
  isLoading:boolean; 
  setIsLoading:any;
  cacheStatus:any; 
  setCacheStatus:any;
  merchantFollowUpResp:any;
  setMerchantFollowUpResp:any;
};
const{presentDate, lastTwoDates} = getDates();
// Create the context with a default value

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const getItem =async()=> {
    const value: any = await AsyncStorage.getItem('onboarding');
    const token = JSON.parse(value);
    let x = {assignee: token?.assignee[0], 
      merchant_id: token?.merchant_id[0], 
      product: token?.product[0]}
    setFilterdata({...x})
 }

  const [date, setDate] = useState({
    startDate: presentDate,
    endDate: presentDate,
  });
  const [filterData,setFilterdata] = useState({
    product: null,
    merchant_id: null,
    assignee: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ticketList,setTicketList] = useState([])
  const [dateReset,setDateReset] = useState(false)
  const[loginModal,setLoginModal] = useState(true)
  const [cacheStatus, setCacheStatus] = useState(false);
  const [todayStatus,setTodayStatus] = useState(true);
  const[totalTKT,setTotalTKT]= useState([])
  const [merchantFollowUpResp, setMerchantFollowUpResp] = useState([]);
  const[matricData,setMatricData] = useState({})
   useEffect(()=>{
    getItem()
   },[])
   const [ticketCount,setTicketCount] = useState('')
  return (
    <AppContext.Provider value={{merchantFollowUpResp, setMerchantFollowUpResp,cacheStatus, setCacheStatus,isLoading, setIsLoading, date, setDate, setLoginModal, loginModal, filterData, setFilterdata, setDateReset, dateReset,setTicketList,ticketList ,setMatricData,matricData,todayStatus,setTodayStatus,ticketCount,setTicketCount,totalTKT,setTotalTKT}}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};