import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image,SafeAreaView } from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const ModalComponent = ({ modalVisible, onClose, children, crossbuttonVisible=true,title="" }: any) => {
    const hapticOptions = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
    return (
        <View style={ {width: "100%"} }>
        <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={onClose}
            style={{backgroundColor:'black'}}
        >
            {/* <View style={ styles.modalOverlay } onTouchEnd={onClose}>
            </View> */}
            <SafeAreaView style={ styles.modalContainer }>
                {crossbuttonVisible ? 
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',padding:10}}>
                    <Text style={{fontSize:16, fontWeight:600}}>{title}</Text>
                    <TouchableOpacity onPress={()=>{
                        ReactNativeHapticFeedback.trigger("soft", hapticOptions);
                        onClose()
                        }}>
                        <Image style={{ height: 20, width: 20, marginLeft: 3, objectFit: 'contain' }} source={require('../../assets/cross-default.png')} />
                    </TouchableOpacity> 
                </View>
                :null}
                <View style={{overflow: 'scroll',flex:1, width: "100%"}}>
                    {children}
                </View>
            </SafeAreaView>
        </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    openButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    openButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        padding:0,
        overflow: 'hidden',
        height: '100%',
        backgroundColor:"#fff"
    },
    closeButtonText: {
        color: '#fff',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default ModalComponent;
