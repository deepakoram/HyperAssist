import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Colors } from '../Helpers/colors'

const Input = ({placeholder,onChangeText}:any) => {
  return (
    <View>
      <TextInput 
      placeholderTextColor="#797979" 
      style={styles.inputStyle} 
      placeholder={placeholder} 
      onChangeText={(e)=>onChangeText(e)}
      autoComplete="off"
      autoCorrect={false} 
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    inputStyle:{
        backgroundColor:Colors.inputBackground,
        borderRadius:8,
        paddingVertical:11,
        paddingHorizontal:14,
        color:'#fff'
    }
})