import { StyleSheet, Text, View } from 'react-native'
import { sortTicketsByDate, formatDate, statusColor } from '../../screens/Helpers/hepler';
import React from 'react'

const StatusTag = ({status}:any) => {
  return (
    <Text style={[styles.ticketStatus, {backgroundColor:`${statusColor(status)}`}]}>
    {status}
     </Text>
  )
}

export default StatusTag

const styles = StyleSheet.create({
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
})