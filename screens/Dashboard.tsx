import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView,TouchableOpacity } from 'react-native';
import BarChartExample from './Chart';
import { Tooltip, Text as ToolTipText } from 'react-native-elements';
import { useAppContext } from './Context/AppContext';
import {formatDate,convertUTCtoIST,getPreviousDate,subtractOneMinute} from '../screens/Helpers/hepler';
import { useNavigation } from "@react-navigation/native";



// import Chart from './BarChart';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const Dashboard = ({ response }: any) => {
  return (
    <DataDash response={response} />
  );
};

const DataDash = ({ response }: any) => {
  const navigation = useNavigation();
  const { date, setDate, setLoginModal, loginModal, filterData, setTicketList, ticketList,todayStatus } = useAppContext();
  return (
    <View style={styles.container}>
      

      <View style={styles.metricCard}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Tooltip
              skipAndroidStatusBar={true}
              backgroundColor="black"
              height={70}
              width={250}
              withPointer={true}
              popover={<ToolTipText style={{ color: 'white' }}>{`Percentage of tickets responded within 4 business hours.`}</ToolTipText>}
              backgroundStyle={{ backgroundColor: 'transparent' }}
            >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>

              <Text style={styles.metricTitle}>Response Rate</Text>
              <Image style={{ height: 14, width: 14, marginLeft: 3, objectFit: 'contain' }} source={require('./../assets/info.png')} />
              </View>
            </Tooltip>
          </View>
          <TouchableOpacity style={{ padding: 10,paddingRight:0 }} onPress={() => navigation.navigate('TicketActive', { status: 'Response_Rate' as any })}>
          <Image style={{ height: 16,width:16, marginLeft: 3,objectFit:'contain' }} source={require('./../assets/right-arrow.png')} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('TicketActive', { status: 'Response_Rate' as any })}>

        <View style={styles.subView}>
          <Text style={styles.metricValue}>{parseFloat(response?.ticket_level_stats?.response_rate_within_threshold).toFixed(1)}</Text>
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
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterStatus: {
    width:'auto',
    marginLeft:4,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5
  },
  container: {
    flex: 1,
    marginBottom:16,
    // paddingVertical: 16,
    // paddingHorizontal: 24,
    // backgroundColor: '#F6F8F9',
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
  }
});

export default Dashboard;
