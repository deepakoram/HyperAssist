import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

const RecentTicketsView = () => {
  const items = [];

  // Use a for loop to iterate through the data array
  for (let i = 0; i < 3; i++) {
    items.push(
      <CreateChildren text={"PG charges mobility issue troubleshoot"} status={"Open"}/>
    );
  }
  return (
    <View style={{ height: 420, paddingHorizontal: 24, paddingVertical: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={styles.leftText}>Recent Tickets</Text>
        {/* <Text style={styles.rightText}>View All</Text> */}
      </View>
      <View>{items}</View>
    </View>
  );
};

const CreateChildren = ({ text, status }: { text: string, status: string }) => {
  const navigation = useNavigation();
  return <>
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Details')}>
      <View style={{ height: 104, borderWidth: 1, borderColor: '#EDEDED', borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFFFFF', padding: 16, justifyContent: 'space-between' }}>
        <Text>{status}</Text>
        <Text style={{ height: 18, color: '#454545', fontFamily: 'Inter Display', fontWeight: '500' }}>{text}</Text>
        <Text>A</Text>
      </View>
    </TouchableWithoutFeedback>
  </>
}

const styles = StyleSheet.create({
  leftText: {
    fontFamily: 'Inter Display',
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2B2B'
  },
  rightText: {
    fontFamily: 'Inter Display',
    fontSize: 14,
    fontWeight: '500',
    color: '#797979',
  }
})

export default RecentTicketsView;