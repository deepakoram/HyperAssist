import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, StatusBar, Clipboard, Alert } from "react-native";
import EmailModal from './EmailModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from "./HeaderBack";
import ModalComponent from "./Components/ModalComponent";
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Apis } from "./Utils/util";
import {containsHtmlTable, formatHTMLWithNewlines} from "./Helpers/hepler";
import Loader from "./Components/Loader";
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
let statusBarHeight = StatusBar.currentHeight || 0;



const TicketDetail = ({ route }: any) => {
    const {TicketDetailApi, WorkflowApi} = Apis;
    const { width } = useWindowDimensions();
    const [modalVisible, setModalVisible] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [ticketsData, setTicketsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [workflow, setWorkflow] = useState<any>();
    const [isWorkflow, setIsWorkflow] = useState<boolean>(false)
    const [textToCopy, setTextToCopy] = useState('This is the string to copy!');
    const [idToken, setIdToken] = useState<string | null>('');
    

    // let tabOption = ['MIMIR RESPONSE', "WORKFLOWS", "GENIUS"];
    const copyToClipboard = () => {
        Clipboard.setString(textToCopy); // Copies the string to the clipboard
        Alert.alert('Copied to Clipboard', 'The text has been copied successfully!');
    };
    let tabOption = workflow?.content_summary ? ["MIMIR RESPONSE","WORKFLOWS"] :["WORKFLOWS"];
    const ticketDetails: any = ticketsData[0];
    const handleTicketData = async () => {
        const value: any = await AsyncStorage.getItem('auth-token');
        const token = JSON.parse(value);
        setIsLoading(true)
        try {
            const response = await fetch(TicketDetailApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
                    'id_token':idToken,
                },
                body: JSON.stringify({
                    id: route?.params?.id,
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

            const data = await response.json();
            setTicketsData(data);
            setTextToCopy(data[0]?.subject)
            let res = data[0]?.workflow_data
            if (typeof res === 'object' && res !== null && !Array.isArray(res)) {
                let workflowId = Object.values(data[0]?.workflow_data)[0]
                if (Object.hasOwn(workflowId, 'workflowId')) {
                    handleWorkflow(workflowId?.workflowId)
                    setIsWorkflow(true)
                } else {
                    setIsWorkflow(false)
                }
            } else {
                setIsWorkflow(false)
            }


            setIsLoading(false)
        } catch (error: any) {
            console.log('Error occurred: ' + error.message);
            setIsLoading(false)
        }
    };
    const handleWorkflow = async (workflowId: any) => {        
        setIsLoading(true)
        try {
            const response = await fetch(WorkflowApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ef00555a-cb5d-4996-8917-6427773376e5',
                    'id_token':idToken,
                },
                body: JSON.stringify({
                    id: workflowId
                }),
            });

            const data = await response.json();
            setWorkflow(data)
            setIsLoading(false)
        } catch (error: any) {
            console.log('Error occurred: ' + error.message);
            setIsLoading(false)
        }
    }
    function formatDate(dateString: any) {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const date = new Date(dateString);

        const day = date.getDate();
        const month = months[date.getMonth()];
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const isPM = hours >= 12;
        const formattedHours = (hours % 12) || 12; // Convert to 12-hour format
        const ampm = isPM ? "PM" : "AM";

        return `${day} ${month}, ${formattedHours}:${minutes} ${ampm}`;
    }
    useEffect(() => {
        handleTicketData();
        const tokenHandle = async ()=>{
            const id_token: string | null = await AsyncStorage.getItem('id_token');
            setIdToken(id_token)
           }
           tokenHandle()
    }, [])
    const navigation = useNavigation();
    let workflowHtmlContent = "";
    if(workflow?.content_summary){
        if(tabIndex === 0){
            workflowHtmlContent = workflow?.content_summary?.mimir_content
        }else{
            if (Array.isArray(workflow?.content_summary?.merchant_content) && workflow?.content_summary?.merchant_content.length > 0) {
                workflowHtmlContent = workflow?.content_summary?.merchant_content.join(", ");
            } else if (typeof workflow?.content_summary?.merchant_content === "string" && workflow?.content_summary?.merchant_content.trim() !== "") {
                workflowHtmlContent = workflow?.content_summary?.merchant_content;
            } else if (Array.isArray(workflow?.content_summary?.pg_content) && workflow?.content_summary?.pg_content.length > 0) {
                workflowHtmlContent = workflow?.content_summary?.pg_content.join(", ");
            } else if (typeof workflow?.content_summary?.pg_content === "string" && workflow?.content_summary?.pg_content.trim() !== "") {
                workflowHtmlContent = workflow?.content_summary?.pg_content;
            } else {
                workflowHtmlContent = `<h4>Workflow Status:- </h4>${workflow?.workflow_status || "<p>Not Available</p>"}`;
            }
        }
    }else{
        if (Array.isArray(workflow?.merchant_content) && workflow?.merchant_content.length > 0) {
            workflowHtmlContent = workflow?.merchant_content.join(", ");
        } else if (typeof workflow?.merchant_content === "string" && workflow?.merchant_content.trim() !== "") {
            workflowHtmlContent = workflow?.merchant_content;
        } else if (Array.isArray(workflow?.pg_content) && workflow?.pg_content.length > 0) {
            workflowHtmlContent = workflow?.pg_content.join(", ");
        } else if (typeof workflow?.pg_content === "string" && workflow?.pg_content.trim() !== "") {
            workflowHtmlContent = workflow?.pg_content;
        } else {
            workflowHtmlContent = `<h4>Workflow Status:- </h4>${workflow?.workflow_status || "<p>Not Available</p>"}`;
        }
    }
    function removeImgTags(htmlContent) {
        // Use a regex to match and remove <img> tags
        return htmlContent.replaceAll(/<img[^>]*>/g, "");
    }
    
    return (
        isLoading ? <Loader/> :
            <View style={styles.container}>
                <HeaderBack ticketDetails={ticketDetails} />

                <View style={styles.innerContainer}>
                    {/* Title Section */}

                    <Text style={styles.title}>{ticketDetails?.subject}</Text>
                    <Text style={styles.metaText}>{ticketDetails?.merchant} • {ticketDetails?.ticket_number} • {formatDate(ticketDetails?.reported_date)}</Text>
                    <View style={{ width: '100%',flexDirection:'row', justifyContent: 'space-between', padding: 3 }}>
                        <Text style={{ color: '#939393', fontSize: 13, lineHeight: 16, fontWeight: '500', marginBottom: 12 }}>
                            Assigned To: <Text style={{ color: '#2B2B2B', fontSize: 13, lineHeight: 16, fontWeight: '500' }}>{ticketDetails?.assignee} </Text>
                        </Text>
                        <TouchableOpacity onPress={copyToClipboard}>
                            <Image
                                style={{
                                    height: 20,
                                    width: 20,
                                    marginLeft: 3,
                                    resizeMode: 'contain', // Use resizeMode instead of objectFit
                                }}
                                source={require('./../assets/copy-paste.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Chat', { id: route?.params?.id, mailSubject: ticketDetails?.subject, ticket_id :route?.params?.ticket_id, id_token:idToken})}>
                        <Text style={{ color: '#2B2B2B', fontSize: 13, lineHeight: 16, fontWeight: '500', marginBottom: 12 }}>
                            See Full Mail Thread
                        </Text>
                    </TouchableOpacity>
                        
                    {/* <Text style={{ fontSize: 13, fontWeight: '500', lineHeight: 13, color: '#2B2B2B', textDecorationLine: "underline", marginVertical: 5 }}>View More</Text> */}

                    {/* Response Tab Navigation */}
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

                    {/* Scrollable Content */}
                    <View style={styles.rcaContainer}>
                        {/* <View style={{ marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Image style={{ width: 32, height: 32, resizeMode: 'contain' }} source={require('./../assets/star-logo2.png')} />
                            <Image style={{ width: 16, height: 16, resizeMode: 'contain' }} source={require('./../assets/refresh.png')} />
                        </View> */}
                        <View style={{ height: 'auto' }}>
                            <ScrollView 
                            // Enable horizontal scrolling
                            horizontal={containsHtmlTable(workflowHtmlContent)}
                        
                            showsHorizontalScrollIndicator={true}
                            showsVerticalScrollIndicator={true}
                            >
                               <ScrollView>
                                <View>

                                    {!isWorkflow ? <Text style={styles.sectionTitle}>
                                        No Workflow Found...
                                    </Text> :
                                        <RenderHTML
                                            contentWidth={width}
                                            source={{ html: removeImgTags(formatHTMLWithNewlines(workflowHtmlContent).replaceAll('font-size: 0', '')) }}
                                            ignoredDomTags={['o:p', 'meta', 'font']}
                                        />}
                                    {/* <Text>{workflow?.workflow_status}</Text> */}
                                </View>
                                </ScrollView>
                            </ScrollView>
                            {/* <View style={styles.draftButtonContainer}>
                                    <TouchableOpacity style={styles.draftButton} onPress={() => setModalVisible(true)}>
                                        <Image style={{ height: 14, marginRight: 3, resizeMode: 'contain' }} source={require('./../assets/message.png')} />
                                        <Text style={styles.draftButtonText}>Draft Email</Text>
                                    </TouchableOpacity>
                                </View> */}
                        </View>
                    </View>
                    {/* Sticky Draft Button */}

                    <ModalComponent crossbuttonVisible={true} modalVisible={modalVisible} onClose={() => setModalVisible(false)} >
                        <EmailModal />
                    </ModalComponent>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F8F9",
    },
    innerContainer: {
        flex: 1,
        margin: 24
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
        borderRadius: 5,
        padding: 4
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
        color: "#2B2B2B",
        marginBottom: 12

    },
    metaText: {
        fontSize: 13,
        fontWeight: '500',
        color: "#939393",
        marginBottom: 12

    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 24,
        marginTop: 24,
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

    rcaContainer: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 19,
        color: "#454545",
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 14,
        color: "#5F5F5F",
        fontWeight: "400",
        lineHeight: 22,
    },
    draftButtonContainer: {
        position: 'absolute',
        bottom: 70,
        right: -16,
        zIndex: 1000
    },
    draftButton: {
        width: 126,
        backgroundColor: "#8F49DE",
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: "center",
        padding: 16,
        flexDirection: "row",
        alignContent: "center",
    },
    draftButtonText: {
        fontSize: 14,
        lineHeight: 14,
        color: "#FFFFFF",
        fontWeight: "600",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
});

export default TicketDetail;
