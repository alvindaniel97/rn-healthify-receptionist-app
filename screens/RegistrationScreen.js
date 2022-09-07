import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { OutlinedTextField } from "rn-material-ui-textfield";
import { ScrollView } from "react-native-gesture-handler";

const RegistrationScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [icNo, setIcNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const ref_input_last_name = useRef();
  const ref_input_email = useRef();
  const ref_input_ic_no = useRef();
  const ref_input_password = useRef();
  const navigation = useNavigation();
  const { registerUser } = useAuth();
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [startCamera, setStartCamera] = useState(false);
  const [errorText, setErrorText] = useState({});
  let cameraRef = useRef();

  let chooseFromGallery = async () => {
    setMenuVisibility(false);
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  const openCamera = async () => {
    setMenuVisibility(false);
    let cameraPermission = await Camera.requestCameraPermissionsAsync();

    if (cameraPermission.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }
    setStartCamera(true);
  };

  let captureImage = async () => {
    let newPhoto = await cameraRef.current.takePictureAsync(null);
    setStartCamera(false);
    setSelectedImage({ localUri: newPhoto.uri });
  };

  const validation = () => {
    let validation = true;
    if (firstName == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, firstName: "Please enter a valid first name" };
      });
    }
    if (lastName == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, lastName: "Please enter a valid last name" };
      });
    }
    if (icNo == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, icNo: "Please enter a valid IC number" };
      });
    } else if (icNo.length <= 13) {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, icNo: "IC number must be more than 13 characters" };
      });
    }
    if (email == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, email: "Please enter a valid email" };
      });
    }

    if (password == "") {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, password: "Please enter your password" };
      });
    } else if (password.length <= 5) {
      validation = false;
      setErrorText((prev) => {
        return { ...prev, password: "Password must be more than 5 characters" };
      });
    }

    if (validation) {
      return true;
    } else {
      return false;
    }
  };

  if (startCamera) {
    return (
      <Camera style={{ flex: 1, width: "100%" }} ref={cameraRef}>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            flex: 1,
            width: "100%",
            padding: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              flex: 1,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={captureImage}
              style={{
                width: 70,
                height: 70,
                bottom: 0,
                borderRadius: 50,
                backgroundColor: "#fff",
              }}
            />
          </View>
        </View>
        <StatusBar style="auto" />
      </Camera>
    );
  }

  return (
    <SafeAreaView className="p-2 bg-white flex-1">
      <StatusBar translucent={true} backgroundColor="#00A300" />
      <View>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={40} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Register Now</Text>
          <View></View>
        </View>
      </View>
      <ScrollView>
        <View className="p-2 pt-10 space-y-5">
          <View className="flex-row space-x-4">
            <View className="flex-1 w-full">
              <OutlinedTextField
                tintColor="green"
                mode="outlined"
                label="First Name"
                keyboardType="default"
                returnKeyType="next"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setErrorText((prev) => {
                    return { ...prev, firstName: null };
                  });
                }}
                error={errorText?.firstName}
                onSubmitEditing={() => ref_input_last_name.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View className="flex-1 w-full">
              <OutlinedTextField
                mode="outlined"
                tintColor="green"
                label="Last Name"
                keyboardType="default"
                returnKeyType="next"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setErrorText((prev) => {
                    return { ...prev, lastName: null };
                  });
                }}
                error={errorText?.lastName}
                ref={ref_input_last_name}
                onSubmitEditing={() => ref_input_ic_no.current.focus()}
                blurOnSubmit={false}
              />
            </View>
          </View>
          <View className="flex-1 w-full">
            <OutlinedTextField
              tintColor="green"
              mode="outlined"
              label="IC Number"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              value={icNo}
              onChangeText={(text) => {
                setIcNo(text);
                setErrorText((prev) => {
                  return { ...prev, icNo: null };
                });
              }}
              error={errorText?.icNo}
              ref={ref_input_ic_no}
              onSubmitEditing={() => ref_input_email.current.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View className="flex-1 w-full">
            <OutlinedTextField
              tintColor="green"
              mode="outlined"
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorText((prev) => {
                  return { ...prev, email: null };
                });
              }}
              error={errorText?.email}
              ref={ref_input_email}
              onSubmitEditing={() => ref_input_password.current.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View className="flex-1 w-full">
            <OutlinedTextField
              tintColor="green"
              mode="outlined"
              label="Password"
              autoCapitalize="none"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorText((prev) => {
                  return { ...prev, password: null };
                });
              }}
              error={errorText?.password}
              ref={ref_input_password}
            />
          </View>
          <View>
            <View className="relative">
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage.localUri }}
                  style={styles.logo}
                  className="rounded-full self-center"
                />
              ) : (
                <Image
                  source={require("../assets/profile_picture.png")}
                  style={styles.logo}
                  className="rounded-full self-center"
                />
              )}
              <View className="absolute bottom-4 right-20">
                <Menu
                  visible={menuVisibility}
                  anchor={
                    <TouchableOpacity
                      className="aspect-square rounded-full bg-green-600 items-center"
                      onPress={() => setMenuVisibility(true)}
                    >
                      <MaterialIcons name="add" size={50} color="white" />
                    </TouchableOpacity>
                  }
                  onRequestClose={() => setMenuVisibility(false)}
                >
                  <MenuItem onPress={chooseFromGallery}>
                    Choose From Gallery
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={openCamera}>Take A Picture</MenuItem>
                </Menu>
              </View>
            </View>
          </View>
          <View className="pt-6">
            <Button
              color="#00A300"
              title="Register"
              onPress={() => {
                if (validation()) {
                  registerUser(
                    firstName,
                    lastName,
                    icNo,
                    email,
                    password,
                    selectedImage,
                    navigation
                  );
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 240,
    height: 240,
  },
});

export default RegistrationScreen;
