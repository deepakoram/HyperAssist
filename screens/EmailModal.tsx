import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image
} from "react-native";

// Define the props for the EmailModal

const EmailModal = () => {
  return (
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={{ marginTop: 16, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ width: 32, height: 32, resizeMode: 'contain' }} source={require('./../assets/star-logo2.png')} />
            <Text style={{ color: '#454545', fontWeight: '600', fontSize: 16, lineHeight: 19, marginLeft: 5 }}>Mimir Email Draft</Text>
          </View>
          <Text style={{ fontWeight: 500, fontSize: 16, lineHeight: 19, color: '#939393' }}>Change</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>
            Refund not processed as well as ARN not generated
          </Text>
          <Text style={styles.subtitle}>#575109 • 12 Oct, 12:24</Text>
        </View>

        {/* Email Content */}

        <Text style={styles.label}>
          To: <Text style={styles.value}>someone@razorpay.com</Text>
        </Text>
        <Text style={styles.label}>
          Subject:{" "}
          <Text style={styles.value}>
            Unresolved Refund and ARN Generation Issue - Urgent
            Attention Required
          </Text>
        </Text>
        <View style={styles.hr} />

        <ScrollView style={styles.body}>
          <Text style={styles.text}>Dear Razorpay Support Team,</Text>
          <Text style={styles.text}>
            I am writing to report an urgent issue with a recent
            transaction where:
          </Text>
          <Text style={styles.text}>
            • Refund has not been processed{"\n"}• Acquisition Reference
            Number (ARN) has not been generated
          </Text>

          <Text style={styles.text}>Transaction Details:</Text>
          <Text style={styles.text}>
            Please investigate and resolve these discrepancies at the
            earliest. Kindly provide:
          </Text>
        </ScrollView>

        {/* Action Button */}
        <View style={styles.button}>
        <TouchableOpacity >
          <Text style={styles.buttonText}>Send Email to PG</Text>
        </TouchableOpacity>

        </View>
      </View>
  );
};

const styles = StyleSheet.create({

  modalContainer: {
    flex:1,
    backgroundColor: "#FFFFFF",
    // backgroundColor: "red",
    borderRadius: 8,
    width: "100%",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
  },
  body: {
    marginBottom: 16,
    flex:1,
    // backgroundColor:'yellow'
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 19,
    color: '#454545',
    marginBottom: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 19,
    color: '#797979',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 8,
    color: "#5F5F5F",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#8F49DE",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 16,
    height:48
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  hr: {
    height: 1,  // Thickness of the line
    backgroundColor: '#D9D9D9',  // Color of the line
    marginBottom: 24,
    marginTop: 12  // Optional margin to give space above and below the line
  },
});

export default EmailModal