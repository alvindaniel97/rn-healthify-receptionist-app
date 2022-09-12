import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { OutlinedTextField } from "rn-material-ui-textfield";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment/moment";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddAppointment = ({ navigation }) => {
  const [patientIC, setPatientIC] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [userDetails, setUserDetails] = useState({});

  const { user } = useAuth();

  //console.log("user", userDetails)

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [errorText, setErrorText] = useState({});

  useEffect(() => {
    getUserDetails();
    //console.log("in useEffect")
  }, []);

  const getUserDetails = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem("userDetails");
      if (jsonValue != null) {
        const userData = await JSON.parse(jsonValue);
        //console.log(userData, "haha")
        setUserDetails(userData);
      } else {
        //console.log("here")
        setUserDetails(null);
      }
    } catch (e) {
      // error reading value
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleSetDate = (value) => {
    let date = moment(value).format("MMMM Do YYYY");
    //console.log("date: ", moment(value).format('MMMM Do YYYY, h:mm:ss a'))
    //console.log("date: ", value.toString())
    setDate(date);
    setErrorText((prev) => {
      return { ...prev, date: null };
    });
    hideDatePicker();
  };

  const handleSetTime = (value) => {
    let time = moment(value).format("h:mm a");
    //console.log("date: ", moment(value).format('MMMM Do YYYY, h:mm:ss a'))
    //console.log("date: ", value.toString())
    setTime(time);
    setErrorText((prev) => {
      return { ...prev, time: null };
    });
    hideTimePicker();
  };

  const addAppointment = async () => {
    if (validation()) {
      if (userDetails != null) {
        //add data to firebase
        //console.log("ud", userDetails)
        await addDoc(collection(firestore, "appointments"), {
          patientIC: patientIC,
          date: date,
          time: time,
          agenda: agenda,
          initiatorId: user.uid,
          hospitalName: userDetails.hospitalName,
          dateTimeCreated: serverTimestamp(),
        })
          .then(() => {
            console.log("success");
            navigation.goBack();
          })
          .catch((err) => {
            console.log("error: ", err);
          });
      } else {
        console.log("userDetails is null");
      }
    }
  };

  const validation = () => {
    let validation = true;
    if (patientIC == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, patientIC: "Patient's IC Number is required" };
      });
    }

    if (date == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, date: "Please select date" };
      });
    }

    if (time == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, time: "Please select time" };
      });
    }

    if (agenda == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, agenda: "Please enter an agenda" };
      });
    }

    if (validation) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View className="p-2 flex-1">
      <View>
        <View className="flex-row items-center justify-between pt-2 pb-2">
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={40} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Add A New Appointment</Text>
          <View></View>
        </View>
      </View>
      <ScrollView nestedScrollEnabled={true}>
        <View className="p-2 space-y-2">
          <View>
            <OutlinedTextField
              containerStyle={{ top: 4 }}
              tintColor="green"
              mode="outlined"
              label="Patient's IC Number"
              keyboardType="default"
              value={patientIC}
              onChangeText={(text) => {
                setPatientIC(text);
                setErrorText((prev) => {
                  return { ...prev, patientIC: null };
                });
              }}
              error={errorText?.patientIC}
            />
          </View>

          <View className="flex-row space-x-2 justify-center items-center">
            <View className="flex-1">
              <OutlinedTextField
                disabled={true}
                containerStyle={{ top: 4 }}
                tintColor="green"
                mode="outlined"
                label="Select Date"
                keyboardType="default"
                value={date}
                onChangeText={(text) => {
                  setDate(text);
                  setErrorText((prev) => {
                    return { ...prev, date: null };
                  });
                }}
                error={errorText?.date}
              />
            </View>
            <View>
              <TouchableOpacity
                className="bg-[#007500] rounded-md"
                onPress={showDatePicker}
              >
                <View className=" flex-1 text-lg font-bold justify-center items-center p-1">
                  <MaterialIcons name="date-range" size={36} color="white" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleSetDate}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <View className="flex-row space-x-2 justify-center items-center">
            <View className="flex-1">
              <OutlinedTextField
                disabled={true}
                containerStyle={{ top: 4 }}
                tintColor="green"
                mode="outlined"
                label="Select Time"
                keyboardType="default"
                value={time}
                onChangeText={(text) => {
                  setTime(text);
                  setErrorText((prev) => {
                    return { ...prev, time: null };
                  });
                }}
                error={errorText?.time}
              />
            </View>
            <View>
              <TouchableOpacity
                className="bg-[#007500] rounded-md"
                onPress={showTimePicker}
              >
                <View className=" flex-1 text-lg font-bold justify-center items-center p-1">
                  <MaterialIcons name="access-time" size={36} color="white" />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleSetTime}
                onCancel={hideTimePicker}
              />
            </View>
          </View>
          <View>
            <OutlinedTextField
              containerStyle={{ top: 4 }}
              tintColor="green"
              mode="outlined"
              label="Agenda"
              keyboardType="default"
              value={agenda}
              onChangeText={(text) => {
                setAgenda(text);
                setErrorText((prev) => {
                  return { ...prev, agenda: null };
                });
              }}
              error={errorText?.agenda}
            />
          </View>
        </View>
        <TouchableOpacity
          className="bg-[#007500] rounded-md p-2 m-8"
          onPress={addAppointment}
        >
          <Text className="text-lg font-bold self-center text-white">
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddAppointment;
