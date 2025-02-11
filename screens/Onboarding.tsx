import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import { useAppContext } from './Context/AppContext';
import { Dropdown } from 'react-native-element-dropdown';
import merchantList from '../screens/Helpers/merchant.json';
import { getDates } from "./Helpers/hepler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


const Onboarding = ({ filterApplyHandle, setOnBoarded }: any) => {
  const{presentDate, lastTwoDates} = getDates();
  const { date, setDate, setLoginModal, loginModal,filterData,setTicketList,ticketList,setFilterdata } = useAppContext();

  const filterOptions = ["Product", "merchant_id", "Assignee"];
  const dataOptions = {
    Product: ["Tokenization", "Mandate/Subscription", "Dashboard", "SDK", "Payout"],
    merchant_id: [],
    Assignee: []
  };
  const [selectedCatagory, setSelectedCatagory] = useState("Product");
  const navigation = useNavigation();
  const [selectedData, setSelectedData] = useState({
    product: null,
    merchant_id: null,
    assignee: null
  });
  const productData = [
    { label: 'Tokenization', value: 'Tokenization' },
    { label: 'Mandate/Subscription', value: 'Mandate/Subscription' },
    { label: 'Dashboard', value: 'Dashboard' },
    { label: 'SDK', value: 'SDK' },
    { label: 'Payout', value: 'Payout' },
  ];
  const merchantData = merchantList?.map((item)=>{
   return {label:item, value:item} 
  })
  const assigneeData = [
    { label: 'maheti.mehra@juspay.in', value: 'maheti.mehra@juspay.in' },
    { label:  'vaibhav.goel@juspay.in', value:  'vaibhav.goel@juspay.in' },
    { label:  'feature.support@juspay.in', value:  'feature.support@juspay.in' },
    { label: 'sanket.dawange@juspay.in', value: 'sanket.dawange@juspay.in' },
    { label: 'muhammad.alam@juspay.in', value: 'muhammad.alam@juspay.in' },
    { label: 'lohit.bhardwaj@juspay.in', value: 'lohit.bhardwaj@juspay.in' },
    { label: 'tanmayi.relangi@juspay.in', value: 'tanmayi.relangi@juspay.in' },
    { label: 'sparsha.mn@juspay.in', value: 'sparsha.mn@juspay.in' },
    { label: 'akshita.sahai@juspay.in', value: 'akshita.sahai@juspay.in' },
    { label: 'abhishek.gautam@juspay.in', value: 'abhishek.gautam@juspay.in' },
    { label: 'mohammad.faisal@juspay.in', value: 'mohammad.faisal@juspay.in' },
    { label: 'sophia.anjelica@juspay.in', value: 'sophia.anjelica@juspay.in' },  
  ];


  const resetFilters = async() => {
    setSelectedData({
      product: null,
      merchant_id: null,
      assignee: null
    });
    try {
        await AsyncStorage.removeItem('onboarding');
        console.log('Key removed successfully');
      } catch (error) {
        console.error('Error removing key:', error);
      }
    // filterApplyHandle();
  };

  const applyFilters =async () => {
    try {
        const jsonValue = JSON.stringify(selectedData);
        await AsyncStorage.setItem('onboarding', jsonValue);
        setFilterdata({...selectedData})
        setOnBoarded(true)
        // navigation.navigate('Home')
      } catch (e) {
        // saving error
      }
    // filterApplyHandle(selectedData);
  };
 
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.5, borderRightWidth: 1, borderRightColor: "#EDEDED" }}>
          <ScrollView style={{ flex: 1 }}>
            {filterOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.listItem}
                onPress={() => setSelectedCatagory(item)}
              >
                <Text
                  style={[
                    styles.bullet,
                    selectedCatagory === item
                      ? { color: "#8F49DE", borderLeftColor: "#8F49DE", borderLeftWidth: 4 }
                      : { color: "#454545" }
                  ]}
                >
                </Text>
                <Text
                  style={[
                    styles.title,
                    selectedCatagory === item ? { color: "#8F49DE" } : { color: "#454545" }
                  ]}
                >
                  {item === "merchant_id" ? "Merchant ID" : item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ flex: 1, padding: 6 }}>
          {selectedCatagory === "Product" ? (
            <Dropdown
              style={{ height: 50, backgroundColor: '#F6F6F6', padding: 15, borderRadius: 10 }}
              data={productData}
              search
              value={selectedData?.product}
              labelField="label"
              valueField="value"
              onChange={item => {
                setSelectedData({ ...selectedData, product: item?.value })
              }}
              maxHeight={250}
            />
          ) : selectedCatagory === "merchant_id" ? (
            <Dropdown
              search
              style={{ height: 50, backgroundColor: '#F6F6F6', padding: 15, borderRadius: 10 }}
              data={merchantData}
              value={selectedData?.merchant_id}
              labelField="label"
              valueField="value"
              onChange={item => {
                setSelectedData({ ...selectedData, merchant_id: item?.value })
              }}
              maxHeight={250}
            />
          ) : <Dropdown
            search
            style={{ height: 50, backgroundColor: '#F6F6F6', padding: 15, borderRadius: 10 }}
            data={assigneeData}
            value={selectedData?.assignee}
            labelField="label"
            valueField="value"
            onChange={item => {
              setSelectedData({ ...selectedData, assignee: item?.value })
            }}
            maxHeight={250}
          />}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Reset"
          buttonStyle={styles.resetButton}
          onPress={resetFilters}
          titleStyle={{ color: "black" }}
        />
        <Button title="Apply Filters" buttonStyle={styles.applyButton} onPress={applyFilters} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopColor: "#EDEDED",
    borderTopWidth: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5
  },
  list: {
    flex: 1
  },
  bullet: {
    fontSize: 18,
    color: "#333",
    padding: 8
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 8,
    marginVertical: 4
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    borderTopColor: "#EDEDED",
    borderTopWidth: 1,
    gap: 10
  },
  applyButton: {
    backgroundColor: "#8F49DE",
    borderRadius: 16,
    height: 46,
    width: 165
  },
  resetButton: {
    borderColor: "#F2F2F2",
    borderRadius: 16,
    height: 46,
    width: 165,
    backgroundColor: "#F2F2F2"
  },
  listItem: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  }
});

export default Onboarding;
