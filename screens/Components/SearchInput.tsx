import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

const SearchInput = ({
    placeholder = "Search...", // Default placeholder text
    onChangeText = () => { }, // Callback when text changes
    value = "", // Current input value
    style = {}, // Additional container styles
    inputStyle = {}, // Additional input styles
    placeholderTextColor = "#888", // Placeholder text color
    onFocus = () => { }, // Callback when input gains focus
    onBlur = () => { }, // Callback when input loses focus
    keyboardType = "default", // Keyboard type
    handleSubmit = () => { }
}) => {
    return (
        <View style={[styles.container, style, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <TextInput
                style={[inputStyle,{flex:1}]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                onChangeText={onChangeText}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardType={keyboardType}
                autoComplete="off"
                autoCorrect={false} 
            />
            <View>
                <TouchableOpacity onPress={handleSubmit} style={{padding:12}}>
                    <Image style={{ height: 14, width: 14, marginLeft: 3, objectFit: 'contain' }} source={require('../../assets/search_grey.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
   
});

export default SearchInput;
