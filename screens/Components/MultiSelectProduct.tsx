import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image
} from 'react-native';
interface Option {
    id: number;
    name: string;
  }
const MultiSelectProduct: React.FC = ({data,selectedItems, setSelectedItems}:any) => {
    // const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const toggleSelect = (id: any) => {
        setSelectedItems((prev:any) =>
            prev.includes(id) ? prev.filter((item:any) => item !== id) : [...prev, id]
        );
    };
    const renderItem = ({ item }: { item: Option }) => {
        const isSelected = selectedItems.includes(item.id);
        return (
            <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => toggleSelect(item.id)}
                activeOpacity={0.7}
            >
                <Text style={styles.optionText}>{item.name}</Text>

                <Image
                    style={{
                        height: 14,
                        width: 14,
                        marginLeft: 3,
                        resizeMode: 'contain',
                    }}
                    source={isSelected ? require('../../assets/checked.png') : require('../../assets/unchecked.png')}
                />
            </TouchableOpacity>
        );
    };

    return (

        <FlatList
            data={data}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={renderItem}
            extraData={selectedItems}
            style={styles.flatList}
        />

    );
};

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2D2D2D',
    },
    optionText: {
        color: '#FFF',
        fontSize: 16,
    },
    flatList: {
        // height: 300,
       
      },
});

export default MultiSelectProduct;
