import { StyleSheet } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConfirmDeleteAccount, DeleteAccount } from "@screens";
import { AuthRoutes } from "@types";
const DeleteAccountNavigation = () => {
  const Stack = createNativeStackNavigator<AuthRoutes>();

  return (
    <Stack.Navigator initialRouteName="deleteAccount">
      <Stack.Screen
        options={{ headerShown: false }}
        name="deleteAccount"
        component={DeleteAccount}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="confirmDeleteAccount"
        component={ConfirmDeleteAccount}
      />

      {/* <Stack.Screen options={{ headerShown: false }} name="RPSubCatogaries" /> */}
    </Stack.Navigator>
  );
};

export default DeleteAccountNavigation;

const styles = StyleSheet.create({});
