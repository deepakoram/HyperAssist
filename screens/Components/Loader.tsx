import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <View style={{height:'100%',justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" color="#8F49DE"/>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})