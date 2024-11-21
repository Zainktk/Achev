import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "@screens";
import EventDetail from "../../screens/dashboard/EventDetail";
import DownloadEvent from "../../screens/dashboard/DownloadEvent";
import Registered from "../../screens/Registered";
import NewsDetailScreen from "../../screens/NewsDetailScreen";
import PostScreen from "../../screens/dashboard/PostScreen";
import ResourcesNavigation from "./ResourcesNavigation";
import HomeDownload from "../../screens/HomeDownload";
import AllowNotificationScreen from "../../screens/AllowNotificationScreen";
import AllownotifiHome from "../../screens/AllownotifiHome";

export type HomeScreenFlowType = {
  home: undefined;
  eventDetail: undefined;
  downloadEvent: {
    eventId: any;
    param: string;
  };
  RegiteredForEvent: {
    img: any;
    title: string;
    event: object;
  };
  newdetilscreen: undefined;
  PostScreen: {
    eventId: any;
  };
  resources: undefined;
  homeDownload: {
    eventIdhome: any;
    paramhome: string;
  };
  Allowhome: undefined;
};
const HomeNavigator = () => {
  const Stack = createNativeStackNavigator<HomeScreenFlowType>();
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen
        options={{ headerShown: false }}
        component={Home}
        name="home"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={EventDetail}
        name="eventDetail"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={NewsDetailScreen}
        name="newdetilscreen"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={DownloadEvent}
        name="downloadEvent"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={HomeDownload}
        name="homeDownload"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={Registered}
        name="RegiteredForEvent"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={PostScreen}
        name="PostScreen"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={ResourcesNavigation}
        name="resources"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={AllownotifiHome}
        name="Allowhome"
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
