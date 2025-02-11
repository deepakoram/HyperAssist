import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAppContext } from './Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sortTicketsByDate, formatDate, statusColor } from '../screens/Helpers/hepler';
import Ticket from './Components/Ticket';


const TicketList = () => {
    const { date, setDate, setLoginModal, loginModal, filterData,ticketList } = useAppContext();
    let recentTicket = Array.isArray(ticketList)
        ? ticketList
        : [];

    type ItemProps = { ticket: any };
    const Item = ({ ticket }: ItemProps) => (
        <Ticket ticket_id={ticket?.ticket_id} id={ticket?.id} status={ticket?.ticket_status} subject={ticket?.subject} ticketNumber={ticket?.ticket_number} date={ticket?.reported_date}/>
    );
    return (
        <View style={{ padding: 16 }}>
            <FlatList
                data={recentTicket}
                renderItem={({ item }) => <Item ticket={item} />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />
        </View>
    )
}

export default TicketList

const styles = StyleSheet.create({
    ticketsContainer: {
        marginBottom: 16
    },
    ticketInfo: {
        fontSize: 13,
        color: '#939393',
        lineHeight: 16,
        marginTop: 10,
    },
    ticketTitle: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 18,
        flex: 1,
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
        backgroundColor: '#fff',
        borderColor: '#EDEDED',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
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