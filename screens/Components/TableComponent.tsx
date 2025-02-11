import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert
} from 'react-native';
import { sortData } from '../Helpers/hepler';
import SearchInput from "./SearchInput";


const TableComponent = ({ headers, data, onSelectRow }: any) => {
    const [tableData, setTableData] = useState([...data])
    const [searchText, setSearchText] = useState<any>("")
    const [ascending, setAscending] = useState(true);


    // Render each row dynamically

    const inputHandle = (text: any) => {
        setSearchText(text);
        if (searchText.length === 0) {
        }
        if (searchText.length > 3) {
            const filtered = data.filter((item: any) =>
                item[0].toLowerCase().includes(text.toLowerCase()) // Match on email
            );
        }
        // setFilteredData(filtered);
    };
    const searchHandle = () => {
        let validTable = tableData?.map((item)=>item[0])
        if(validTable.length>0){
            const filtered = tableData?.filter((item: any) =>
                item[0]?.toLowerCase().includes(searchText?.toLowerCase()) 
            );
            setTableData([...filtered])
        }else{
            Alert.alert("No data present")
        }
    };
    const renderItem = ({ item, index }: any) => (
        <View style={[styles.row, { backgroundColor: `${index % 2 === 0 ? "none" : '#EDEDED'}` }]} >
            {item?.slice(1)?.map((cell: any, index: any) => (
                index === 0 ?
                    <TouchableOpacity onPress={() => onSelectRow(item)}>
                        <Text key={index} style={styles.cell}>
                            {cell !== null ? cell : '-'}
                        </Text>
                    </TouchableOpacity> :
                    <Text key={index} style={styles.cell}>
                        {cell !== null ? cell : '-'}
                    </Text>
            ))}
        </View>
    );
    const renderItemHead = ({ item, index }: any) => (
        <View style={[styles.row, { backgroundColor: `${index % 2 === 0 ? "none" : '#EDEDED'}` }]} >
            {[item[0]]?.map((cell: any, index: any) => (
                index === 0 ?
                    <TouchableOpacity onPress={() => onSelectRow(item)}>
                        <Text key={index} style={styles.cell}>
                            {cell !== null ? cell : '-'}
                        </Text>
                    </TouchableOpacity> :
                    <Text key={index} style={styles.cell}>
                        {cell !== null ? cell : '-'}
                    </Text>
            ))}
        </View>
    );
    return (
        <View style={styles.container}>
            <SearchInput
                placeholder="Search for items"
                onChangeText={(text: any) => {
                    inputHandle(text)
                    if (text.length === 0) {
                        setTableData([...data])
                    }
                }}
                value={searchText}
                style={{ backgroundColor:'#fff' }}
                inputStyle={{ color: "#333" }}
                placeholderTextColor="#aaa"
                handleSubmit={searchHandle}
            />
            <View style={{ flex:1}}>
            <ScrollView >
                <View style={{flexDirection:'row'}}>
                <View>
                        <View style={styles.header}>
                            {[headers[0]]?.map((header: any, index: any) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setAscending(prev => !prev)
                                        setTableData(sortData(data, 0, { direction: ascending ? "asc" : "desc" }))
                                    }}
                                    style={{padding:5, flexDirection: 'row', alignItems: 'center', width: 100,height:40, justifyContent: 'space-between', borderRightColor: '#EDEDED', borderRightWidth: 1 }}
                                >
                                    <Text key={index} style={styles.headerCell}>
                                        {header}
                                    </Text>
                                    <Image style={{ height: 18, width: 18, objectFit: 'contain' }} source={require('../../assets/sort_both_new.png')} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Table Body */}
                        {/* <FlatList
                            data={tableData}
                            renderItem={renderItemHead}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.tableBody}
                        /> */}
                        {tableData?.map((item, index) => <View style={[styles.row, { backgroundColor: `${index % 2 === 0 ? "none" : '#EDEDED'}` }]} >
                            {[item[0]]?.map((cell: any, index: any) => (
                                index === 0 ?
                                    <TouchableOpacity onPress={() => onSelectRow(item)}>
                                        <Text key={index} style={styles.cell}>
                                            {cell !== null ? cell : '-'}
                                        </Text>
                                    </TouchableOpacity> :
                                    <Text key={index} style={styles.cell}>
                                        {cell !== null ? cell : '-'}
                                    </Text>
                            ))}
                        </View>)}
                    </View>
                <ScrollView horizontal>
                    {/* Sticky Header */}
                    <View>
                        <View style={styles.header}>
                            {headers?.slice(1)?.map((header: any, index: any) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setAscending(prev => !prev)
                                        setTableData(sortData(data, index+1, { direction: ascending ? "asc" : "desc" }))
                                    }}
                                    style={{padding:5,flexDirection: 'row', alignItems: 'center', width: 100,height:40, justifyContent: 'space-between', borderRightColor: '#EDEDED', borderRightWidth: 1 }}
                                >
                                    <Text key={index} style={[styles.headerCell,{flexShrink: 1, flexWrap: 'wrap'}]}>
                                        {header}
                                    </Text>
                                    <Image style={{ height: 18, width: 18, objectFit: 'contain' }} source={require('../../assets/sort_both_new.png')} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Table Body */}
                        {/* <FlatList
                            data={tableData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.tableBody}
                        /> */}
                        {tableData?.map((item, index) => <View style={[styles.row, { backgroundColor: `${index % 2 === 0 ? "none" : '#EDEDED'}` }]} >
                            {item?.slice(1)?.map((cell: any, index: any) => (
                                index === 0 ?
                                    <TouchableOpacity onPress={() => onSelectRow(item)}>
                                        <Text key={index} style={styles.cell}>
                                            {cell !== null ? cell : '-'}
                                        </Text>
                                    </TouchableOpacity> :
                                    <Text key={index} style={styles.cell}>
                                        {cell !== null ? cell : '-'}
                                    </Text>
                            ))}
                        </View>)}
                    </View>
                
                </ScrollView>
                </View>
            </ScrollView>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    table: {
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    headerCell: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 10,
        justifyContent:'center',
        alignItems:'center'
    },
    tableBody: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED',
        backgroundColor: '#FFFFFF',
        height:50,
    },
    cell: {
        padding: 10,
        width: 100,
        textAlign: 'center',
        fontSize: 10,
        
        justifyContent:'center',
        alignItems:'center'
    },
});

export default TableComponent;
