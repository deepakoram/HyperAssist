import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { sortTicketsByDate, statusColor, subtractOneMinute, getPreviousDate, isDatePastNthDay, secondsToHours } from './Helpers/hepler';
import { useAppContext } from './Context/AppContext';
import { processResponse } from './Helpers/hepler';
import TableComponent from './Components/TableComponent';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apis } from './Utils/util';
import Loader from './Components/Loader';
import ModalComponent from './Components/ModalComponent';
import DatePicker from './Components/DatePicker';
import { color } from 'react-native-elements/dist/helpers';
import { getDates, tableDataConverter } from "./Helpers/hepler";
import HeaderBar from './Components/HeaderBar';


const TableDetails = () => {
    const { presentDate, lastTwoDates } = getDates();
    const { MultiselectMatricApi } = Apis;
    const { setDateReset, date, setDate, setLoginModal, loginModal, filterData, setTicketList, ticketList, setMatricData, todayStatus, setFilterdata } = useAppContext();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState({ startDate: presentDate, endDate: presentDate });
    const [response, setResponse]: any = useState([]);
    const [idToken, setIdToken] = useState<string | null>('');
    const [onboardingData, setOnboardingData] = useState({})
    const [emailResponse, setEmailResponse] = useState<any>('');
    const [tabIndex, setTabIndex] = useState("ASSIGNEE");

    let tabOption = ["ASSIGNEE", "PRODUCT", "MERCHANT"];

    // const headers = ["Assignee", "Response Rate", "Active Ticket","Resolution Efficien","Closure Rate","Tail Response Time","Juspay Issues Rate"];
    const headers = [tabIndex === "ASSIGNEE" ? "Assignee" :tabIndex === "PRODUCT" ?  "Product" : "Merchant", "Total Tickets","Pending Tickets Count","Response Rate(%)", "Active Ticket", "Resolution Rate(%)", "Closure Rate(%)", "Tail Response Time(hrs)", "Juspay Issues Rate(%)"];
    const getLocalStorage = async () => {
        const email_data: any = await AsyncStorage.getItem('email-response');
        if (email_data) setEmailResponse(JSON.parse(email_data))
    }
    const handlePostRequest = async (token: any, id_token: any = "", dateObj: any) => {
        let resp = {
            issue_reported_date: {
                from: getPreviousDate(dateObj?.startDate),
                to: todayStatus ? dateObj?.endDate : dateObj?.endDate
            },
            merchant_id: tabIndex === "MERCHANT" ? token?.merchant_id : null,
            query_type: tabIndex === "PRODUCT" ? token?.product : null,
            assignee: tabIndex === "ASSIGNEE" ? token?.assignee : null,
            thread_response_threshold: 240,
            without_dependency_ticketclosure_threshold: 9,
            ticet_closure_threshold: 27,
            outstanding_ticket_threshold:1440,
        }
        setIsLoading(true)
        try {
            const response = await fetch(MultiselectMatricApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
                    'id_token': id_token || idToken,
                },
                body: JSON.stringify(resp),
            });

            const data = await response.json();
            if(data?.responseMessage === "Unauthorized"){
                window.myGlobalFunction?.();
              }else{
            setResponse(data?.metric_data);
            setIsLoading(false)
            return data;
              }
        } catch (error: any) {
            console.log('Error occurred: ' + error.message);
            // setResponse('Error occurred: ' + error.message);
            setIsLoading(false)
        }
    };
    const localOnboarding = async (id_token: any) => {
        const value: any = await AsyncStorage.getItem('onboarding');
        const token = JSON.parse(value);
        setOnboardingData({ ...token })
        if (token && id_token) {
            handlePostRequest(token, id_token, date);
        }
    }
    useEffect(() => {
        getLocalStorage()
        const tokenHandle = async () => {
            const id_token: string | null = await AsyncStorage.getItem('id_token');
            if (id_token) {
                setIdToken(id_token)
                localOnboarding(id_token)
            }
        }
        tokenHandle()
    }, [])
    useEffect(() => {
        localOnboarding(idToken)
    }, [tabIndex])
    const onSelectRow = (e: any) => {
        setFilterdata({
            product: tabIndex === "PRODUCT" ? e[0] : null,
            merchant_id: tabIndex === "MERCHANT" ? e[0] : null,
            assignee: tabIndex === "ASSIGNEE" ? e[0] : null
        })
        navigation.navigate('Home')
    }
    const resetHandle = () => {
        handlePostRequest(onboardingData, idToken, { startDate: presentDate, endDate: presentDate });
        setIsModalOpen(false)
        setSelectedDate({ startDate: presentDate, endDate: presentDate })
        setDateReset(true)
        setDate({ startDate: presentDate, endDate: presentDate });
    }
    const applyHandle = () => {
        handlePostRequest(onboardingData, idToken, selectedDate);
        setIsModalOpen(false)
        setDate(selectedDate)
    }
    return (
        <>
            <HeaderBar onClick={() => setIsModalOpen(true)} />
            <View style={{ padding: 15, flex: 1 }}>
                <View style={styles.tabContainer}>
                    {tabOption?.map((item, index) =>
                        <TouchableOpacity
                            key={index}
                            style={[styles.tab, tabIndex === item && styles.activeTab]}
                            onPress={() => setTabIndex(item)}
                        >
                            <Text style={[styles.tabText, tabIndex === item && { color: '#8F49DE' }]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {isLoading ? <Loader /> :
                    <TableComponent
                        headers={headers}
                        data={processResponse(response, tabIndex)}
                        onSelectRow={onSelectRow}
                    />
                }
                <ModalComponent modalVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <DatePicker setDate={(e: any) => {
                            setSelectedDate(e)
                        }
                        } dateHeight={550} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#fff', borderColor: '#E7E7E7', borderWidth: 1 }]}
                                onPress={resetHandle}
                            >
                                <Text style={[styles.buttonText, { color: 'black', }]}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#8F49DE' }]} onPress={applyHandle}>
                                <Text style={[styles.buttonText, { color: '#fff', }]}>Apply Date</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ModalComponent>
            </View>
        </>
    )
}

export default TableDetails

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
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
    button: {
        // backgroundColor:'purple',
        paddingVertical: 16,
        paddingHorizontal: 18,
        color: '#fff',
        borderRadius: 16,
        flex: 1,

    },
    buttonText: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 600,
        textAlign: 'center'
    }
})