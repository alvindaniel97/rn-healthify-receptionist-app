import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const Header = ({ navigation, userDetails }) => {
  return (
    <View className="flex-row p-2 items-center mx-2 space-x-2 justify-between">
      <View>
        <Text className="text-lg font-bold text-white">Welcome Back</Text>
        <Text className="text-base font-semibold text-white">
          {userDetails.firstName} {userDetails.lastName}
        </Text>
      </View>

      {userDetails.profilePicture !== null ? (
        <>
          <TouchableOpacity
            className="border-solid border-2 border-white rounded-full"
            onPress={() =>
              navigation.push("ProfileScreen", { screen: "Profile" })
            }
          >
            <Image
              className="h-12 w-12 bg-gray-300 p-4 rounded-full "
              source={{ uri: userDetails.profilePicture }}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            className="h-12 w-12 bg-[#BFD7ED] rounded-full justify-center"
            onPress={() =>
              navigation.push("ProfileScreen", { screen: "Profile" })
            }
          >
            <Text className="text-lg font-bold self-center text-black">
              {userDetails?.firstName.charAt(0)}
              {userDetails?.lastName.charAt(0)}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Header;
