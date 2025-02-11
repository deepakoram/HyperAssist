import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {StatusBar} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useAppContext } from './Context/AppContext';
import Loader from './Components/Loader';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
let statusBarHeight = StatusBar.currentHeight || 0;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

type BottomSheetProps = {
  children?: React.ReactNode;
  response?: any
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

let flag: any = 0;
let fetchInterval: any;

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, response }, ref) => {
    const { date, setDate,isLoading, setIsLoading } = useAppContext();


    const navigation = useNavigation();
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const animatedWidth = useSharedValue(48);
    const [ticketsData, setTicketsData] = useState([]);
    const [eventTracker, setEventTracker] = useState(0);
    const stats = [
      { label: 'Active Tickets', value: response?.ticket_level_stats?.active_count, change: '+4.8%' },
      { label: 'Resolution Efficiency Rate', value: parseFloat(response?.ticket_level_stats?.resolution_rate_without_upstream_dependency + "").toFixed(1), change: '+4.8%' },
      { label: 'Closure Rate', value: parseFloat(response?.ticket_level_stats?.closure_rate_within_threshold + "").toFixed(1), change: '+4.8%' },
      { label: 'Tail Response Time', value: "NA", change: '+4.8%' },
      { label: 'Juspay Issues Rate', value: "NA", change: '+4.8%' },
    ];

    const tickets = [
      { status: 'Open', title: 'PG charges mobility issue troubleshoot', id: '#575109', time: '12 Oct, 12:24' },
      { status: 'Resolved', title: 'PG charges mobility issue troubleshoot', id: '#575109', time: '12 Oct, 12:24' },
      { status: 'Open', title: 'PG charges mobility issue troubleshoot', id: '#575109', time: '12 Oct, 12:24' },
      { status: 'Open', title: 'PG charges mobility issue troubleshoot', id: '#575109', time: '12 Oct, 12:24' },
    ];
    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withTiming(destination, { duration: 350 });
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd((event) => {
        runOnJS(setEventTracker)(event.translationY);
        if (event.translationY > 0) {
          if (SCREEN_HEIGHT < 677) {
            scrollTo(-SCREEN_HEIGHT / 1.54);
          } else {
            scrollTo(-SCREEN_HEIGHT / 1.36);
          }
          animatedWidth.value = withTiming(48, { duration: 700 });
        } else {
          scrollTo(MAX_TRANSLATE_Y);
          animatedWidth.value = withTiming(100, { duration: 700 });
        }
      });

    const animatedCardWidthStyle = useAnimatedStyle(() => ({
      width: `${animatedWidth.value}%`,
    }));
    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolate.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        {!response || isLoading ? <Loader/> :
          <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
            <View style={styles.line} />
            {children}
          </Animated.View>}
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    // height: SCREEN_HEIGHT - 96 - statusBarHeight,
    height: "100%",
    // height: 500,
    // flex:1,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  container: {
    height: 'auto',
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    position: 'absolute',
    top: SCREEN_HEIGHT,
  },
  card: {
    height: 130,
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: "space-between"
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tags: {
    backgroundColor: "#09961D1A",
    color: "#09961D",
    padding: 4,
    borderRadius: 5,
    marginLeft: 8
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ticketsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  boxText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
    color: "#5F5F5F"
  },
  fullWidth: {
    width: '100%',
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  open: {
    backgroundColor: '#FDE9CE',
    color: '#C67307',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto'
  },
  resolved: {
    backgroundColor: '#E7F8F0',
    color: '#0E9255',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto'
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
    color: '#454545',
  },
  ticketInfo: {
    fontSize: 13,
    color: '#939393',
    lineHeight: 16,
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  percent: {
    color: '#939393',
    fontSize: 16,
    lineHeight: 17,
    fontWeight: 500
  }
});

export default BottomSheet;