import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { ChangePassword, CurrentPassword } from "@screens";
const ChangePasswordNavigation = () => {
  const Stack = createNativeStackNavigator<AuthRoutes>();

  return (
    <Stack.Navigator initialRouteName="currentPassword">
      <Stack.Screen
        options={{ headerShown: false }}
        name="currentPassword"
        component={CurrentPassword}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="changePassword"
        component={ChangePassword}
      />

      {/* <Stack.Screen options={{ headerShown: false }} name="RPSubCatogaries" /> */}
    </Stack.Navigator>
  );
};

export default ChangePasswordNavigation;

const styles = StyleSheet.create({});
