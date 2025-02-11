import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const HeaderBar = ({onClick}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ flexDirection: 'row', padding: 10 }} onPress={() => navigation.goBack()}>
        <Image style={{ width: 16, height: 16, resizeMode: 'contain' }} source={require('../../assets/arrow-left.png')} />
        <Text style={{ fontWeight: '600', fontSize: 14, lineHeight: 17, color: '#5F5F5F', marginLeft: 7 }}>Table</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ flexDirection: 'row', padding: 10 }} onPress={onClick}>
        <Image style={{ width: 16, height: 16, resizeMode: 'contain' }} source={require('../../assets/setting.png')} />
      </TouchableOpacity>
    </View>
  )
}

export default HeaderBar

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: '#fff',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between'
  }
})