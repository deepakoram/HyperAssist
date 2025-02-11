import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React,{useState,useEffect} from 'react';
import { useAppContext } from '../Context/AppContext';
import { useNavigation } from "@react-navigation/native";
import {filterTickets} from '../Helpers/hepler';
import Ticket from "../Components/Ticket";


const TicketActive = ({route}:any) => {
    let routeParams;
    switch (route?.params?.status) {
    case 'active_ticket':
        routeParams = 'Active Tickets';
        break;
    case 'closure':
        routeParams = 'Closure Rate';
        break;
    case 'Response_Rate':
        routeParams = 'Response Rate';
        break;
    case 'resolution':
        routeParams = 'Resolution Efficiency Rate';
        break;
    case 'tail_response':
        routeParams = 'tail_response';
        break;
    case 'juspay_issue':
        routeParams = 'juspay_issue';
        break;
    case 'Merchant_followup':
        routeParams = 'Merchant_followup';
        break;
    default:
        routeParams = 'Default Code Block';
        break;
    }
    let tabOption;
    switch (route?.params?.status) {
        case 'active_ticket':
          tabOption = ['Active', 'Closed'];
          break;
        case 'closure':
          tabOption = ['Closed', 'Open'];
          break;
        case 'Response_Rate':
          tabOption = ['Responded', 'Not Responsed'];
          break;
        case 'resolution':
          tabOption = ['Resolved', 'Unresolved'];
          break;
        case 'juspay_issue':
          tabOption = [];
          break;
        case 'Merchant_followup':
          tabOption = [];
          break;
        case 'tail_response':
          tabOption = [];
          break;
        default:
          tabOption = ['Default Code Block', 'Undefined'];
          break;
      }
    const navigation = useNavigation();
    const { matricData,ticketCount,setTicketCount,totalTKT,setTotalTKT,merchantFollowUpResp, setMerchantFollowUpResp } = useAppContext();
     const [tabIndex, setTabIndex] = useState(0);
     const [response, setResponse] = useState<any>({});
    
    let x = response?.value?.map((item:any)=>item?.ticket_id)
    let legitTicket = matricData?.ticket_level_stats?.legit_tickets?.map((item:any)=>item)
    let responseEligibleTicket = matricData?.ticket_level_stats?.responsed_within_threshold_eligible_tickets?.map((item:any)=>item)
    let resolutionEligibleTicket = matricData?.ticket_level_stats?.resolution_without_upstream_dependency_eligible_tickets?.map((item:any)=>item)
    let closureEligibleTicket = matricData?.ticket_level_stats?.closure_eligible_tickets?.map((item:any)=>item)
    setTicketCount(response || [])
    let totalTicket
    switch (route?.params?.status) {
        case 'active_ticket':
            totalTicket = legitTicket;
            break;
        case 'closure':
            totalTicket = closureEligibleTicket;
            break;
        case 'Response_Rate':
            totalTicket = responseEligibleTicket;
            break;
        case 'resolution':
            totalTicket = resolutionEligibleTicket;
            break;
        default:
            totalTicket = 'Default Code Block';
            break;
        }
   
    useEffect(()=>{
        if(tabIndex === 0){
            setResponse(route?.params?.status === 'active_ticket' ? {value: matricData?.ticket_level_stats?.active_tickets,key:routeParams} : 
                route?.params?.status === 'closure' ? {value: matricData?.ticket_level_stats?.closure_tickets, key: routeParams} : 
                route?.params?.status === 'Response_Rate' ? {value:matricData?.ticket_level_stats?.responsed_within_threshold_tickets, key:routeParams} : 
                route?.params?.status === 'tail_response' ? {value:[matricData?.thread_level_stats?.tp99_ticket_id], key:routeParams} : 
                route?.params?.status === 'juspay_issue' ? {value:matricData?.ticket_level_stats?.juspay_issue_tickets, key:routeParams} : 
                route?.params?.status === 'Merchant_followup' ? {value:merchantFollowUpResp,key:routeParams} : 
                route?.params?.status === 'resolution' ? {value:matricData?.ticket_level_stats?.resolution_without_upstream_dependency_tickets, key:routeParams} : {value:[],key:''})
                setTotalTKT(totalTicket)
      }else{
        setResponse({value:filterTickets(x,totalTicket || []),key:routeParams})
        setTotalTKT(totalTicket)
      }
    },[tabIndex])
  
    const Item = ({ title }: any) => (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('TicketDetails', { id: title?.issue_id as any })}>
            <Ticket ticket_id={title?.ticket_id} id={title?.issue_id} subject={title?.subject} ticketNumber={title?.ticket_id} />

        </TouchableOpacity>
    );

    return (
        <View style={styles.filterContainer}>
           
            <View style={styles.tabContainer}>
                                    {tabOption.map((item, index) =>
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.tab, tabIndex === index && styles.activeTab]}
                                            onPress={() => setTabIndex(index)}
                                        >
                                            <Text style={[styles.tabText, tabIndex === index && { color: '#8F49DE' }]}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
            <FlatList
                data={response?.value}
                renderItem={({ item }) => <Item title={item} />}
                keyExtractor={item => item?.issue_id}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />
        </View>
    );
};

export default TicketActive;

const styles = StyleSheet.create({
    filterContainer:{
     flex:1,
     backgroundColor:'#F6F8F9',
     
    },
    container: {
        // marginVertical: 8,
        // marginHorizontal: 16,
        paddingHorizontal: 16,
        // borderRadius: 12,
        // backgroundColor: '#fff',
        // borderWidth: 1,
        // borderColor: '#EDEDED',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 2,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontWeight: '600',
        color: '#333',
        flex: 1, // Ensures the label takes up space without pushing the value
    },
    value: {
        color: '#666',
        flex: 2, // Ensures the value text takes up more space
        textAlign: 'right',
    },
    tabContainer: {
        flexDirection: "row",
        // marginBottom: 16,
        // marginTop: 16,
        padding: 16,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#E0E0E0",
    },
    activeTab: {
        borderBottomColor: "#8F49DE",
    },
    tabText: {
        fontSize: 11,
        fontWeight: "600",
        lineHeight: 13,
        color: "#939393",
    },
});
