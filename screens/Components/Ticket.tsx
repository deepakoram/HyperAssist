import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sortTicketsByDate, formatDate, statusColor } from '../../screens/Helpers/hepler';
import { useNavigation } from "@react-navigation/native";
import StatusTag from './StatusTag';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";


const Ticket = ({ id="",status="",subject="",ticketNumber="",date="",ticket_id="" }: any) => {
    const navigation = useNavigation();
    const hapticOptions = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
    return (
        <TouchableOpacity style={styles.ticketCard} onPress={() => {
            ReactNativeHapticFeedback.trigger("soft", hapticOptions);
            navigation.navigate('TicketDetails', { id: id as any,ticket_id:ticket_id as any })
        }}>
            {status &&<View style={styles.ticketHeader}>
                <StatusTag status={status} />
            </View> }
            <Text style={styles.ticketTitleStyle}>{subject}</Text>
            {date ? <Text style={styles.ticketInfo}>
                #{ticketNumber} • {formatDate(date)}
            </Text> : <Text style={styles.ticketInfo}>
                #{ticketNumber} • {id}
            </Text>}
        </TouchableOpacity>
    )
}

export default Ticket

const styles = StyleSheet.create({
    ticketInfo: {
        fontSize: 13,
        color: '#939393',
        lineHeight: 16,
        marginTop: 10,
    },
    ticketTitleStyle: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 18,
        
        color: '#454545',
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
    ticketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    ticketCard: {
        // flex:1,
        backgroundColor: '#fff',
        borderColor: '#EDEDED',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
})