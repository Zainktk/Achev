import messaging from "@react-native-firebase/messaging";
import notifee, {
  Notification,
  AuthorizationStatus,
  AndroidStyle,
  AndroidImportance,
  EventType,
} from "@notifee/react-native";
import { StyleSheet, Text, View, AppState } from "react-native";
import { NotificationType } from "./Commonfunctions";
import React, { useEffect, useState } from "react";
import { generateRandomString } from "./Commonfunctions";

interface IFirebaseNotificationData {
  body: string;
  notificationId?: string;
  text?: string;
  title: string;
  type?: string;
}

const useNotifications = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const handleAppStateChange = (nextAppState: any) => {
    setAppState(nextAppState);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  console.log("App State:", appState);

  const getFCMToken = async () => {
    try {
      const reqNotifeePermission = await notifee.requestPermission();
      if (
        reqNotifeePermission.authorizationStatus >=
        AuthorizationStatus.AUTHORIZED
      ) {
        // Register the device with FCM
        await messaging().registerDeviceForRemoteMessages();
        // Get the token
        const token = await messaging().getToken();
        console.log(token, "token");
        return token;
      } else {
        //todo --> force to open settings
        console.log("User declined permissions");
        return await Promise.reject("Permission Decline");
      }
    } catch (err) {
      return await Promise.reject(err);
    }
  };

  const setForegroundMessageHandler = () => {
    return messaging().onMessage(async (message) => {
      console.log("ForegroundMessageHandler Firebase", message);
      const data: any = message?.notification;
      console.log("dataaa=====------->", data);

      //in android we generate the notifcation on frontend
      // the notifcation is sent in data only for android

      showOnNotifee(data);
      return new Promise((resolve) => {
        resolve(true);
      });
    });
  };
  const setupForegroundEventHandling = async () => {
    console.log("setupForegroundEventHandling", setupForegroundEventHandling);
    return notifee.onForegroundEvent(async ({ type, detail }: any) => {
      const { notification, pressAction } = detail;
      const pressActionId = pressAction?.id as NotificationType | "default";
      switch (type) {
        case EventType.DISMISSED:
          console.log(
            "[onForegroundEvent] User dismissed notification",
            notification
          );
          break;
        case EventType.PRESS:
          switch (pressActionId) {
            case NotificationType?.Booking:
              // const storeUser = await getStoreData('user');
              console.log(
                "setupForegroundEventHandling NotificationType.Booking storeUser====>>"
              );
              // if (storeUser.business?.id) {
              //     navigate('BookingStack', {
              //         screen: 'bookings',
              //     })
              // } else {
              //     navigate('AppointmentStack')
              // }
              break;
            case NotificationType.ThreadComment:
              break;
            default:
              break;
          }
          break;
        case EventType.ACTION_PRESS:
          console.log(
            "[onForegroundEvent] User pressed an action",
            notification,
            detail.pressAction
          );
          break;
      }
    });
  };
  const cancelAllNotifications = async (): Promise<void> => {
    await notifee.cancelAllNotifications();
  };
  const unregisterDeviceForRemoteMessages = async () => {
    await messaging().unregisterDeviceForRemoteMessages();
  };
  const setNotificationsCategories = async () => {
    if (NotificationType?.Booking !== undefined) {
      await notifee.setNotificationCategories([
        { id: NotificationType?.Booking },
        { id: NotificationType.ThreadComment },
      ]);
    }
  };

  return {
    getFCMToken,
    setForegroundMessageHandler,
    setNotificationsCategories,
    cancelAllNotifications,
    unregisterDeviceForRemoteMessages,
    setupForegroundEventHandling,
  };
};

export default useNotifications;

export const showOnNotifee = async (data: IFirebaseNotificationData) => {
  try {
    const { body, notificationId: id, text, title, type } = data;

    const channelId = await notifee.createChannel({
      id: "custom-sound",
      name: "Channel with custom sound",
      sound: "default",
    }); // Required permission for iOS

    await notifee.requestPermission();
    await notifee.displayNotification({
      id: id ? id : generateRandomString(15),
      title: title,
      body: body,

      data: {
        body: "n",
        notificationId: id ?? "nn",
        text: "hv",
        title,
        type: type ? type : "default",
      },
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: type || "default",
          launchActivity: "default",
        },

        lightUpScreen: true,
        sound: "default",
        timestamp: Date.now(),
        style: {
          type: AndroidStyle.BIGTEXT,
          title: `${title}`,
          text: `${body}`,
        },
        showTimestamp: true,
      },
      ios: {
        categoryId: `${type || "default"} channel`,
        critical: true,
        sound: "default",
        criticalVolume: 1,
      },
    });
    console.log("------========-----=========---==");
    return true;
  } catch (err) {
    console.log("err while showing on notifee", err);
    return false;
  }
};
