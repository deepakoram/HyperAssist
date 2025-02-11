import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../Helpers/colors';

type TeamOption = {
  id: string;
  label: string;
};

const teamOptions: TeamOption[] = [
  { id: 'all', label: 'All' },
  { id: 'sdk', label: 'SDK' },
  { id: 'hypercheckout', label: 'HyperCheckout' },
  { id: 'credit', label: 'Credit' },
  { id: 'refunds1', label: 'Refunds' },
  { id: 'hypercheckout2', label: 'HyperCheckout' },
  { id: 'sdk2', label: 'SDK' },
  { id: 'refunds2', label: 'Refunds' },
  { id: 'credit2', label: 'Credit' },
];

const MultiSelect = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {teamOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.button,
              selectedItems.includes(option.id) && styles.selectedButton,
            ]}
            onPress={() => toggleSelection(option.id)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedItems.includes(option.id) && styles.selectedButtonText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap:12
  },
  button: {
    backgroundColor: Colors.inputBackground,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor:Colors.inputBackground,
    borderWidth:1
  },
  buttonText: {
    color: '#F2F2F2',
    fontSize: 14,
    fontWeight:600,
  },
  selectedButton: {
    backgroundColor: '#331F4D',
    borderColor:'#8F49DE',
    borderWidth:1
  },
  selectedButtonText: {
    color: '#F2F2F2',
  },
});

export default MultiSelect;
