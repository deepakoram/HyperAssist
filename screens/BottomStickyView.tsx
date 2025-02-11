import { useNavigation,NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
type RootParamList = {
    Home: undefined;
    Details: undefined;
  };
const StickyBottomView = () => {
const navigation = useNavigation<NavigationProp<RootParamList>>();    return (
        <View style={styles.stickyBottomView}>
            <TouchableWithoutFeedback onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })}>
                <View style={{ flexDirection: 'column', alignItems: 'center', height: 39, width: 39 }}>
                    <Image style={styles.icon} source={require('./../assets/piechart-01.png')} />
                    <Text style={styles.stickyText}>Analytics</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }, { name: 'Details' }],
            })}>
                <View style={{ flexDirection: 'column', alignItems: 'center', height: 39, width: 39 }} >
                    <Image style={styles.icon} source={require('./../assets/vector.png')} />
                    <Text style={styles.stickyText}>Tickets</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        height: 24,
        width: 24,
        objectFit:'contain'
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 20, // Adjust this to suit your layout
    },
    stickyBottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 15,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 91,
        flexDirection: 'row',
        borderTopColor:'#E1E1E1',
        borderTopWidth:1
    },
    stickyText: {
        fontSize: 9,
        width:70,
        fontFamily: 'Inter Display',
        color: '#808080',
        textAlign: 'center',
    },
});

export default StickyBottomView;
