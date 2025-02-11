import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Colors } from '../Helpers/colors'

const LoginThemeScreen = ({ children, subTitle="" }: any) => {
  return (
    <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={styles.logo} source={require('../../assets/ticket-token-one.png')} />
          <Text style={styles.logoText}>SuperFast</Text>
        </View>
        {/* <View style={{marginBottom:32}}>
          <Text style={styles.subHeading}>{subTitle}</Text>
        </View> */}
        <View style={{flex:1, justifyContent:'space-between'}}>
          {children}
        </View>
    </View>
  )
}

export default LoginThemeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.blackBackground,
    // backgroundColor: 'white',
    padding: 32,
    // justifyContent:'space-between'
  },
  logo: {
    height: 20,
    width: 20,
    marginRight: 6
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
    color: '#FFFFFF'
  },
  subHeading:{
    color:'#FCFCFC',
    fontSize:18,
    fontWeight:'500'
  }
})