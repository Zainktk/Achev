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
import ProgramNavigator from "./ProgramNavigator";

export type ProgramScreenFlowType = {
  program: undefined;
  selectprogram: {
    service: string;
  };
  apply: undefined;
  Community: undefined;
  Webview: undefined;
};
const ProgramWithWebview = () => {
  const Stack = createNativeStackNavigator<ProgramScreenFlowType>();

  return (
    <Stack.Navigator initialRouteName="program">
      <Stack.Screen component={ProgramNavigator} name="program" />
      <Stack.Screen component={Webview} name="Webview" />
    </Stack.Navigator>
  );
};

export default ProgramWithWebview;
