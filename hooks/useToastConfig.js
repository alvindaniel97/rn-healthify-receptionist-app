import { BaseToast } from "react-native-toast-message";
import { useColorScheme } from "react-native";

export default function useToastConfig() {
  let colorScheme = useColorScheme();
  if (colorScheme === "dark") {
    const colorStyle = {
      success: (props) => (
        <BaseToast
          {...props}
          style={{ borderLeftColor: "green" }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          // text1Style={{
          //   fontSize: 16,
          //   fontWeight: "800",
          // }}
        />
      ),
    };
    return colorStyle;
  } else {
    const colorStyle = {
      success: (props) => (
        <BaseToast
          {...props}
          style={{ borderLeftColor: "blue" }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          // text1Style={{
          //   fontSize: 15,
          //   fontWeight: "400",
          // }}
        />
      ),
    };
    return colorStyle;
  }
}
