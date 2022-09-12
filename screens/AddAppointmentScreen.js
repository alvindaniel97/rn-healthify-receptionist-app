import { View, Text, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AddAppointment from "../components/newAppointment/AddAppointment";

const AddAppointmentScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar translucent={true} />
      <AddAppointment navigation={navigation} />
    </SafeAreaView>
  );
};

export default AddAppointmentScreen;
