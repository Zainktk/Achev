/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme, clearData } from "@utils";
import { NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import { ApolloProvider } from "@apollo/client";
import { client } from "@graphql";
import { showOnNotifee } from "./src/services/Notifications";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

messaging().setBackgroundMessageHandler(async (message) => {
  console.log("BackgroundMessageHandler Firebase", message);
  const data = message.notification;
  //in android we generate the notifcation on frontend
  // the notifcation is sent in data only for android
  if (Platform.OS === "android") {
    if (message.data?.origin === "MAAS") {
      let myNoti = JSON.parse(message.data?.message);
      console.log("myNoti", myNoti);
      showOnNotifee({
        body: myNoti?.text,
        title: "Achev",
      });
    } else {
      showOnNotifee(data);
    }
  }
});

messaging().onNotificationOpenedApp((message) => {
  console.log("ForegroundMessageHandler Firebase", message);
  console.log("opened app from notification friebase", message);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  const pressActionId = pressAction?.id;
  const data = notification?.data;
  switch (type) {
    case EventType.DISMISSED:
      console.log("[background] User dismissed notification", notification);
      await notifee.cancelNotification(notification.id);
      break;
    case EventType.PRESS:
      console.log(
        "[background] User pressed notification notifee",
        notification
      );
      switch (pressActionId) {
        case NotificationType.Booking:
          const storeUser = await getStoreData("user");
          if (storeUser.business?.id) {
            navigate("BookingStack", {
              screen: "bookings",
            });
          } else {
            navigate("AppointmentStack");
          }
          break;
        case NotificationType.ThreadComment:
          console.log("Navigate to Booking VIA ThreadComment");
          break;
        default:
          console.log("default pressAction");
          break;
      }
      break;
    case EventType.ACTION_PRESS:
      console.log(
        "[background] User pressed an action",
        notification,
        detail.pressAction
      );
      break;
  }
});

const Main = () => {
  const isDarkMode = useColorScheme() === "dark";

  // clearData()
  return (
    <ApolloProvider client={client}>
      <PaperProvider theme={lightTheme}>
        <App />
      </PaperProvider>
      <Toast />
    </ApolloProvider>
  );
};
AppRegistry.registerComponent(appName, () => Main);
