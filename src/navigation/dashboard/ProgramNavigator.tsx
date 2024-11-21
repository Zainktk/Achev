import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "@screens";
import EventDetail from "../../screens/dashboard/EventDetail";
import DownloadEvent from "../../screens/dashboard/DownloadEvent";
import Registered from "../../screens/Registered";
import NewsDetailScreen from "../../screens/NewsDetailScreen";
import Programs from "../../screens/dashboard/Programs";
import SelectPrograms from "../../screens/dashboard/SelectPrograms";
import ApplyForProgram from "../../screens/dashboard/ApplyForProgram";
import Webview from "../../components/WebviewComp";
import EligibilityForm from "../../screens/dashboard/EligibilityForm";
import ProgramContent from "../../screens/ProgramContent";
import ProgramEligibilityFields from "../../screens/ProgramEligibilityFields";
import EligibilityCheck from "../../screens/dashboard/EligibilityCheck";
import AllowNotificationScreen from "../../screens/AllowNotificationScreen";

export type ProgramScreenFlowType = {
  program: undefined;
  selectprogram: {
    updatedSelected: number[];
  };
  apply: undefined;
  Community: undefined;
  eligibility: { id: number; name: string };
  content: { id: number; status: string };
  eligibilitycheck: { id: number; name: string };
  allownotifi: undefined;
};
const ProgramNavigator = () => {
  const Stack = createNativeStackNavigator<ProgramScreenFlowType>();
  return (
    <Stack.Navigator initialRouteName="program">
      <Stack.Screen
        options={{ headerShown: false }}
        component={Programs}
        name="program"
      />

      <Stack.Screen
        options={{ headerShown: false }}
        component={SelectPrograms}
        name="selectprogram"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={ApplyForProgram}
        name="apply"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={EligibilityForm}
        name="eligibility"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={ProgramContent}
        name="content"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={EligibilityCheck}
        name="eligibilitycheck"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={AllowNotificationScreen}
        name="allownotifi"
      />
    </Stack.Navigator>
  );
};

export default ProgramNavigator;

const styles = StyleSheet.create({});
