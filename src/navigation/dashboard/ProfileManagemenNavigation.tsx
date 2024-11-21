import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileManagement, Subscriptions } from "@screens";
import { AuthRoutes } from "@types";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import AccountSettingsNavigation from "./AccountSettingsNavigation";
import DeleteAccountNavigation from "./DeleteAccountNavigation";
import RpJourneyNavigation from "./RpJourneyNavigation";

const ProfileManagemenNavigation = () => {
  const theme = useTheme();
  const Stack = createNativeStackNavigator<AuthRoutes>();

  return (
    <Stack.Navigator
      initialRouteName="profileManagement"
      // screenOptions={{ headerTitleStyle: { color: theme?.colors?.secondary } }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="profileManagement"
        component={ProfileManagement}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="rpJourneyFlow"
        component={RpJourneyNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="accountSettingsFlow"
        children={AccountSettingsNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="deleteAccountFlow"
        component={DeleteAccountNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="subscribePlan"
        component={Subscriptions}
      />

      {/* <Stack.Screen options={{ headerShown: false }} name="RPSubCatogaries" /> */}
    </Stack.Navigator>
  );
};

export default ProfileManagemenNavigation;

const styles = StyleSheet.create({});
