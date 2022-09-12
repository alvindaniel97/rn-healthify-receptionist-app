import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useAuth from "./hooks/useAuth";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import DrawerNavigator from "./DrawerNavigator";
import AddAppointmentScreen from "./screens/AddAppointmentScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { user, registrationBuffer } = useAuth();
  const screenOptions = {
    headerShown: false,
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {user && !registrationBuffer ? (
        <>
          <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
          <Stack.Screen name="AddAppointmentScreen" component={AddAppointmentScreen} />
          <Stack.Screen name="ProfileScreen" component={DrawerNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegistrationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
