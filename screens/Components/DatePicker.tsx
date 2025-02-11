import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity,Alert } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { useAppContext } from '../Context/AppContext';
import {getDates,getPreviousDate,subtractOneMinute} from '../Helpers/hepler';
import { BorderlessButton } from 'react-native-gesture-handler';
import Loader from './Loader';

const DatePicker = ({setDate,dateHeight=250}:any) => {
  const{presentDate, lastTwoDates} = getDates();
  const { date,todayStatus,setTodayStatus,dateReset } = useAppContext();
  const [startDate, setStartDate] = useState<any>(date?.startDate?.split("T")[0]);
  const [endDate, setEndDate] = useState<any>(date?.endDate?.split("T")[0]);
  const [isLoading, setIsLoading] = useState<any>()
  const [todayColor,setTodayColor] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const handleDayPress = (day: { dateString: string }) => {
    if (!startDate || (startDate && endDate)) {
      // Set start date and clear end date
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      // Set end date if it's valid
      if (day.dateString >= startDate) {
        // Calculate the difference in days
        const start = new Date(startDate);
        const end = new Date(day.dateString);
        const diffInDays = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
        );
        if (diffInDays > 20) {
          Alert.alert('Invalid Selection', 'The selected range exceeds 20 days.');
          setEndDate(null); // Reset end date if invalid
        } else {
          setTodayColor(false);
          setTodayStatus(false);
          setEndDate(day.dateString);
        }
      } else {
        // Reset if end date is before start date
        setStartDate(day.dateString);
        setEndDate(null);
      }
    }
    // Uncomment if modal needs to be closed
    // if (startDate && endDate) handleModalClose(false);
  };

  const getMarkedDates = () => {
    const marked: Record<string, object> = {};

    if (startDate) {
      marked[startDate] = { startingDay: true, color: '#8F49DE', textColor: 'white' };
    }
    if (endDate) {
      marked[endDate] = { endingDay: todayStatus ? false : true, color: '#8F49DE', textColor: 'white' };
    }

    // Fill in the range between start and end dates
    if (startDate && endDate) {
      let current = new Date(startDate);
      const last = new Date(endDate);
      
      while (current <= last) {
        const dateString = current.toISOString().split('T')[0];
        if (dateString !== startDate && dateString !== endDate) {
          marked[dateString] = { color: '#F7F2FC', textColor: 'black' };
        }
        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  };
  useEffect(() => {
    const now = new Date();
    
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');
    
    
    if (startDate && endDate) {
      // Ensure startDate and endDate are treated as UTC
      const formattedStartDate = `${startDate}T18:30:00Z`;
      const formattedEndDate = `${endDate}T18:30:00Z`;
      setDate({ startDate: formattedStartDate, endDate: formattedEndDate });
      if(startDate === endDate){
        setTodayStatus(true)
      }
    }
  }, [startDate, endDate]);
  useEffect(()=>{
    if(dateReset){
      setStartDate(presentDate?.split("T")[0])
      setEndDate(presentDate?.split("T")[0])
      setTodayColor(true)
      setTodayStatus(true)
    }
  },[dateReset])
  useEffect(()=>{
    setStartDate(date?.startDate?.split("T")[0]);
  setEndDate(date?.endDate?.split("T")[0]);
  },[])
  const handleWeekButtonPress = () => {
    const todayDate = new Date(presentDate?.split("T")[0]);
    const previousDate = new Date(todayDate);
    previousDate.setDate(previousDate.getDate() - 1); // Yesterday
  
    const lastWeekStart = new Date(previousDate);
    lastWeekStart.setDate(lastWeekStart.getDate() - 6); // Last 7th day from yesterday
  
    setStartDate(lastWeekStart.toISOString().split('T')[0]);
    setEndDate(previousDate.toISOString().split('T')[0]);
    setTodayColor(false);
    setTodayStatus(false);
  };
  const handleYesterdayButtonPress = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split('T')[0];
    
    setStartDate(formattedYesterday);
    setEndDate(formattedYesterday);
    setTodayColor(false);
    setTodayStatus(false);
  };
  
  return (
    <View style={[styles.container,{height:`${dateHeight}`}]}>
      <View onLayout={e => setIsLoading({ layout: e.nativeEvent.layout })} style={{flex:1}}>
      {isLoading ? <CalendarList
        onDayPress={handleDayPress}
        markingType="period"
        markedDates={getMarkedDates()}
        pastScrollRange={1} // Allow scrolling back 2 years
        futureScrollRange={0} // Allow scrolling forward 2 years
        scrollEnabled={true} // Enable scrolling
        showScrollIndicator={true} // Show scroll indicator
        maxDate={today}
      /> : <Loader/>}
      </View>
      <View style={{padding:10, borderTopColor:'#EDEDED',borderTopWidth:1, flexDirection:'row',gap:10}}>
        <TouchableOpacity 
        style={styles.button}
        onPress={()=>{
          setStartDate(presentDate?.split("T")[0])
          setEndDate(presentDate?.split("T")[0])
          setTodayColor(true)
          setTodayStatus(true)
        }}>
          <Text>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity         
          style={styles.button}
          onPress={handleYesterdayButtonPress}>
          <Text>Yesterday</Text>
        </TouchableOpacity>
        <TouchableOpacity   
        style={styles.button}      
         onPress={handleWeekButtonPress}>
          <Text>Last 7 days</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  selectedDates: {
    marginTop: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: 'gray',
  },
  button:{
  padding:6,minWidth:100,flexDirection:'row',justifyContent:'center',backgroundColor:'#fff',borderRadius:16, borderColor:'#E1E1E1',borderWidth:1

  }
});

export default DatePicker;
