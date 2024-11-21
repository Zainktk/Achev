import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChangeEmail, ChangeEmailOtp } from "@screens";
import { AuthRoutes } from "@types";
import { StyleSheet } from "react-native";

const ChangeEmailNavigation = () => {
  const Stack = createNativeStackNavigator<AuthRoutes>();

  return (
    <Stack.Navigator initialRouteName="changeEmail">
      <Stack.Screen
        options={{ headerShown: false }}
        name="changeEmail"
        component={ChangeEmail}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="changeEmailOtp"
        component={ChangeEmailOtp}
      />

      {/* <Stack.Screen options={{ headerShown: false }} name="RPSubCatogaries" /> */}
    </Stack.Navigator>
  );
};

export default ChangeEmailNavigation;

const styles = StyleSheet.create({});
