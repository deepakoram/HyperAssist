import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../Context/AppContext';
const DropdownMenu = ({dropdownVisible, setDropdownVisible, options, onOptionChange,children}:any) => {
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const { cacheStatus, setCacheStatus, date, setDate, setLoginModal, loginModal, filterData, setFilterdata } = useAppContext();
  

  const handleOptionSelect = (option:any) => {
    setSelectedOption(option);
    option !== "Cache" && setDropdownVisible(false);    
    onOptionChange(option);
  };

  return (
  
      <Modal
        transparent
        visible={dropdownVisible}
        // animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdown}>
          <View>
          {children}
          </View>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                item === "Cache" ?
                  <TouchableOpacity
                    style={[styles.option, { flexDirection: 'row', alignItems:'center',justifyContent:'space-between' }]}
                    onPress={() => handleOptionSelect(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                    <Image
                      style={{
                        height: 35,
                        width: 35,
                        marginLeft: 3,
                        resizeMode: 'contain', // Use resizeMode instead of objectFit
                      }}
                      source={cacheStatus ? require('../../assets/switch_on.png') : require('../../assets/switch_off.png')}
                    />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleOptionSelect(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
              )
            }}
          />
          </View>
        </TouchableOpacity>
      </Modal>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width:300,
    height:400,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
  },
});

export default DropdownMenu;
