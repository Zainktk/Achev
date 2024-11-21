import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AccountSettings, ChangePassword, EditBio } from "@screens";
import { AuthRoutes } from "@types";
import { StyleSheet } from "react-native";
import ChangeEmailNavigation from "./ChangeEmailNavigation";

const AccountSettingsNavigation = () => {
  const Stack = createNativeStackNavigator<AuthRoutes>();

  return (
    <Stack.Navigator initialRouteName="accountSettings">
      <Stack.Screen
        options={{ headerShown: false }}
        name="accountSettings"
        component={AccountSettings}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="changeEmailFlow"
        component={ChangeEmailNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="changePassword"
        component={ChangePassword}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="editBio"
        component={EditBio}
      />
      {/* <Stack.Screen options={{ headerShown: false }} name="RPSubCatogaries" /> */}
    </Stack.Navigator>
  );
};

export default AccountSettingsNavigation;

const styles = StyleSheet.create({});
