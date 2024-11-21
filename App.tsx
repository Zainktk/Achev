import { RootNavigation } from "@navigation";

import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  AppState,
  Dimensions,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { useReactiveVar, ApolloProvider } from "@apollo/client";
import {
  AuthenticatedLoginUser,
  BottomFlowers,
  clearData,
  darkTheme,
  getLocalStorageItem,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  lightTheme,
  LoggedInUser,
  onBoarding,
  userToken,
} from "@utils";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Designated,
  Employment,
  initialToken,
  notificationVar,
  NotifiScreenVisited,
  PushEnabled,
  selectedDesignatedGroupsVar,
  statusCanada,
  userData,
} from "./src/utils/GlobalVariables";
import messaging from "@react-native-firebase/messaging";
import useNotifications from "./src/services/Notifications";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import {
  NotificationListener,
  requestUserPermission,
} from "./src/services/PushNotificationManager";

function App(): React.JSX.Element {
  const navigationRef = React.createRef<NavigationContainerRef<any>>();
  const theme = useTheme();
  const globalError = useReactiveVar(globalErrorMessageVariable);
  const globalMsg = useReactiveVar(globalSuccessMessageVariable);
  const user = useReactiveVar(userData);
  const token = useReactiveVar(userToken);
  console.log("user===>", user);
  const width = Dimensions.get("window").width;

  console.log("width", width);
  const getLoggedInUser = useReactiveVar(LoggedInUser);

  const checkIfUserLoggedIn = async () => {
    try {
      // const storeUser: AuthenticatedLoginUser = await getLocalStorageItem(
      //   "token"
      // );
      const token = await AsyncStorage.getItem("token");
      const user = await getLocalStorageItem("responseText");
      const initialtoken = await AsyncStorage.getItem("initialtoken");
      const notif = await AsyncStorage.getItem("notifications");
      const status = await getLocalStorageItem("status");
      const groups = await getLocalStorageItem("designated");
      const employment = await getLocalStorageItem("Employment");
      const NotifiVisited = await getLocalStorageItem("NotifiScreenVisited");
      const GroupsavedinEligibilty = await getLocalStorageItem(
        "selectedGroupLabels"
      );

      const parsedNotif = notif ? JSON.parse(notif) : [];

      const Enable = await AsyncStorage.getItem("pushEnabled");
      // console.log("store", storeUser, token);

      if (token) {
        userToken(token);
        initialToken(initialtoken);
        Designated(groups);
        statusCanada(status);
        NotifiScreenVisited(NotifiVisited);
        Employment(employment);
        selectedDesignatedGroupsVar(GroupsavedinEligibilty);
        userData(user);
        notificationVar(parsedNotif);
        if (Enable !== null) {
          PushEnabled(Enable === "true"); // Converts "true" to true, "false" to false
        } else {
          PushEnabled(null); // Set to null if no value is found
        }
      } else {
        let isShowOnboarding = await AsyncStorage?.getItem("isShowOnborading");

        onBoarding(isShowOnboarding);
        userToken(null);
      }
    } catch (error) {
      LoggedInUser(null);
    }
  };

  const splashTimer = () => setTimeout(checkIfUserLoggedIn, 4000);

  const {
    getFCMToken,
    setForegroundMessageHandler,
    setupForegroundEventHandling,
    setNotificationsCategories,
  } = useNotifications();

  useEffect(() => {
    // if (getLoggedInUser?.user) {
    getFCMToken()
      .then((token) => {
        console.log("dsdsdsdsdsdsdsdsdsdsdsdsdsd", token);
        // FCM Foreground listner
        setForegroundMessageHandler();
        setNotificationsCategories();
      })
      .catch((err) => {
        console.log("Get Token err", err);
      });
    // }
    // appstate change listner
    const open = AppState.addEventListener("change", async (nextAppState) => {
      switch (nextAppState) {
        case "background":
          console.log("Appstate change background");

        case "inactive":
          console.log("Appstate inactive");
        case "active":
          console.log("Appstate active");
          const initialNotification = await notifee.getInitialNotification();
          console.log("initialNotification", initialNotification);
      }
    });
    return () => {
      open.remove();
    };
  }, []);

  useEffect(() => {
    setupForegroundEventHandling();
  }, []);

  useEffect(() => {
    splashTimer();
  }, []);

  useEffect(() => {
    if (globalError.message) {
      if (globalError.message.trim() === `jwt expired`) {
        Snackbar.show({
          text: "Session Expired, Login again",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme.colors.error,
        });
        clearData();
        userToken(null);
      } else {
        Snackbar.show({
          text: globalError.message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme.colors.error,
        });
      }
    }
  }, [globalError]);

  useEffect(() => {
    if (globalMsg.message) {
      Snackbar.show({
        text: globalMsg.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors?.primary,
      });
    }
  }, [globalMsg]);

  // useEffect(() => {
  //   // Request permissions if not already granted
  //   const requestUserPermission = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);
  //     }
  //   };

  //   requestUserPermission();

  //   // Handle notification when app is opened from a background state
  //   messaging().onNotificationOpenedApp((remoteMessage) => {
  //     console.log(
  //       "Notification caused app to open from background state:",
  //       remoteMessage.notification
  //     );
  //   });

  //   // Check if the app was opened by a notification
  //   messaging()
  //     .getInitialNotification()
  //     .then((remoteMessage) => {
  //       if (remoteMessage) {
  //         console.log(
  //           "Notification caused app to open from quit state:",
  //           remoteMessage.notification
  //         );
  //       }
  //     });

  //   // Listen for app state changes to check for initial notification
  //   const appStateListener = AppState.addEventListener(
  //     "change",
  //     async (nextAppState) => {
  //       if (nextAppState === "active") {
  //         const initialNotification = await notifee.getInitialNotification();
  //         if (initialNotification) {
  //           console.log("App launched by notification:", initialNotification);
  //         }
  //       }
  //     }
  //   );

  //   return () => {
  //     appStateListener.remove();
  //   };
  // }, []);

  // useEffect(() => {
  //   const requestUserPermission = async () => {
  //     // Register the device to receive remote messages
  //     await messaging().registerDeviceForRemoteMessages();

  //     // Request user permission for notifications
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);

  //       // Get the FCM token after permission is granted and the device is registered
  //       const fcmToken = await messaging().getToken();
  //       console.log("FCM Token:", fcmToken);

  //       // Subscribe to topic
  //       messaging()
  //         .subscribeToTopic("weather")
  //         .then(() => console.log("Subscribed to topic!"));
  //     } else {
  //       console.log("Permission not granted");
  //     }
  //   };

  //   requestUserPermission();
  // }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log("Notification permissions granted.");
      } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        console.log("Notification permissions denied.");
      } else {
        console.log("Notification permissions are provisional.");
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={{}}>
      <NavigationContainer ref={navigationRef} theme={lightTheme}>
        <RootNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
