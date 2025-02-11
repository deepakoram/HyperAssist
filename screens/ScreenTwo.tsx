import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';


const ScreenTwo = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingVertical: 24, paddingHorizontal: 16, justifyContent: 'space-between', height: 180 }}>
        <Text style={styles.text}>Refund not processed as well as ARN not generated</Text>
        <Text style={styles.textTwo}>Refund not processed as well as ARN not generated</Text>
        <Text style={styles.textTwo}>Assigned to:</Text>
        <Text style={styles.textTwo}>View More</Text>
      </View>
      <Button title="Send Mail" onPress={toggleModal} />
      <View style={{ flex: 1 }}></View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <EmailView toggleModal={toggleModal} />
      </Modal>
    </View>
  );
};

const EmailView = ({ toggleModal }: { toggleModal: () => void }) => {
  return (
    <View style={styles.modalBackground}>
      <TouchableOpacity style={styles.modalContainer} onPress={toggleModal}>
      </TouchableOpacity>
      <View style={styles.modalContent}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1, flexDirection:'row'}}>
            <Image style={styles.icon} source={require('./../assets/staroflife.png')} />
            <Text style={styles.textPopup}>Mimir Email Draft</Text>
          </View>
          <View style={{flex:1, alignItems:'flex-end',justifyContent:'center'}}>
            <Text>Change</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
    height:32,
    width:32
  },
  text: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333333',
    fontFamily: 'Inter Display'
  },
  textPopup: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333333',
    fontFamily: 'Inter Display',
    flex:1,
    textAlignVertical: 'center'
  },
  textTwo: {
    fontSize: 13,
    color: '#939393',
    fontWeight: 500,
    fontFamily: 'Inter Display'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: "100%",
    height: "75%",
    padding: 24,
    backgroundColor: 'white',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default ScreenTwo;
