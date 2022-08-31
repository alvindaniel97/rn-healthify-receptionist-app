import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from "@react-navigation/drawer";
  import React from "react";
  import useAuth from "./hooks/useAuth";
  import HomeScreen from "./screens/HomeScreen";
  import ProfileScreen from "./screens/ProfileScreen";
  
  const Drawer = createDrawerNavigator();
  
  const DrawerNavigator = () => {
    const { logoutUser } = useAuth();
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: "orange",
          drawerStyle: {
            width: 240,
          },
        }}
        useLegacyImplementation
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem label="Logout" onPress={logoutUser} />
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    );
  };
  
  export default DrawerNavigator;
  