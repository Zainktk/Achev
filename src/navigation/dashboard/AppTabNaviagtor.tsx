import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Chat, Community, Home, Notification } from "@screens";
import {
  AppliedPrograms,
  ChatIcon,
  HomeIcon,
  Homeicon,
  LoggedInUser,
  MembersIcon,
  NotificationIcon,
  ProfileIcon,
  ProgramActive,
  ProgramInactive,
  Programsvg,
  getLocalStorageItem,
  initialToken,
  onBoarding,
  userData,
  userToken,
} from "@utils";
import React, {
  JSXElementConstructor,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "react-native-paper";
import ProfileManagamenNavigation from "./ProfileManagemenNavigation";
import HomeNavigator from "./HomeNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import WebviewComp from "../../components/WebviewComp";
import ProgramNavigator from "./ProgramNavigator";
import LocationNavigation from "../LocationNavigator";
import ProfileNavigation from "./ProfileNavigation";
import ResourcesNavigation from "./ResourcesNavigation";
import { useReactiveVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

let routeIconMapping: { [key: string]: JSXElementConstructor<any> } = {
  Feeds: ({ color }) => <Homeicon color={color} />,
  Resources: ({ color }) => <MembersIcon color={color} />,
  Programs: ({ focused, color }) =>
    focused ? (
      <ProgramActive color={color} />
    ) : (
      <ProgramInactive color={color} />
    ),
  Locations: ({ color }) => <NotificationIcon color={color} />,
  Me: ({ color }) => <ProfileIcon color={color} />,
};
const AppTabNaviagtor = () => {
  const Tab = createBottomTabNavigator();
  const theme = useTheme();
  const [focusedRoute, setFocusedRoute] = useState("");
  const user = useReactiveVar(userData);
  const token = useReactiveVar(userToken);
  const lastTabRef = useRef<string | null>(null);
  const [resetToHome, setResetToHome] = useState(false);

  useEffect(() => {
    const checkIfUserLoggedIn = async () => {
      try {
        // const storeUser: AuthenticatedLoginUser = await getLocalStorageItem(
        //   "token"
        // );
        const token = await AsyncStorage.getItem("token");
        const user = await getLocalStorageItem("responseText");
        const initialtoken = await AsyncStorage.getItem("initialtoken");
        const Applied = await AsyncStorage.getItem("appliedPrograms");
        const parsedPrograms = Applied ? JSON.parse(Applied) : [];

        // console.log("store", storeUser, token);
        console.log("user====>>>>>>", user);
        if (token) {
          userToken(token);
          initialToken(initialtoken);
          userData(user);
          AppliedPrograms(parsedPrograms);
        } else {
          let isShowOnboarding = await AsyncStorage?.getItem(
            "isShowOnborading"
          );

          onBoarding(isShowOnboarding);
          userToken(null);
        }
      } catch (error) {
        LoggedInUser(null);
      }
    };
    checkIfUserLoggedIn();
  }, []);

  useEffect(() => {
    const populate = async () => {
      try {
        const user = await getLocalStorageItem("user");
        const profile = await getLocalStorageItem("profile");
        const token = await getLocalStorageItem("token");
        // console.log("profile", profile);
        LoggedInUser({ user, profile, token });
      } catch (err) {}
    };
    populate();
  }, []);

  const getTabBarIcon = (focused: boolean, route: { name: string }) => {
    const IconComponent = routeIconMapping[route.name];

    if (route.name === "Programs") {
      return focused ? (
        <ProgramActive color={theme.colors.Secondary_100} />
      ) : (
        <ProgramInactive color={theme.colors.secondary_90} />
      );
    }

    return (
      <IconComponent
        color={
          focused ? theme?.colors?.Secondary_100 : theme?.colors?.secondary_90
        }
      />
    );
  };
  const getChatTab = ({ route }: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName?.includes("downloadEvent") ||
      routeName?.includes("homeDownload")
    ) {
      return "none";
    }
    return "flex";
  };
  const getProgramTab = ({ route }: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName?.includes("eligibility") ||
      routeName?.includes("apply") ||
      routeName?.includes("content")
    ) {
      return "none";
    }
    return "flex";
  };

  const Locationtab = ({ route }: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName?.includes("VenueDetails")) {
      return "none";
    }
    return "flex";
  };

  const ProfileTab = ({ route }: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName?.includes("Password") ||
      routeName?.includes("privacyPolicy") ||
      routeName?.includes("requesetToRemove")
    ) {
      return "none";
    }
    return "flex";
  };

  const FeedTab = ({ route }: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName?.includes("downloadEvent") ||
      routeName?.includes("homeDownload")
    ) {
      return "none";
    }
    return "flex";
  };

  return (
    <Tab.Navigator
      initialRouteName="Programs"
      screenOptions={({ route }) => ({
        headerTitleStyle: {
          color: theme?.colors?.secondary,
        },

        tabBarIcon: ({ focused }) => <>{getTabBarIcon(focused, route)}</>,

        tabBarStyle: {
          backgroundColor: "white",
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 20,
          shadowOpacity: 3,
          shadowColor: "rgba(0, 0, 0, 0.15)",
          elevation: 3,
        },
      })}
    >
      <Tab.Screen
        name="Feeds"
        component={HomeNavigator}
        options={(route: any) => ({
          tabBarStyle: {
            backgroundColor: "white",
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 20,
            shadowOpacity: 0.4,
            shadowColor: "#464b4e",
            elevation: 3,
          },

          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesNavigation}
        options={(route: any) => ({
          tabBarStyle: {
            display: getProgramTab(route),
            backgroundColor: "white",
            shadowOffset: 0.1,
            shadowRadius: 20,
            shadowColor: "#464b4e",
            shadowOpacity: 0.4,
          },

          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Programs"
        component={ProgramNavigator}
        options={(route: any) => ({
          tabBarStyle: {
            display: getProgramTab(route),
            backgroundColor: "white",
            shadowOffset: 0.1,
            shadowRadius: 20,
            shadowColor: "#464b4e",
            shadowOpacity: 0.4,
          },

          headerShown: false,
        })}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: "Programs" }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Locations"
        options={(route: any) => ({
          headerShown: false,
          tabBarStyle: {
            display: Locationtab(route),
            backgroundColor: "white",
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 20,
            shadowOpacity: 0.4,
            shadowColor: "#464b4e",
            elevation: 3,
          },
        })}
        component={LocationNavigation}
      />
      <Tab.Screen
        options={(route: any) => ({
          tabBarStyle: {
            display: ProfileTab(route),
            backgroundColor: "white",
            shadowOffset: 0.1,
            shadowRadius: 20,
            shadowColor: "#464b4e",
            shadowOpacity: 0.4,
          },

          headerShown: false,
        })}
        name="Me"
        children={ProfileNavigation}
      />
    </Tab.Navigator>
  );
};

export default AppTabNaviagtor;

const styles = StyleSheet.create({});
