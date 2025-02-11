import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

interface TooltipProps {
  text: string; // The text displayed inside the tooltip
  children: React.ReactNode; // The component the tooltip is attached to
  tooltipStyle?: object; // Custom styles for the tooltip
  textStyle?: object; // Custom styles for the tooltip text
  placement?: 'top' | 'bottom'; // Tooltip placement relative to the child
}

const ToolTip: React.FC<TooltipProps> = ({
  text,
  children,
  tooltipStyle,
  textStyle,
  placement = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleTooltip = (event: GestureResponderEvent) => {
    setIsVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Child element */}
      <TouchableOpacity onPress={toggleTooltip} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>

      {/* Tooltip */}
      {isVisible && (
        <View
          style={[
            styles.tooltip,
            tooltipStyle,
            placement === 'top' ? styles.tooltipTop : styles.tooltipBottom,
          ]}
        >
          <Text style={[styles.tooltipText, textStyle]}>{text}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 4,
    maxWidth: 200,
    zIndex: 10,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },
  tooltipTop: {
    bottom: '120%', // Adjust to position above
  },
  tooltipBottom: {
    top: '120%', // Adjust to position below
  },
});

export default ToolTip;
