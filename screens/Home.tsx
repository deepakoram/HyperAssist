import React, { useCallback, useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, ActivityIndicator, Image, TextInput,ScrollView ,TouchableOpacity} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetRefProps } from './BottomSheet';
import Dashboard from './Dashboard';
import Toolbar from './Toolbar';
import { useAppContext } from './Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useNavigation } from "@react-navigation/native";
import ModalComponent from './Components/ModalComponent';
import DatePicker from './Components/DatePicker';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { Tooltip, Text as ToolTipText } from 'react-native-elements';
import FilterScreen from './FilterScreen';
import { formatDate,sortTicketsByDate, statusColor, subtractOneMinute, getPreviousDate, isDatePastNthDay, secondsToHours, apiFetch } from '../screens/Helpers/hepler';
import Ticket from './Components/Ticket';
import { Apis } from './Utils/util';
import Loader from './Components/Loader';



let flag: any = 0;
let fetchInterval: any;

export default function Home() {
  const ref = useRef<BottomSheetRefProps>(null);
  const {MatricApi, AllTicketsApi,MerchantFollowUpApi} = Apis;
  const { merchantFollowUpResp, setMerchantFollowUpResp,cacheStatus,isLoading, setIsLoading,date, setDate, setLoginModal, loginModal, filterData, setTicketList, ticketList, setMatricData, todayStatus } = useAppContext();
  const [response, setResponse]: any = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigation = useNavigation();
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);
  const animatedWidth = useSharedValue(48);
  const [ticketsData, setTicketsData] = useState([]);
  const [eventTracker, setEventTracker] = useState(0);
  const [authToken, setAuthToken] = useState('')
  const [notiData, setNotiData] = useState({});
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(false);
  const [idToken, setIdToken] = useState<string | null>('');

  
  const stats = [
    // { label: 'Active Tickets', value: `${response?.ticket_level_stats?.active_count}/${response?.ticket_level_stats?.total_tickets_count - response?.ticket_level_stats?.deleted_ticket_count - response?.ticket_level_stats?.spam_ticket_count}`, change: '+4.8%' },
    { label: 'Active Tickets', value: `${response?.ticket_level_stats?.active_count || '0'}/${response?.ticket_level_stats?.legit_tickets?.length || 0}`, change: '+4.8%', toolTipMessage: `Count of all the open tickets` },
    isDatePastNthDay(date, 0) ? { label: 'Resolution Efficiency Rate', value: parseFloat(response?.ticket_level_stats?.resolution_rate_without_upstream_dependency + 0).toFixed(1), change: '+4.8%', toolTipMessage: `Percentage of tickets closed  within 9 business hours without upstream dependency`, status: 'resolution', reSize: true, percent: true } : null,
    { label: 'Merchant Follow Ups', value: merchantFollowUpResp?.length || "0", change: '+4.8%', toolTipMessage: `Total count of merchant follow-ups`, status: 'Merchant_followup', reSize: true, percent: false },
    (isDatePastNthDay(date, 2) && date?.startDate !== date?.endDate) ? { label: 'Closure Rate', value: parseFloat(response?.ticket_level_stats?.closure_rate_within_threshold + "").toFixed(1), change: '+4.8%', toolTipMessage: `Percentage of tickets closed  within 27 business hours`, status: 'closure', reSize: true, percent: true } : null,
    { label: 'Tail Response Time', value: `${secondsToHours(response?.thread_level_stats?.tp99 || 0)} hrs`, change: '+4.8%', reSize: false, percent: false, status: 'tail_response', toolTipMessage: 'Time take to reply to last 1% of the tickets' },
    { label: 'Juspay Issues Rate', value: parseFloat(response?.ticket_level_stats?.juspay_issue_rate + "").toFixed(1), change: '+4.8%', reSize: false, percent: true, status: 'juspay_issue', toolTipMessage: 'Percentage of juspay isuues' },
  ];

  let ticketRes = Array.isArray(ticketsData)
    ? ticketsData
    : [];
  let recentTicket = sortTicketsByDate(ticketRes).slice(0, 5)

  const merchantFollowUp = async (selectedItem: any = null,id_token:any = null) => {
    const value: any = await AsyncStorage.getItem('auth-token');
    const token = JSON.parse(value);
    setIsLoading(true)
    let payload = {
        issue_reported_date:{
          from: getPreviousDate(date?.startDate),
          to: date?.endDate
        },
        alert_type: "merchant_followup",
        merchant_id: selectedItem?.merchant_id || filterData?.merchant_id || null,
        query_type: selectedItem?.product || filterData?.product || null,


    }
    try {
        const response = await fetch(MerchantFollowUpApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'juspay_token':'12e69664ad84d009ece291b161a01a',
                'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
                'id_token':id_token || idToken,
            },
            body: JSON.stringify(payload),
        });
         
        if(response){
          const data = await response.json();
          setMerchantFollowUpResp(data)
            setIsLoading(false)
          }
    } catch (error: any) {
        console.log('Error occurred: ' + error.message);
        setIsLoading(false)
    }
};
  const handleMetricRequest = async (selectedItem: any = null,id_token:any = null) => {
    setIsLoading(true)
   
    let resp = {
      issue_reported_date: {
        from: getPreviousDate(date?.startDate),
        to: todayStatus ? date?.endDate : date?.endDate
      },
      thread_response_threshold: 240,
      without_dependency_ticketclosure_threshold: 9,
      ticet_closure_threshold: 27,
      outstanding_ticket_threshold:1440,
      merchant_id: selectedItem?.merchant_id || filterData?.merchant_id || null,
      query_type: selectedItem?.product || filterData?.product || null,
      assignee: selectedItem?.assignee || filterData?.assignee || null,
      use_cached_data:cacheStatus
    }
    try {
      const response = await fetch(MatricApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
          'id_token':id_token || idToken,
          // 'Accept-encoding': 'application/gzip'
        },
        body: JSON.stringify(resp),
      });

      const data = await response.json(); 
      if(data?.responseMessage === "Unauthorized"){
        window.myGlobalFunction?.();
      }else{
      setMatricData(data)
      setResponse(data);
      setIsLoading(false)
      return data;
      }
    } catch (error: any) {
      console.log('Error occurred:' + error.message);
      setResponse('Error occurred: ' + error.message);
      setIsLoading(false)
    }
  };
  const modalHandle = () => {
    setIsModalOpen((prev) => !prev)
  }
  const handleTicketData = async (selectedItem: any = null,id_token:any = null) => {
    const value: any = await AsyncStorage.getItem('auth-token');
    const token = JSON.parse(value);

    let resp = {
      merchant_id: selectedItem?.merchant_id || filterData?.merchant_id || null,
      issue_reported_date: {
        from: getPreviousDate(date?.startDate),
        to: todayStatus ? date?.endDate : date?.endDate
      },
      environment: null,
      issue_type: null,
      category: null,
      product: null,
      ticket_status: null,
      ticket_genre: null,
      query_type: selectedItem?.product || filterData?.product || null,
      issue_sub_category: null,
      payment_method: null,
      payment_method_type: null,
      severity: null,
      assignee: selectedItem?.assignee || filterData?.assignee || null,
      thread_response_threshold: 240,
      without_dependency_ticketclosure_threshold: 9,
      ticet_closure_threshold: 27,
    }
    setIsLoading(true)
    try {
      const response = await fetch(AllTicketsApi, {
        method: 'POST',
        headers: {
          // 'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
          'Content-Type': 'application/json',
          'id_token':id_token || idToken,
        },
        body: JSON.stringify(resp),

      });

      const data = await response.json();
      if(data?.responseMessage === "Unauthorized"){
        window.myGlobalFunction?.();
      }else{
      setTicketsData(data);
      setTicketList(sortTicketsByDate(data))
      setIsLoading(false)
      return data;
      }
    } catch (error: any) {
      setIsLoading(false)
      console.log('Error occurred: ' + error.message);
    }
  };
  const notificationResponse = async () => {
    const value: any = await AsyncStorage.getItem('notification-data');
    const res = JSON.parse(value);
    setNotiData(res)
  };
  const filterApplyHandle = async (selectedItem: any) => {
    setIsModalOpen(false)
    await handleMetricRequest(selectedItem);
    await handleTicketData(selectedItem);
    await merchantFollowUp(selectedItem)
  }
  const refreshHandle = async () => {
    await handleMetricRequest();
    await handleTicketData();
    await merchantFollowUp()
  }
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
      const isTop = contentOffset.y <= 0;
    setIsAtBottom(isBottom);
    setIsAtTop(isTop);
  };
  // UseEffect ------------------------------------------------

  // useEffect(() => {
  //   if (!date?.startDate || !date?.endDate) return
  //   if (!flag) {
  //     flag = 1;
  //     return;
  //   }
  //   const fetchData = async () => {
  //     await handleMetricRequest();
  //     await handleTicketData();
  //   };

  //   fetchData();
  //   clearInterval(fetchInterval);

  //   fetchInterval = setInterval(async () => {
  //     let res: any = await handleMetricRequest();
  //     let resp = await handleTicketData();
  //     setTicketsData(resp);
  //     setResponse(res);
  //   }, 300000000);

  //   return () => clearInterval(fetchInterval);
  //   // handleMetricRequest()
  // }, [date])
  useEffect(() => {
    notificationResponse();
    if (SCREEN_HEIGHT < 677) {
      ref?.current?.scrollTo(-SCREEN_HEIGHT / 1.54);
    } else {
      ref?.current?.scrollTo(-SCREEN_HEIGHT / 1.36);
    }

     const tokenHandle = async ()=>{
      const id_token: string | null = await AsyncStorage.getItem('id_token');
     if(id_token){
       setIdToken(id_token)
       await handleMetricRequest(null,id_token);
       await merchantFollowUp(null,id_token);
       await handleTicketData(null,id_token);
     }
     }
     tokenHandle()
      // fetchInterval = setInterval(async () => {
    //   let res: any = await handleMetricRequest();
    //   let resp = await handleTicketData();
    //   setTicketsData(resp);
    //   setResponse(res);
    // }, 300000000);

    // return () => clearInterval(fetchInterval);
  }, [])
  useEffect(() => {
    if (isAtBottom) {
      ref?.current?.scrollTo(-SCREEN_HEIGHT);
    }
    else if(isAtTop){
      if (SCREEN_HEIGHT < 677) {
        ref?.current?.scrollTo(-SCREEN_HEIGHT / 1.54);
      } else {
        ref?.current?.scrollTo(-SCREEN_HEIGHT / 1.36);
      }
    }
  }, [isAtBottom,isAtTop])
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await handleMetricRequest();
  //     await handleTicketData();
  //   };

  //   if (notiData) {
  //     fetchData();
  //   }
  // }, [notiData])

  return (
    isLoading ? <Loader/> : <View style={{ flex: 1 }}>
      <Toolbar modalHandle={modalHandle} refreshHandle={refreshHandle} />
      <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical:8 }}>
              {/* {Object.values(filterData).some(value => value !== "") ?<Text>Filters:</Text> : null} */}
              <Text>Filters:</Text>
              <ScrollView horizontal style={{gap:4}}>
                 <View style={styles.filterStatus}>
                  <Text>{`Date: ${formatDate(getPreviousDate(date?.startDate))} → ${todayStatus ? formatDate(subtractOneMinute(date?.endDate)) : formatDate(subtractOneMinute(date?.endDate))}`}</Text>
                 </View>
                 {filterData?.assignee ? <View style={styles.filterStatus}>
                  <Text>{`Assignee: ${filterData?.assignee}`}</Text>
                 </View> : null}
                 {filterData?.product ? <View style={styles.filterStatus}>
                  <Text>{`Product: ${filterData?.product}`}</Text>
                 </View> : null}
                 {filterData?.merchant_id ? <View style={styles.filterStatus}>
                  <Text>{`Merchant Id: ${filterData?.merchant_id}`}</Text>
                 </View> : null}
              </ScrollView>
            </View>
         <ScrollView onScroll={handleScroll}>

            <Dashboard response={response} />

            <View>
              <View style={[styles.card, styles.fullWidth]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                  <View >
                    <Tooltip
                      skipAndroidStatusBar={true}
                      backgroundColor="black"
                      height={70}
                      width={350}
                      withPointer={true}
                      popover={<ToolTipText style={{ color: 'white' }}>{`Count of all the the open tickets.`}</ToolTipText>}
                      backgroundStyle={{ backgroundColor: 'transparent' }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.label}>Active Tickets</Text>
                        <Image
                          style={{
                            height: 14,
                            width: 14,
                            marginLeft: 3,
                            resizeMode: 'contain', // Use resizeMode instead of objectFit
                          }}
                          source={require('./../assets/info.png')}
                        />
                      </View>
                    </Tooltip>
                  </View>
                </View>

                  <TouchableOpacity  onPress={() => navigation.navigate('TicketActive', { status: 'active_ticket' as any })}>
                <View style={{ width: '100%', flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                  <Text style={styles.value}>{stats[0].value}</Text>
                  <View style={{ padding: 10, paddingRight: 0 }}>
                    <Image style={{ height: 16, width: 16, marginLeft: 3, objectFit: 'contain' }} source={require('./../assets/right-arrow.png')} />
                  </View>
                  {/* <Text style={styles.tags}>{stats[0].change}</Text> */}
                </View>
                  </TouchableOpacity>
              </View>

              <View style={styles.gridContainer}>
                {stats.slice(1).map((stat, index) => (
                  stat &&
                  <Animated.View
                    key={index}
                    style={[styles.card, { width: `${!stat.reSize ? "48%" : isDatePastNthDay(date, 2) && date?.startDate !== date?.endDate ? "48%" : "100%"}` }]}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Tooltip
                        skipAndroidStatusBar={true}
                        backgroundColor="black"
                        height={70}
                        width={350}
                        withPointer={true}
                        popover={<ToolTipText style={{ color: 'white' }}>{stat?.toolTipMessage}</ToolTipText>}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.boxText}>{stat?.label}</Text>
                          <Image
                            style={{
                              height: 14,
                              width: 14,
                              marginLeft: 3,
                              resizeMode: 'contain', // Use resizeMode instead of objectFit
                            }}
                            source={require('./../assets/info.png')}
                          />
                        </View>
                      </Tooltip>                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('TicketActive', { status: stat?.status as any })}>
                      <View style={{ width: '100%', flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                          <Text style={styles.value}>{stat?.value}</Text>
                          {stat?.percent ? <Text style={styles.percent}>%</Text> : null}
                        </View>
                        {/* <Text style={styles.tags}>{stat.change}</Text> */}
                        <View style={{ padding: 10, paddingRight: 0 }}>
                          <Image style={{ height: 16, width: 16, marginLeft: 3, objectFit: 'contain' }} source={require('./../assets/right-arrow.png')} />
                        </View>
                      </View>
                        </TouchableOpacity>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Recent Tickets Section */}
            <View >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={styles.sectionTitle}>Recent Tickets</Text>
                <View>
                  <TouchableOpacity onPress={() => navigation.navigate('TicketList')}>
                    <Text style={{ fontWeight: "500", fontSize: 14, lineHeight: 16, color: "#797979", padding: 10 }}>View All</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{gap:16}}>
              {recentTicket.map((ticket: any, index: any) => {
                let color = statusColor(ticket.ticket_status)
                return (
                  <Ticket ticket_id={ticket?.ticket_id} id={ticket?.id} status={ticket?.ticket_status} subject={ticket?.subject} ticketNumber={ticket?.ticket_number} date={ticket?.reported_date} />
                )
              })}
               </View>
            </View>
          </ScrollView>

      </View>
        <ModalComponent title="Filter" modalVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DatePicker dateHeight={400} setDate={setDate}/>
          <FilterScreen filterApplyHandle={filterApplyHandle} />
        </ModalComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F9',
    gap:10,
    padding:16
    // height: '100%'
  },
  filterStatus: {
    width:'auto',
    marginLeft:4,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  card: {
    height: 130,
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 1,
    justifyContent: "space-between"
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tags: {
    backgroundColor: "#09961D1A",
    color: "#09961D",
    padding: 4,
    borderRadius: 5,
    marginLeft: 8
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  boxText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
    color: "#5F5F5F"
  },
  fullWidth: {
    width: '100%',
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketStatus: {
    fontSize: 12,
    // fontWeight: 'bold',
    marginRight: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto',
    color: 'black',
  },

  ticketTitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
    color: '#454545',
  },
  ticketInfo: {
    fontSize: 13,
    color: '#939393',
    lineHeight: 16,
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  percent: {
    color: '#939393',
    fontSize: 16,
    lineHeight: 17,
    fontWeight: 500
  }
});