import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{useState} from 'react'
import DatePicker from './DatePicker';

const Filter = () => {
    const[page,setPage] = useState<any>('');
    let options = [{ key: 'Product', value: '' },
    { key: 'Teams', value: 'SDK, Credit  +2',rout:'/' },
    { key: 'Date Range', value: '24 Jan 2024 -> 07 Feb 2024',route:'date_range' }
    ]
    return (
        <View style={styles.container}>
            {page === 'date_range' ? <DatePicker/> :options.map((item) => <TouchableOpacity style={styles.wrapper} onPress={()=>setPage(item.route)}>
                <View style={{flexDirection:'row',justifyContent:'space-between',flex:1}}>
                  <Text style={styles.title}>{item.key}</Text>
                  <Text style={styles.subtitle}>{item.value}</Text>
                </View>
                <Image
                    style={{
                        height: 14,
                        width: 14,
                        marginLeft: 3,
                        resizeMode: 'contain', // Use resizeMode instead of objectFit
                    }}
                    source={require('../../assets/right-arrow.png')}
                />
            </TouchableOpacity>)}
        </View>
    )
}

export default Filter

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red',
        padding: 24,
        // borderBottomColor: 'yellow',
        borderBottomWidth: 5,
    },
    wrapper:{
       flexDirection:'row',
       justifyContent:'space-between',
       paddingVertical:10

    },
    title:{
        fontSize:14,
        fontWeight:'500',
        lineHeight:17,
        color:'#454545'
    },
    subtitle:{
        fontSize:14,
        fontWeight:'500',
        lineHeight:17,
        color:'#939393'
    }
})