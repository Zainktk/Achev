import { StyleSheet } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RPJourney, UpdatedMedicalSetbacks } from "@screens";
import { AuthRoutes } from "@types";
import UpdateRpStatusNavigation from "./UpdateRpStatusNavigation";

const RpJourneyNavigation = () => {
  const Stack = createNativeStackNavigator<AuthRoutes>();

  return (
    <Stack.Navigator
      initialRouteName="rpJourney"
      // screenOptions={{ headerTitleStyle: { color: theme?.colors?.secondary } }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="rpJourney"
        component={RPJourney}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="updatedRpStatusFlow"
        component={UpdateRpStatusNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="medicalSetBacks"
        component={UpdatedMedicalSetbacks}
      />
    </Stack.Navigator>
  );
};

export default RpJourneyNavigation;

const styles = StyleSheet.create({});
