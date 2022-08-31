import {
    View,
    Text,
    Button,
    Image,
    TouchableOpacity,
    ScrollView,
    StatusBar,
  } from "react-native";
  import React, { useRef, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { useNavigation } from "@react-navigation/native";
  import useAuth from "../hooks/useAuth";
  import { OutlinedTextField } from "rn-material-ui-textfield";
  import Toast from "react-native-toast-message";
  
  const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signInUser } = useAuth();
    const navigation = useNavigation();
    const ref_input_password = useRef();
  
    const validation = () => {
      if (email === "") {
        Toast.show({
          type: "error",
          text1: "Email field is empty",
          text2: "Please enter a valid email",
          visibilityTime: 3000,
          position: "bottom",
          bottomOffset: 20,
        });
        return false;
      } else if (password === "") {
        Toast.show({
          type: "error",
          text1: "Password field is empty",
          text2: "Please enter your password",
          visibilityTime: 3000,
          position: "bottom",
          bottomOffset: 20,
        });
        return false;
      } else if (password.length <= 5) {
        Toast.show({
          type: "error",
          text1: "Password is too short",
          text2: "Please enter a valid password",
          visibilityTime: 3000,
          position: "bottom",
          bottomOffset: 20,
        });
        return false;
      }
      return true
    };
  
    return (
      <SafeAreaView style={{ backgroundColor: "white" }} className=" flex-1 ">
        <StatusBar translucent={true} backgroundColor="#005DB9" />
        <ScrollView>
          <View className="p-10">
            <View className="pt-10 items-center">
              <Image
                style={{ height: 250, width: 250 }}
                source={require("../assets/favicon.png")}
              />
            </View>
  
            <View className="pt-14 space-y-4">
              <View>
                <OutlinedTextField
                  tintColor="blue"
                  mode="outlined"
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  onSubmitEditing={() => ref_input_password.current.focus()}
                  blurOnSubmit={false}
                />
              </View>
              <View>
                <OutlinedTextField
                  tintColor="blue"
                  mode="outlined"
                  label="Password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  ref={ref_input_password}
                />
              </View>
            </View>
  
            <View className="items-end pt-4">
              <View className="flex-row">
                <Text className="text-sm">Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Text className="text-sm font-bold text-cyan-600">
                    Register Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
  
            <View className="pt-14">
              <Button
                color="#005DB9"
                title="Login"
                onPress={() => {
                  if (validation()) {
                    signInUser(email, password);
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default LoginScreen;
  