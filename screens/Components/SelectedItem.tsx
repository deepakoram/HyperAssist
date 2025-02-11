import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const SelectedItem = ({text,onPress}:any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity onPress={()=>onPress(text)}>
      <Image style={styles.icon} source={require('../../assets/cross-default.png')} />
      </TouchableOpacity>
    </View>
  )
}

export default SelectedItem

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#42048a',
        marginTop:5,
        minWidth:100,
        padding:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius:5,
        alignSelf: 'flex-start',
        marginRight:10
    },
    icon:{
        height: 15, 
        width: 15, 
        marginLeft: 3, 
        objectFit: 'contain',
    },
    text:{
      color:'#fff',
        fontSize:10,
    }
})