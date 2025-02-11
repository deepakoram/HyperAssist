import { ActivityIndicator, StyleSheet, Text, View, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import SearchInput from './Components/SearchInput'
import Ticket from './Components/Ticket'
import { handleTicketData } from './Helpers/ApiCall'
import { Colors } from './Helpers/colors'
import Loader from './Components/Loader'

const SearchTicket = () => {
  const [searchValue, setSearchValue] = useState("");
  const [ticket, setTicket] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const searchSubmit = async () => {
    let res = await handleTicketData(searchValue?.replaceAll("#",""), setIsLoading);
    
      if(res.length > 0){
        setTicket(res[0])
      }else{
        setTicket([])
        Alert.alert('No Data found...')
      }
  }
   console.log(ticket);
   
  return (
    <View style={styles.container}>
      <SearchInput placeholder='Search Ticket Number'
        onChangeText={(e: any) => setSearchValue(e)}
        value={searchValue}
        style={styles.searchInput}
        inputStyle={styles.inputStyle}
        // inputStyle = {}, // Additional input styles
        keyboardType="numeric"
        handleSubmit={() => searchSubmit()}
      />
      <View>
      <Text>Ticket List</Text>
      </View>
      {isLoading ?
        <Loader/> :
        <View style={{ marginVertical: 20 }}>
          {
            ticket?.ticket_id &&
              <View>
                <Ticket ticket_id={ticket?.ticket_id} id={ticket?.id} status={ticket?.ticket_status} subject={ticket?.subject} ticketNumber={ticket?.ticket_number} date={ticket?.reported_date} />
              </View> 
          }
        </View>}
    </View>
  )
}

export default SearchTicket

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff'
  },
  searchInput:{
    backgroundColor:'#FFFFFF',
    borderWidth:1,
    borderColor:'#E7E7E7',
    borderRadius:12,
  },
  inputStyle:{
  }
})