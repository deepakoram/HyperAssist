import AsyncStorage from '@react-native-async-storage/async-storage';
import { Apis } from '../Utils/util';
import { useAppContext } from '../Context/AppContext';

const {TicketDetailApi, MerchantFollowUpApi} = Apis;
// const { cacheStatus,isLoading, setIsLoading,date, setDate, setLoginModal, loginModal, filterData, setTicketList, ticketList, setMatricData, todayStatus } = useAppContext();

const tokenHandle = async ()=>{
    const id_token: string | null = await AsyncStorage.getItem('id_token');
    return id_token
   }
   

export const handleTicketData = async (ticket_id:string , setIsLoading:any) => {
    const value: any = await AsyncStorage.getItem('auth-token');
    const token = JSON.parse(value);
    let id_token = tokenHandle();
    setIsLoading(true)
    try {
        const response = await fetch(TicketDetailApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
                'id_token':id_token,
            },
            body: JSON.stringify({
                ticket_number: ticket_id,
                issue_reported_date: {
                    from: null,
                    to: null
                },
                environment: null,
                issue_type: null,
                category: null,
                product: null,
                ticket_status: null,
                ticket_genre: null,
                query_type: null,
                issue_sub_category: null,
                payment_method: null,
                payment_method_type: null,
                severity: null
            }),
        });

        if(response){
            const data = await response.json();
            setIsLoading(false)
            return data;
        }
    } catch (error: any) {
        console.log('Error occurred: ' + error.message);
        setIsLoading(false)
    }
};
export const merchantFollowUp = async (ticket_id:string , setIsLoading:any) => {
    const value: any = await AsyncStorage.getItem('auth-token');
    const token = JSON.parse(value);
    let id_token = tokenHandle();
    setIsLoading(true)
    let payload = {
        issue_reported_date:{
            from:"2025-01-27T18:30:00Z",
            to:"2025-01-28T18:29:59Z"
        },
        alert_type: "merchant_followup"
    }
    try {
        const response = await fetch(MerchantFollowUpApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'juspay_token':'12e69664ad84d009ece291b161a01a',
                'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
                'id_token':id_token,
            },
            body: JSON.stringify(payload),
        });

        if(response){
            const data = await response.json();
            setIsLoading(false)
            return data;
        }
    } catch (error: any) {
        console.log('Error occurred: ' + error.message);
        setIsLoading(false)
    }
};