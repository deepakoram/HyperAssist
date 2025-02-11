import React from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

const data = [
  { value: 20, label: '13 Mar' },
  { value: 45, label: '' },
  { value: 28, label: '' },
  { value: 80, label: '17 Mar' },
  { value: 71, label: '' },
  { value: 43, label: '' },
  { value: 50, label: '21 Mar' },
  { value: 65, label: '' },
  { value: 60, label: '' },
  { value: 30, label: '25 Mar' },
  { value: 50, label: '21 Mar' },
  { value: 65, label: '' },
  { value: 60, label: '' },
  { value: 30, label: '25 Mar' },
  { value: 50, label: '21 Mar' },
  { value: 65, label: '' },
  { value: 60, label: '' },
  { value: 30, label: '25 Mar' },
];

const CustomBarChart = ({barWidth,barMargin,chartHeight}:any) => {


  // Find the max value to scale the bars
  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = data.length * (barWidth + barMargin);

  return (
    <View style={styles.chartContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: chartWidth > screenWidth ? chartWidth : screenWidth }}
      >
        <View>
          <Svg height={chartHeight} width={chartWidth}>
            {data.map((item, index) => {
              const scaledHeight = (item.value / maxValue) * chartHeight;
              return (
                <Rect
                  key={index}
                  x={index * (barWidth + barMargin)}
                  y={chartHeight - scaledHeight}
                  width={barWidth}
                  height={scaledHeight}
                  rx={5}
                  fill="#8F49DE"
                />
              );
            })}
          </Svg>
          <View style={styles.labelContainer}>
            {data.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.labelText,
                ]}
              >
                {item.label}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
    
  },
  labelContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  labelText: {
    fontSize: 10,
    color: 'gray',
  },
});

export default CustomBarChart;
