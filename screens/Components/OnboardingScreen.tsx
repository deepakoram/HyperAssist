import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert,ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import LoginThemeScreen from './LoginThemeScreen'
import Input from './Input'
import CustomButton from './CustomButton'
import MultiSelect from './MultiSelect'
import MultiSelectProduct from './MultiSelectProduct'
import merchantList from '../Helpers/merchant.json'
import { useAppContext } from '../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../Helpers/colors'
import SearchInput from './SearchInput'
import { Apis } from '../Utils/util';
import debounce from 'lodash.debounce';
import SelectedItem from '../Components/SelectedItem';




interface Option {
  id: number;
  name: string;
}

const ProductList = [
  "Transaction - Fast Track",
  "Transaction - Dev Support",
  "Refund - Fast Track",
  "Refund - Dev Support",
  "Critical Information",
  "General Information",
  "Tokenization",
  "Mandate/Subscription",
  "Dashboard",
  "SDK",
  "Payout",
  "PL/SL",
  "PL Routing Issue",
  "Offers",
  "EMI",
  "OTHERS"
];
const assigneeList = [
  { id: 'maheti.mehra@juspay.in', name: 'maheti.mehra@juspay.in' },
  { id: 'vaibhav.goel@juspay.in', name: 'vaibhav.goel@juspay.in' },
  { id: 'feature.support@juspay.in', name: 'feature.support@juspay.in' },
  { id: 'sanket.dawange@juspay.in', name: 'sanket.dawange@juspay.in' },
  { id: 'muhammad.alam@juspay.in', name: 'muhammad.alam@juspay.in' },
  { id: 'lohit.bhardwaj@juspay.in', name: 'lohit.bhardwaj@juspay.in' },
  { id: 'tanmayi.relangi@juspay.in', name: 'tanmayi.relangi@juspay.in' },
  { id: 'sparsha.mn@juspay.in', name: 'sparsha.mn@juspay.in' },
  { id: 'akshita.sahai@juspay.in', name: 'akshita.sahai@juspay.in' },
  { id: 'abhishek.gautam@juspay.in', name: 'abhishek.gautam@juspay.in' },
  { id: 'mohammad.faisal@juspay.in', name: 'mohammad.faisal@juspay.in' },
  { id: 'sophia.anjelica@juspay.in', name: 'sophia.anjelica@juspay.in' },
  { id: 'chandan.dogra@juspay.in', name: 'chandan.dogra@juspay.in' },  
  { id: 'anand.singh.002@juspay.in', name: 'anand.singh.002@juspay.in' },  
  { id: 'sakshee.kushwaha@juspay.in', name: 'sakshee.kushwaha@juspay.in' },  
  { id: 'palak.shivlani@juspay.in', name: 'palak.shivlani@juspay.in' },  
  { id: 'darshan.sithan@juspay.in', name: 'darshan.sithan@juspay.in' },  
  { id: 'Manohar.mula@juspay.in', name: 'Manohar.mula@juspay.in' },  
  { id: 'nelson.s@juspay.in', name: 'nelson.s@juspay.in' },  
  { id: 'mohammad.f@juspay.in', name: 'mohammad.f@juspay.in' },  
];
const convertToProductList = (data: any) => {
  return data.map((name: any, index: any) => ({
    id: name, // Assigns a unique ID starting from 1
    name, // The string itself as the name
  }));
};
const Teams = () => {
  const buttonHandle = () => {
    console.log("clicked")
  }
  return (
    <LoginThemeScreen subTitle={'Select the teams you want to track tickets for:'}>
      <View style={styles.inputWrapper}>
        <MultiSelect />
      </View>

      <CustomButton onPress={buttonHandle} title={'Continue'} />
    </LoginThemeScreen>
  )
}

const LoginFields = () => {
  const textChangeHandle = (e: any) => {
    console.log(e)
  }
  const buttonHandle = () => {
    console.log("clicked")
  }
  return (
    <LoginThemeScreen subTitle={'Use your Euler Login:'}>
      <View style={styles.inputWrapper}>
        <Input placeholder={"Username"} onChangeText={textChangeHandle} />
        <Input placeholder={"Password"} onChangeText={textChangeHandle} />
      </View>

      <CustomButton onPress={buttonHandle} title={'Continue'} />
    </LoginThemeScreen>
  )
}
const Product = ({ setOnBoarded }: any) => {
  const merchantData = [...new Set(merchantList)];
  const { date, setDate, setLoginModal, loginModal, filterData, setTicketList, ticketList, setFilterdata } = useAppContext();
  const [steps, setSteps] = useState<any[]>(["dummy"]);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [merchantItems, setMerchantItems] = useState<any[]>(['bms','geddit','bigbasket']);
  const [assigneeItems, setAssigneeItems] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<any>("");
  const [emailResponse, setEmailResponse] = useState<any>("");
  const [listData,setListData] = useState<any>([])
  const [defaultListData,setDefaultListData] = useState<any>([])
  
  let itemSelected =steps.length === 1 ? productItems : steps.length === 2 ? merchantItems : steps.length === 3 ? assigneeItems : null

  let payload = {
    product: productItems.length > 0 ? productItems : null,
    merchant_id: merchantItems.length > 0 ? merchantItems : null,
    assignee: assigneeItems.length > 0 ? assigneeItems : null
  }
  
  let payloadTwo = {
    product: productItems.length > 0 ? productItems[0] : null,
    merchant_id: merchantItems.length > 0 ? merchantItems[0] : null,
    assignee: assigneeItems.length > 0 ? assigneeItems[0] : null
  }
  const getLocalStorage = async () => {
    const email_data: any = await AsyncStorage.getItem('email-response');
    if (email_data) setEmailResponse(JSON.parse(email_data))
  }
  const buttonHandle = async (status: any = "") => {
    if (steps.length < 3) {
      setSteps([...steps, 'dummy'])
      if (status === 'skip') {
        if (steps.length === 1) {
          setProductItems([])
        } else if (steps.length === 2) {
          setMerchantItems([])
        } else if (steps.length === 3) {
          setAssigneeItems([])
        }
      }
    }
     else {
      
      try {
        const jsonValue = JSON.stringify(payload);
        await AsyncStorage.setItem('onboarding', jsonValue);
        // setFilterdata({ ...payloadTwo })
        setFilterdata({ product: null,
          merchant_id: null,
          assignee: null })
        setOnBoarded(true)
        // navigation.navigate('Home')

      } catch (e) {
        // saving error
      }
    }
  }
  let subTitle;
  switch (steps.length) {
    case 1:
      subTitle = 'Select Product:'
      break;
    case 2:
      subTitle = 'Select Merchant:'
      break;
    case 3:
      subTitle = 'Select Assignee:'
      break;
    default:
    // code block
  }
  const previousButtonHandle = () => {
    setSteps(prevSteps => prevSteps.slice(0, -1));
  }
  const searchSubmit = ()=>{
    let x = defaultListData.filter((item:any)=>item?.id.replaceAll(" ",'').toLowerCase().includes(searchValue.replaceAll(" ",'').toLowerCase()))
    if(x.length > 0){
      setListData([...x])
    }else{
      Alert.alert("No Results Found.")
    }
  }
  useEffect(()=>{getLocalStorage()},[])
  useEffect(()=>{
    let response =steps.length === 1 ? convertToProductList(ProductList) : steps.length === 2 ? convertToProductList(merchantData) : steps.length === 3 ? assigneeList : null
    setListData([...response])
    setDefaultListData([...response])
  },[steps])

  const debouncedSearch = useCallback(
    debounce((query) => {   
      let text = query.replaceAll(" ",'')
      if(text.length >0){
      let x = defaultListData.filter((item:any)=>item?.id.replaceAll(" ",'').toLowerCase().includes(text.toLowerCase()))
      if(x.length > 0){
        setListData([...x])
      }else{
        Alert.alert("No Results Found.")
      }
    }else{
      let response =steps.length === 1 ? convertToProductList(ProductList) : steps.length === 2 ? convertToProductList(merchantData) : steps.length === 3 ? assigneeList : null
      setListData([...response])
    }
    }, 500),
    [listData]
  );

  const handleChange = (text:any) => {
    debouncedSearch(text);
    if(text.length > 0){
      setSearchValue(text);
      }else{
      setSearchValue('')
      }
  };
  const handleSelect = (e)=>{
    switch (steps.length) {
      case 1:
        setProductItems(prevItems => prevItems.filter(item => item !== e));
        break;
      case 2:
        setMerchantItems(prevItems => prevItems.filter(item => item !== e));
        break;
      case 3:
        setAssigneeItems(prevItems => prevItems.filter(item => item !== e));
        break;
      default:
    }
    
  }
  function sortByName(array) {
    return array.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
  return (
    <LoginThemeScreen>
      <View style={styles.inputWrapper}>
        <View style={{height:40,justifyContent:'center',padding:5}}>
          <ScrollView horizontal>
          {itemSelected?.map((item,index)=>
          <SelectedItem text={item} onPress={(e)=>handleSelect(e)} key={index}/>)}
          </ScrollView>
        </View>
        <SearchInput
        placeholder='Search...'
        placeholderTextColor="#fff"
        onChangeText={(e: any) => {
          handleChange(e)
        }}
        value={searchValue}
        style={styles.searchStyle}
        inputStyle={styles.inputStyle}
        // inputStyle = {}, // Additional input styles
        keyboardType="default"
        handleSubmit={() => searchSubmit()}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 1 }}>
             {steps.length === 1 && <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={styles.subHeading}>{subTitle}</Text></View>}
          {steps.length !== 1 ? <TouchableOpacity onPress={previousButtonHandle} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ height: 20, width: 20, marginLeft: 3, resizeMode: 'contain' }} source={require('../../assets/back_arrow_white.png')} />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.subHeading}>{subTitle}</Text>
            </View>
          </TouchableOpacity> : <Text></Text>}
          <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 4, borderRadius: 16 }} onPress={() => buttonHandle('skip')}>
            <Text style={{ color: 'gray',fontSize:18 }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
        <MultiSelectProduct
          setSelectedItems={steps.length === 1 ? setProductItems : steps.length === 2 ? setMerchantItems : steps.length === 3 ? setAssigneeItems : null}
          selectedItems={steps.length === 1 ? productItems : steps.length === 2 ? merchantItems : steps.length === 3 ? assigneeItems : null}
          data={listData} />
      </View>
      {/* {steps.length!==1 ? <CustomButton onPress={previousButtonHandle} title={'Previous'} /> : null} */}
      <CustomButton onPress={buttonHandle} title={steps.length === 3 ? 'Submit' : 'Continue'} />
    </LoginThemeScreen>
  )
}

const OnboardingScreen = ({ setOnBoarded }: any) => {
  return (
    //  <Teams/>
    // <LoginFields/>
    <Product setOnBoarded={setOnBoarded} />
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  inputWrapper: {
    // gap: 16,
    flex: 1,
  },
  subHeading: {
    color: '#FCFCFC',
    fontSize: 18,
    fontWeight: '500'
  },
  searchStyle:{
    borderWidth:1,
    borderColor:'#42048a',
  },
  inputStyle:{
   color:'#fff',
   fontSize:13
  }
})