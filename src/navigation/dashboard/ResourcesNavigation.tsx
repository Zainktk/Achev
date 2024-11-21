import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileManagement from "../../screens/dashboard/ProfileManagement";
import MyProfile from "../../screens/MyProfile";
import ResourcesFolders from "../../screens/dashboard/ResourcesFolders";
import ResourcesFiles from "../../screens/dashboard/ResourcesFiles";
import NewScreen from "../../screens/dashboard/NewScreen";

export type ResourceStackType = {
  resourcesFolders: undefined;
  resourcesFiles: { item: string };
  New: { item: string; filename: string };
};

const ResourcesNavigation = () => {
  const resourceStack = createNativeStackNavigator<ResourceStackType>();
  return (
    <resourceStack.Navigator initialRouteName="resourcesFolders">
      <resourceStack.Screen
        name="resourcesFolders"
        component={ResourcesFolders}
        options={{ headerShown: false }}
      />
      <resourceStack.Screen
        name="resourcesFiles"
        component={ResourcesFiles}
        options={{ headerShown: false }}
      />
      <resourceStack.Screen
        name="New"
        component={NewScreen}
        options={{ headerShown: false }}
      />
    </resourceStack.Navigator>
  );
};

export default ResourcesNavigation;

const styles = StyleSheet.create({});
