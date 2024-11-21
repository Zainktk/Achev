import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Snackbar from "react-native-snackbar";
import messaging from "@react-native-firebase/messaging";
import { useTheme } from "react-native-paper";
import { NotifiAllowed, NotifiBell, NotifiScreenVisited } from "@utils";
import { Buttonn, OutlinedButton } from "@atoms";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgramScreenFlowType } from "src/navigation/dashboard/ProgramNavigator";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllowNotificationScreen = () => {
  const [pushEnabled, setPushEnabled] = React.useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();

  const saveNotificationPreference = (enabled: boolean) => {
    // Save the user's preference for notifications (e.g., AsyncStorage or server-side)
    console.log("Notification preference saved:", enabled);
  };

  console.log("nnmnb");

  const handleTogglePush = async (value: boolean) => {
    setPushEnabled(value);
    saveNotificationPreference(value);

    if (value) {
      NotifiAllowed(true);
      await messaging().subscribeToTopic("Achev");
      Snackbar.show({
        text: "Push notifications enabled",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors?.primary,
      });
      homeStack.navigate("home");
    } else {
      NotifiAllowed(false);
      homeStack.navigate("home");
      await messaging().unsubscribeFromTopic("weather");
      Snackbar.show({
        text: "Push notifications disabled",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors.error,
      });
    }
  };

  useEffect(() => {
    AsyncStorage.setItem("NotifiScreenVisited", `${true}`);
    NotifiScreenVisited(true);
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
      <Text
        style={{
          fontFamily: theme.fonts.labelLarge.fontFamily,
          fontSize: 22,
          fontWeight: "700",
          marginHorizontal: 20,
          color: "rgba(0, 0, 0, 1)",
        }}
      >
        Push notifications
      </Text>
      <View style={{ alignItems: "center", marginVertical: "15%" }}>
        <NotifiBell />
        <Text
          style={{
            textAlign: "center",
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 22,
            fontWeight: "400",
            lineHeight: 36,
            color: "rgba(0, 0, 0, 1)",
            width: "50%",
          }}
        >
          Never miss any events or update!
        </Text>
      </View>
      <View style={{ alignSelf: "center" }}>
        <Text
          style={{
            textAlign: "center",
            fontFamily: theme.fonts.bodyMedium.fontFamily,
            fontSize: 16,
            fontWeight: "400",
            lineHeight: 24,
            color: "rgba(0, 0, 0, 1)",
            width: 350,
          }}
        >
          Subscribe to our push notifications be notified about upcoming events,
          new programs, extra resources, and more.
        </Text>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          flex: 1,
          marginBottom: "20%",
          marginHorizontal: 20,
          gap: 20,
        }}
      >
        <Buttonn title={"Continue"} onPress={() => handleTogglePush(true)} />
        <OutlinedButton
          title={"Skip for now"}
          ButtonStyle={{
            borderColor: theme.colors.primary,
            borderTopEndRadius: 50,
            borderTopLeftRadius: 50,
            borderBottomEndRadius: 50,
            borderBottomLeftRadius: 50,
          }}
          onPress={() => handleTogglePush(false)}
        />
      </View>
    </View>
  );
};

export default AllowNotificationScreen;

const styles = StyleSheet.create({});
