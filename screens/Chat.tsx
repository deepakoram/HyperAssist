import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Alert, Platform, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { GiftedChat, IMessage, Bubble, BubbleProps } from 'react-native-gifted-chat';
import RNFS from 'react-native-fs';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from './Components/ModalComponent';
import { truncateString, apiFetch,containsHtmlTable } from './Helpers/hepler';
import { Dimensions } from 'react-native';
import { Apis } from './Utils/util';
import StatusTag from './Components/StatusTag';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Components/Loader';


// Get screen width
const { width } = Dimensions.get('window');

const generateUUID = (): string => {
  // Generates a random UUID version 4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

type Thread = {
  mail_html_body: string;
  mail_input: string;
  from_Email: string;
  cc_email: string;
};

type EmailData = {
  subject: string;
  threads: Thread[];
};

type ThreadData = {
  body: string;
  dateTime: string; // Assuming the date is always in ISO 8601 format
  fromEmailAddress: string | undefined;
  toEmailAddresses: string | undefined;
  subject: string | undefined;
  links?: object | undefined; // `links` is optional and can be any object or `null`
};

function newConvertTicketData(val: any, map: Map<string, string>, index: number): CustomIMessage {
  let idd = `${map.get(val?.from_email_address) || generateUUID()}-${index}`;
  return {
    _id: idd,
    text: val?.summary,
    htmlContent: null, // Assuming there's no `mail_html_body` field in the provided data
    createdAt: new Date(val?.createdTime),
    user: {
      _id: idd,
      name: val?.from_email_address,
    },
    userdata: {
      to: val?.to_email_address,
      from: val?.from_email_address,
      cc: val?.cc_email_addresses,
    },
    links: [], // Assuming no `links` field is available in the provided response
    ticket_id: val?.id,
    actionable: val?.threadActionable,
    error: val?.error
  };
}


interface attachments {
  href: string,
  name: string
}

interface links {
  additionalLinks?: string[],
  attachments?: attachments[]
}

export interface mailData {
  body: string;
  toEmailAddresses: string;
  fromEmailAddress: string;
  links?: links;
  subject: string;
}

export interface mailInput {
  mail_input: string;
  id: string;
  created_time: string;
  cc_email: string;
}


// Define custom message interface with additional attachment types
interface CustomIMessage extends IMessage {
  image?: string;
  video?: string;
  file?: {
    uri: string;
    name: string;
    mimeType: string;
  };
  userdata: {
    to?: string;
    from?: string;
    cc?: string;
  }
  htmlContent?: any;
  Subject?: string;
  links?: links;
  ticket_id?: string;
}

const ChatScreen = ({ route }: any) => {
  const MAX_HTML_LENGTH = 30000;
  const { AllThreadsApi, ThreadsDetailsApi } = Apis
  const giftedChatRef = useRef<FlatList<IMessage>>(null);
  const [ticketData, setTicketData] = useState<EmailData | null>(null);
  const [messages, setMessages] = useState<CustomIMessage[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<any>("");
  const [body, setBody] = useState("");
  const [emailResponse, setEmailResponse] = useState<any>({});
  const handleScrollToTop = () => {
    if (giftedChatRef.current && giftedChatRef.current.scrollToIndex) {
      giftedChatRef.current.scrollToIndex({ index: messages.length - 1, animated: true });
    }
  };
  function sortThreadsByCreatedTime(data: any) {
    if (!data || !data.threads || !Array.isArray(data.threads)) {
      throw new Error("Invalid data format");
    }

    return data.threads.sort((a: any, b: any) => new Date(b.createdTime) - new Date(a.createdTime));
  }
  const fetchAllThreadDetails = async () => {
    const payload = {
      ticket_id: route?.params?.ticket_id
    }

    let res = await apiFetch({
      url: AllThreadsApi,
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'id_token': route?.params?.id_token,
      },
      setIsLoading
    });
    if (res) {
      let response = sortThreadsByCreatedTime(res)
      const threads = response?.filter((item: any) => item?.status === 'SUCCESS');
      const map = new Map<string, string>(); // Initialize as needed
      const messages = threads.map((thread: any, index: any) => newConvertTicketData(thread, map, index));
      if (messages.length > 50) {
        let arr = messages.splice(1, 50);
        setMessages(arr)
      } else {
        setMessages(messages)
      }
    } else {
      setMessages([])
    }
  }

  const fetchThreadDetails = async (id: any) => {
    const payload = {
      ticket_id: route?.params?.ticket_id,
      thread_id: id
    }
    let res = await apiFetch({
      url: ThreadsDetailsApi,
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'id_token': route?.params?.id_token,
      },
      setIsLoading
    });
    setBody(res?.plainText)
    let x = res?.content?.replaceAll('font-size: 0', '')
    setModalData(x)
  }
  useEffect(() => {
    fetchAllThreadDetails()
  }, [])
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: route?.params?.mailSubject || "Email Thread" });
  }, [navigation, route?.params?.mailSubject]);

  useEffect(() => {
    // setMessages(dummyMessages);
  }, []);

  const onSend = useCallback((newMessages: CustomIMessage[] = []) => {
    // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, []);

  const renderFileMessage = (props: { currentMessage: CustomIMessage }) => {
    const { file } = props.currentMessage;
    if (file) {
      return (
        <TouchableOpacity onPress={() => downloadFileToDownloads(file.uri, file.name)}>
          <Text style={styles.fileText}>{file.name}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const toggleSenderInfoVisibility = (index: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message, i) =>
        i === index
          ? { ...message, senderInfoVisible: !message.senderInfoVisible }
          : message
      )
    );
  };

  const renderBubble = useCallback(
    (props: BubbleProps<CustomIMessage>) => {
      const { currentMessage } = props;
      const messageIndex = messages.findIndex(
        (msg) => msg === currentMessage
      );

      return (
        <View style={{ flex: 1, marginRight: 30, marginBottom: 20 }}>
          {currentMessage.userdata.from && (
            <TouchableOpacity
              style={{ marginVertical: 10, flexDirection: 'row' }}
              onPress={() => toggleSenderInfoVisibility(messageIndex)}
            >
              <Text style={[styles.senderName, { fontWeight: '600' }]}>
                From: {currentMessage.userdata.from}
              </Text>
              {currentMessage.senderInfoVisible ? (
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  source={require('./../assets/top_arrow.png')}
                />
              ) : (
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  source={require('./../assets/bottom_arrow.png')}
                />
              )}
            </TouchableOpacity>
          )}
          {currentMessage.senderInfoVisible && (
            <View style={styles.ccCard}>
              {currentMessage.userdata.from && (
                <Text style={styles.senderName}>
                  From: {currentMessage.userdata.from}
                </Text>
              )}
              {currentMessage.userdata.to && (
                <Text style={styles.senderName}>
                  To: {currentMessage.userdata.to}
                </Text>
              )}
              {currentMessage.userdata.cc && (
                <Text style={styles.senderName}>
                  cc: {currentMessage.userdata.cc}
                </Text>
              )}
              {currentMessage.Subject && (
                <Text style={styles.senderName}>
                  Subject: {currentMessage.Subject}
                </Text>
              )}
            </View>
          )}
          <Bubble {...props} />
        </View>
      );
    },
    [messages]
  );
  const renderMessageText = (props: { currentMessage: CustomIMessage }) => {
    const { currentMessage } = props;
    let additionalLinks = currentMessage.htmlContent || []
    const linkView = Array.from(new Set(additionalLinks)).map((item, index) => (
      <Text key={index}>
        {item}
      </Text>))

    if (currentMessage.text) {
      return (
        <TouchableOpacity style={[styles.htmlContentContainer, { padding: 10, paddingBottom: 5, width: width - 81 }]} onPress={() => {
          fetchThreadDetails(currentMessage?.ticket_id)
          setIsModalVisible(true)
        }}>
          <Text style={{ lineHeight: 20 }}>{truncateString(currentMessage.text)}</Text>;
          {/* {linkView} */}
        </TouchableOpacity>
      );
    }

    // Fallback to default rendering if no HTML content
    return <View style={[styles.htmlContentContainer, { padding: 10, width: width - 81 }]}>
      <Text >No Data Present</Text>;
      {/* {linkView} */}
    </View>
  };
  const renderCustomAvatar = (props: any) => {
    const { user } = props.currentMessage;
    function removeLeadingQuote(str: string) {
      if (str.startsWith('"')) {
        return str.slice(1);
      }
      return str;
    }
    function includesAny(arr:any, str:any) {
      // Ensure the string is in lowercase to handle case-insensitivity
      str = str.toLowerCase();
      return arr.some(item => str.includes(item.toLowerCase()));
    }
    let pgArray = ["pg.support","pgsupport","PayGlocal","payu","razorpay","camsonline"]
    return (
      <View style={[styles.avatarContainer, { backgroundColor: user?.name?.includes("@juspay.in") ? '#1B85FF' : includesAny(pgArray, user?.name) ? 'green' : '#ED232A' }]}>
        <Text style={styles.avatarText}>{removeLeadingQuote(user.name).substring(0, 2) || 'User'}</Text>
      </View>
    );
  };
  const getLocalStorage = async () => {
    const email_data: any = await AsyncStorage.getItem('email-response');
    if (email_data) setEmailResponse(JSON.parse(email_data))
  }
  const renderCustomTime = (props) => {
    const { currentMessage } = props;
    const date = new Date(currentMessage.createdAt);

    // Custom formatting
    const formattedDate = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()} ${date.getFullYear()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
      <View style={styles.timeContainer}>
        {currentMessage.actionable && <StatusTag status={currentMessage.actionable} />}
        {currentMessage.error && <StatusTag status={currentMessage.error} />}
        <Text style={styles.timeText}>{formattedDate}</Text>
      </View>
    );
  };
  const onCloseModal = () => {
    setIsModalVisible(false)
    setIsLoading(false)
  }
  useEffect(() => {
    getLocalStorage()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <Loader/> :
        <><View style={{ flex: 1 }}>
          <GiftedChat
            messagesContainerStyle={{ flex: 1, paddingBottom: 50 }}
            messages={messages}
            messageContainerRef={giftedChatRef}
            inverted={true}
            onSend={(messages) => console.log('sent')}
            user={{ _id: 1 }}
            renderAvatarOnTop
            showUserAvatar
            renderMessageImage={(props) => (
              <Image source={{ uri: props.currentMessage.image }} style={styles.image} />
            )}
            renderMessageVideo={(props) => (
              <TouchableOpacity onPress={() => {
                props.currentMessage.video && downloadFileToDownloads(props.currentMessage.video, "video.mp4")
              }}>
                <Image source={{ uri: props.currentMessage.video }} style={styles.videoThumbnail} />
              </TouchableOpacity>
            )}
            renderAvatar={renderCustomAvatar}
            renderCustomView={renderFileMessage}
            renderBubble={renderBubble}
            renderMessageText={renderMessageText}
            renderInputToolbar={() => null}
            renderTime={renderCustomTime}
          />

        </View>
          <TouchableOpacity style={styles.goToTopButton} onPress={handleScrollToTop}>
            <Text style={styles.buttonText}>Go to Top</Text>
          </TouchableOpacity> </>}
      <ModalComponent modalVisible={isModalVisible} onClose={onCloseModal} crossbuttonVisible={true} title="">
        {isLoading ? <Loader/> :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
            <ScrollView horizontal={modalData.length > 0 ? containsHtmlTable(modalData) : false}>
              <ScrollView>
              {modalData.length > MAX_HTML_LENGTH ? <Text>{body}</Text> : <RenderHtml
                contentWidth={width}
                source={{ html: modalData }}
                ignoredDomTags={['o:p', 'meta', 'font']}
                defaultTextProps={{ fontSize: 14 }}
              />}
              </ScrollView>
            </ScrollView>
          </View>}
      </ModalComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  goToTopButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 25,
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  videoThumbnail: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileText: {
    color: '#007BFF',
    fontSize: 14,
    marginTop: 5,
  },
  senderName: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 3,
    flexWrap: 'wrap'
  },
  ccCard: {
    borderColor: '#EDEDED',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 12
  },
  htmlContentContainer: {
    // padding: 10,
    // maxHeight: 105, 
    // overflow: 'hidden',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  customAvatar: {

  },
  avatarText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500'
  },
  timeContainer: {
    // marginTop: 5,
    // backgroundColor:'red',
    padding: 10,
    paddingTop: 0,
  },
  timeText: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
  actionable: {
    //  padding:5,
    //  backgroundColor:'green',
    //  borderRadius:24
  }
});

export default ChatScreen;

async function downloadFileToDownloads(url: string, fileName: string) {
  let destinationPath: string = Platform.OS === 'android' ? `${RNFS.DownloadDirectoryPath}/${fileName}` : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    const downloadResult = await RNFS.downloadFile({
      fromUrl: url,
      toFile: destinationPath,
    }).promise;

    if (downloadResult.statusCode === 200) {
      Alert.alert('File downloaded successfully:', destinationPath);
    } else {
      Alert.alert('Failed to download file:', "" + downloadResult.statusCode);
    }
  } catch (error) {
    console.error('Download error:', error);
  }
}