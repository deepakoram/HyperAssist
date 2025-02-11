import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import BarChartExample from './Chart';
import { Tooltip, Text as ToolTipText } from 'react-native-elements';
import { useAppContext } from './Context/AppContext';
import {formatDate} from '../screens/Helpers/hepler'
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


const DashboardDrawer = () => {
  const { date, setDate, setLoginModal, loginModal, filterData } = useAppContext();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%', '100%'], [])
  const navigation = useNavigation();

  const [response, setResponse]: any = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ticketsData, setTicketsData] = useState([]);
  const animatedWidth = useSharedValue(48);
  const stats = [
    { label: 'Active Tickets', value: response?.ticket_level_stats?.active_count, change: '+4.8%' },
    { label: 'Resolution Efficiency Rate', value: parseFloat(response?.ticket_level_stats?.resolution_rate_without_upstream_dependency + 0).toFixed(1), change: '+4.8%', toolTipMessage:'Percentage of tickets closed  with 1 day without external depdency' },
    { label: 'Closure Rate', value: parseFloat(response?.ticket_level_stats?.closure_rate_within_threshold + "").toFixed(1), change: '+4.8%', toolTipMessage:'Percentage of tickets closed  with 4 day' },
    // { label: 'Tail Response Time', value: "NA", change: '+4.8%' },
    // { label: 'Juspay Issues Rate', value: "NA", change: '+4.8%' },
  ];
  let recentTicket = Array.isArray(ticketsData)
  ? ticketsData.slice().reverse().slice(0, 5)
  : [];

  // API
  const handlePostRequest = async (selectedItem: any = null) => {
    let resp = {
      issue_reported_date: {
        from: date?.startDate,
        to: date?.endDate
      },
      thread_response_threshold: 240,
      merchant_id: selectedItem?.merchant_id || null,
      query_type: selectedItem?.product || null,
      assignee: selectedItem?.assignee || null
    }
    setIsLoading(true)
    try {
      const response = await fetch('https://studio.juspay.in/turing/ticket/metric/fetch/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
          // 'Accept-encoding': 'application/gzip'
        },
        body: JSON.stringify(resp),
      });

      const data = await response.json();
      setResponse(data);
      setIsLoading(false)
      return data;
    } catch (error: any) {
      console.log('Error occurred: ' + error.message);
      setResponse('Error occurred: ' + error.message);
      setIsLoading(false)
    }
  };
  const handleTicketData = async (selectedItem:any = null) => {
    let resp = {
      merchant_id: selectedItem?.merchant_id||  null,
      issue_reported_date: {
        from: date?.startDate,
        to: date?.endDate
      },
      environment: null,
      issue_type: null,
      category: null,
      product: null,
      ticket_status: null,
      ticket_genre: null,
      query_type: selectedItem?.product || null,
      issue_sub_category: null,
      payment_method: null,
      payment_method_type: null,
      severity: null,
      assignee: selectedItem?.assignee || null,
      thread_response_threshold: 240,
      without_dependency_ticketclosure_threshold: null,
      ticet_closure_threshold: null
    }
    setIsLoading(true)
    try {
      const response = await fetch('https://studio.juspay.in/turing/temporary/issue/simplified/fetch/s2s', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(resp),
        
      });

      const data = await response.json();
      setTicketsData(data);
      setIsLoading(false)
      return data;
    } catch (error: any) {
      setIsLoading(false)
      console.log('Error occurred: ' + error.message);
    }
  };
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
    if(index === 0){
      animatedWidth.value = withTiming(48, { duration: 700 });
    }else{
      animatedWidth.value = withTiming(100, { duration: 700 });
    }
  }, []);
  const animatedCardWidthStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));
  //useEffects
  useEffect(() => {
    handlePostRequest()
    handleTicketData()
  }, [])
  // renders
  return (
    <GestureHandlerRootView style={styles.container}>
     
        <View style={styles.innerContainer}>
          <View style={styles.metricCard}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.metricTitle}>Response Rate</Text>
                <Tooltip
                  skipAndroidStatusBar={true}
                  backgroundColor="black"
                  height={70}
                  width={250}
                  withPointer={true}
                  popover={<ToolTipText style={{ color: 'white' }}><Text>Percentage of tickets responded within 4 hours</Text></ToolTipText>}
                  backgroundStyle={{ backgroundColor: 'transparent' }}
                >

                  <Image style={{ height: 14, width: 14, marginLeft: 3, objectFit: 'contain' }} source={require('./../assets/info.png')} />
                </Tooltip>
              </View>
              {/* <Image style={{ height: 16,width:16, marginLeft: 3,objectFit:'contain' }} source={require('./../assets/right-arrow.png')} /> */}
            </View>
            <View style={styles.subView}>
              <Text style={styles.metricValue}>{parseFloat(response?.ticket_level_stats?.response_rate_within_threshold + "").toFixed(1)}</Text>
              <Text>%</Text>
              {/* <Text style={styles.metricChange}>+4.8%</Text> */}
            </View>
            <View>
              <BarChartExample
                barWidth={7}
                barMargin={8}
                chartHeight={30}
              />
            </View>
          </View>
        </View>
      <BottomSheet
        // ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <ScrollView style={{ width: '100%' }}>
          <View style={{ marginTop: 16 }}>
              <View style={[styles.card, styles.fullWidth]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.label}>Active Tickets</Text>
                    <Tooltip
                      skipAndroidStatusBar={true}
                      backgroundColor="black"
                      height={70}
                      width={250}
                      withPointer={true}
                      popover={<ToolTipText style={{ color: 'white' }}><Text>Count of all the the open tickets</Text></ToolTipText>}
                      backgroundStyle={{ backgroundColor: 'transparent' }}
                    >
                      <Image
                        style={{
                          height: 14,
                          width: 14,
                          marginLeft: 3,
                          resizeMode: 'contain', // Use resizeMode instead of objectFit
                        }}
                        source={require('./../assets/info.png')}
                      />
                    </Tooltip>
                  </View>
                  {/* <Image style={{ height: 16,width:16, marginLeft: 3, objectFit:'contain' }} source={require('./../assets/right-arrow.png')} /> */}
                </View>

                <View style={{ width: '100%', flexDirection: "row", alignItems: "center", justifyContent: 'flex-start' }}>
                  <Text style={styles.value}>{stats[0].value}</Text>
                  {/* <Text style={styles.tags}>{stats[0].change}</Text> */}
                </View>
              </View>

              <View style={styles.gridContainer}>
                {stats.slice(1).map((stat, index) => (
                  <Animated.View
                    key={index}
                    style={[styles.card, animatedCardWidthStyle]}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.boxText}>{stat.label}</Text>
                      <Tooltip
                      skipAndroidStatusBar={true}
                      backgroundColor="black"
                      height={70}
                      width={250}
                      withPointer={true}
                      popover={<ToolTipText style={{ color: 'white' }}><Text>{stat?.toolTipMessage}</Text></ToolTipText>}
                    >
                      <Image
                        style={{
                          height: 14,
                          width: 14,
                          marginLeft: 3,
                          resizeMode: 'contain', // Use resizeMode instead of objectFit
                        }}
                        source={require('./../assets/info.png')}
                      />
                    </Tooltip>                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '100%', flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.value}>{stat.value}</Text>
                        <Text style={styles.percent}>%</Text>
                        {/* <Text style={styles.tags}>{stat.change}</Text> */}
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Recent Tickets Section */}
            <View style={styles.ticketsContainer}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={styles.sectionTitle}>Recent Tickets</Text>
                {/* <Text style={{ fontWeight: "500", fontSize: 14, lineHeight: 16, color: "#797979" }}>View All</Text> */}
              </View>
              {recentTicket.map((ticket: any, index: any) => (
                <TouchableOpacity key={index} style={styles.ticketCard} onPress={() => navigation.navigate('TicketDetails', { id: ticket?.id as any })}>
                  <View style={styles.ticketHeader}>
                    <Text style={[styles.ticketStatus, ticket?.ticket_status === 'RESOLVED' ? styles.resolved : styles.open]}>
                      {ticket.ticket_status}
                    </Text>
                    {/* <Image style={{ height: 16, width: 16, marginLeft: 3, objectFit: 'contain' }} source={require('./../assets/right-arrow.png')} /> */}
                  </View>
                  <Text style={styles.ticketTitle}>{ticket?.subject}</Text>
                  <Text style={styles.ticketInfo}>
                    #{ticket?.ticket_number} • {formatDate(ticket?.reported_date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

export default DashboardDrawer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F9',
  },
  contentContainer: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    // paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#F6F8F9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 10,
  },
  metricCard: {
    height: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderColor: '#EDEDED',
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  subView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metricCardLast: {
    marginRight: 0,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter Display',
    color: '#797979'
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Inter Display',
    width: 'auto',
    color: '#2B2B2B'
  },
  metricChange: {
    fontSize: 14,
    color: 'green',
    backgroundColor: '#09961D1A',
    padding: 4,
    borderRadius: 5,
    marginLeft: 8
  },
  chart: {
    marginTop: 16,
  },
  percent: {
    color: '#939393',
    fontSize: 16,
    lineHeight: 17,
    fontWeight: 500
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%'
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  bottomSheetContainer: {
    // height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    // top: SCREEN_HEIGHT,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
  ticketsContainer: {
    marginBottom: 16
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
    fontWeight: 'bold',
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  open: {
    backgroundColor: '#FDE9CE',
    color: '#C67307',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto'
  },
  resolved: {
    backgroundColor: '#E7F8F0',
    color: '#0E9255',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto'
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
});