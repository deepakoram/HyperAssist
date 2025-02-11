import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../Helpers/colors'

const CustomButton = ({title='Click',onPress}:any) => {
  return (
    <TouchableOpacity style={styles.container} onPress={()=>onPress()}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    container:{
      marginVertical:16,
      backgroundColor: Colors.purpleTheme,
      height:52,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:16,
    },
    buttonText:{
      color:Colors.white,
      fontSize:16,
      fontWeight:'600',      
    }
})