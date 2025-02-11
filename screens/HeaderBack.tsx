import { View, Text,Image,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import {statusColor} from '../screens/Helpers/hepler'
import StatusTag from './Components/StatusTag';

const HeaderBack = ({ticketDetails}:any) => {
    const navigation = useNavigation();
  return (
   <View style={{flexDirection:"row",justifyContent:'space-between', alignItems:'center', backgroundColor:'#FFFFFF', height:64,paddingHorizontal: 24,}}>
                <TouchableOpacity style={{flexDirection:'row',padding:10}} onPress={() => navigation.goBack()}>
                    <Image style={{ width: 16, height: 16, resizeMode: 'contain' }} source={require('./../assets/arrow-left.png')} />
                    <Text style={{fontWeight:'600',fontSize:14,lineHeight:17, color:'#5F5F5F',marginLeft:7}}>{`#${ticketDetails?.ticket_number}`}</Text>
                </TouchableOpacity>
                <Text style={[styles.ticketStatus, {backgroundColor:`${statusColor(ticketDetails?.ticket_status)}`}]}>{ticketDetails?.ticket_status}</Text>
    </View>
  )
}

export default HeaderBack

const styles = StyleSheet.create({
    
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
   
});