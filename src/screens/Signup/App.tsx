import { RootNavigation } from "@navigation";

import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useReactiveVar } from "@apollo/client";
import {
  clearData,
  getLocalStorageItem,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  lightTheme,
  LoggedInUser,
} from "@utils";
import Snackbar from "react-native-snackbar";

function App(): React.JSX.Element {
  const navigationRef = React.createRef<NavigationContainerRef<any>>();
  const theme = useTheme();
  const globalError = useReactiveVar(globalErrorMessageVariable);
  const globalMsg = useReactiveVar(globalSuccessMessageVariable);
  const isDarkMode = useColorScheme() === "dark";

  const checkIfUserLoggedIn = async () => {
    try {
      const storeUser = await getLocalStorageItem("token");
      const token = await getLocalStorageItem("token");
      const profile = await getLocalStorageItem("profile");
      console.log("store", storeUser, token);
      if (token) {
        LoggedInUser({ user: storeUser || {}, token: token, profile: profile });
      } else {
        LoggedInUser(null);
      }
    } catch (error) {
      LoggedInUser(null);
    }
  };

  const splashTimer = () => setTimeout(checkIfUserLoggedIn, 2000);

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
        LoggedInUser(null);
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
