import { StyleSheet, Text, View } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DonorPreferences, UpdateRpStatus } from "@screens";
import { AuthRoutes } from "@types";

const UpdateRpStatusNavigation = () => {
  const Stack = createNativeStackNavigator<AuthRoutes>();

  return (
    <Stack.Navigator initialRouteName="updatedRpStatus">
      <Stack.Screen
        options={{ headerShown: false }}
        name="updatedRpStatus"
        component={UpdateRpStatus}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="donorPreferences"
        component={DonorPreferences}
      />
    </Stack.Navigator>
  );
};

export default UpdateRpStatusNavigation;

const styles = StyleSheet.create({});
