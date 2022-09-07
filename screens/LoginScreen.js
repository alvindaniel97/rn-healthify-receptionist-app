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

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInUser } = useAuth();
  const navigation = useNavigation();
  const ref_input_password = useRef();
  const [errorText, setErrorText] = useState({});

  const validation = () => {
    let validation = true;
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

  return (
    <SafeAreaView style={{ backgroundColor: "white" }} className=" flex-1 ">
      <StatusBar translucent={true} backgroundColor="#00A300" />
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
                onSubmitEditing={() => ref_input_password.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View>
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
              color="#00A300"
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
