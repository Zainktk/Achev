import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import Snackbar from "react-native-snackbar";
import { useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Divider, useTheme } from "react-native-paper";
import useNotifications from "../services/Notifications"; // Notifications hook
import NotifiComp from "../components/NotifiComp";
import {
  clearData,
  userToken,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  userData,
  Backarrow,
  notificationVar,
  PushEnabled,
  NotifiAllowed,
} from "@utils";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { User } from "src/utils/GlobalVariables";
import axios from "axios";

const NotifScreen = ({ route }: any) => {
  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const theme = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const globalError = useReactiveVar(globalErrorMessageVariable);
  const globalMsg = useReactiveVar(globalSuccessMessageVariable);
  const user = useReactiveVar(userData);
  const token = useReactiveVar(userToken);
  const [pushEnabled, setPushEnabled] = useState(false);
  const IsAllowed = useReactiveVar(NotifiAllowed);
  const [emailEnabled, setEmailEnabled] = useState(
    user?.optionToEmail === "Yes"
  );
  const [smsEnabled, setSmsEnabled] = useState(user?.optionToSMS === "Yes");
  console.log("user------>", user);
  const {
    getFCMToken,
    setForegroundMessageHandler,
    setupForegroundEventHandling,
    setNotificationsCategories,
  } = useNotifications();

  // Function to store user notification preference
  const saveNotificationPreference = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem("pushEnabled", JSON.stringify(enabled));
      PushEnabled(enabled);
    } catch (error) {
      console.log("Error saving notification preference", error);
    }
  };

  const loadNotificationPreference = async () => {
    try {
      const preference = await AsyncStorage.getItem("pushEnabled");
      if (preference !== null) {
        setPushEnabled(JSON.parse(preference));
      }
    } catch (error) {
      console.log("Error loading notification preference", error);
    }
  };

  // Save notifications to AsyncStorage
  const saveNotifications = async (notifications: any[]) => {
    try {
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
      );
      notificationVar(notifications);
    } catch (error) {
      console.log("Error saving notifications", error);
    }
  };

  // Load notifications from AsyncStorage
  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.log("Error loading notifications", error);
    }
  };

  const handleNewNotification = (notificationData: {
    id: any;
    title: string | undefined;
    body: string | undefined;
    createAt: string;
    metaData: string;
    user: { userProfile: { name: string } };
  }) => {
    // Check if the notification already exists
    const notificationExists = notifications.some(
      (notification) => notification.id === notificationData.id
    );

    // Only add new notifications if they don't exist
    if (!notificationExists) {
      setNotifications((prevNotifications) => {
        const updatedNotifications = [...prevNotifications, notificationData];
        saveNotifications(updatedNotifications);
        return updatedNotifications;
      });
    }
  };

  const handleDelete = (id: string) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  // Toggle notification switch
  const handleTogglePush = async (value: boolean) => {
    setPushEnabled(value);
    saveNotificationPreference(value);

    if (value) {
      // Subscribe to notifications (e.g., Achēv topic) when enabled
      await messaging().subscribeToTopic("Achev");
      Snackbar.show({
        text: "Push notifications enabled",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors?.primary,
      });
    } else {
      await messaging().unsubscribeFromTopic("weather");
      Snackbar.show({
        text: "Push notifications disabled",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors.error,
      });
    }
  };

  useEffect(() => {
    const setupNotifications = async () => {
      await getFCMToken();
      // setForegroundMessageHandler();
      setNotificationsCategories();

      const unsubscribeForeground = messaging().onMessage((remoteMessage) => {
        console.log("Notification received in foreground:", remoteMessage);
        const { notification } = remoteMessage;
        if (notification) {
          handleNewNotification({
            id: notification.notificationId || new Date().toISOString(),
            title: notification.title,
            body: notification.body,
            createAt: new Date().toISOString(),
            metaData: JSON.stringify(remoteMessage.data),
            user: { userProfile: { name: "Unknown User" } },
          });
        }
      });

      loadNotifications();
      loadNotificationPreference();

      return () => {
        unsubscribeForeground();
      };
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    if (globalError.message) {
      if (globalError.message.trim() === "jwt expired") {
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

  const clearAllNotifications = async () => {
    setNotifications([]); // Clear state
    try {
      await AsyncStorage.removeItem("notifications"); // Clear AsyncStorage
      Snackbar.show({
        text: "All notifications cleared",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors?.primary,
      });
    } catch (error) {
      console.log("Error clearing notifications", error);
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        const { notification } = remoteMessage;
        if (notification) {
          console.log("Notification received in background:", notification);
          handleNewNotification({
            id: notification.notificationId || new Date().toISOString(),
            title: notification.title,
            body: notification.body,
            createAt: new Date().toISOString(),
            metaData: JSON.stringify(remoteMessage.data),
            user: { userProfile: { name: "Unknown User" } },
          });
        }
      }
    );

    // Cleanup function to avoid memory leaks
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    const checkInitialNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        const { notification } = initialNotification;
        if (notification) {
          console.log("Notification opened from killed state:", notification);
          handleNewNotification({
            id: notification.notificationId || new Date().toISOString(),
            title: notification.title,
            body: notification.body,
            createAt: new Date().toISOString(),
            metaData: JSON.stringify(initialNotification.data),
            user: { userProfile: { name: "Unknown User" } },
          });
        }
      }
    };

    checkInitialNotification();
  }, []);

  const saveEmailPreference = async (enabled: boolean) => {
    const payload: Partial<User> = {
      ...userData(),
      optionToEmail: enabled ? "Yes" : "No",
    };
    try {
      const response = await axios.put(
        "https://oneclientapi.achev.ca/api/user/updateprofile",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update email preference");
      }
      Snackbar.show({
        text: "Email preference updated successfully",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors.primary,
      });
    } catch (error) {
      console.error("Error updating email preference:", error);
      Snackbar.show({
        text: "Error updating email preference",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors.error,
      });
    }
  };

  const saveSmsPreference = async (value: boolean) => {
    const payload: Partial<User> = {
      ...userData(),
      optionToSMS: value ? "Yes" : "No",
    };
    try {
      const response = await axios.put(
        "https://oneclientapi.achev.ca/api/user/updateprofile",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update email preference");
      }
      Snackbar.show({
        text: "Sms preference updated successfully",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors.primary,
      });
    } catch (error) {
      console.error("Error updating email preference:", error);
      Snackbar.show({
        text: "Error updating email preference",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors.error,
      });
    }
  };

  const handleToggleEmail = (value: boolean) => {
    setEmailEnabled(value);
    saveEmailPreference(value);
  };

  const handleToggleSms = (smsvalue: boolean) => {
    setSmsEnabled(smsvalue);
    saveSmsPreference(smsvalue);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginLeft: 10, marginTop: 15, flexDirection: "row" }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={profileStack.goBack}
        >
          <Backarrow />
        </TouchableOpacity>
        <View style={{ marginLeft: "20%" }}>
          <Text style={styles.notificationTitle}>Notifications</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Sms Message </Text>
        <Switch
          value={smsEnabled}
          onValueChange={handleToggleSms}
          trackColor={{ false: "#ccc", true: "#FF6347" }}
          thumbColor={smsEnabled ? "#fff" : "#f4f3f4"}
        />
      </View>
      <Divider
        bold
        style={{
          backgroundColor: "rgba(119, 110, 100, 1))",
          marginHorizontal: 10,
          marginTop: 15,
        }}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Email Message </Text>
        <Switch
          value={emailEnabled}
          onValueChange={handleToggleEmail}
          trackColor={{ false: "#ccc", true: "#FF6347" }}
          thumbColor={emailEnabled ? "#fff" : "#f4f3f4"}
        />
      </View>
      <Divider
        bold
        style={{
          backgroundColor: "rgba(119, 110, 100, 1))",
          marginHorizontal: 10,
          marginTop: 15,
        }}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Push notifications</Text>
        <Switch
          value={IsAllowed ? true : pushEnabled}
          onValueChange={handleTogglePush}
          trackColor={{ false: "#ccc", true: "#FF6347" }}
          thumbColor={pushEnabled ? "#fff" : "#f4f3f4"}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            color: "rgba(0, 0, 0, 1)",
            fontWeight: "800",
            fontSize: 16,
            fontFamily: theme.fonts.labelLarge.fontFamily,
          }}
        >
          Push Notification History:
        </Text>
        <TouchableOpacity onPress={clearAllNotifications}>
          <Text>Clear all</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 10, flex: 1, marginTop: 20 }}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotifiComp notification={item} onDelete={handleDelete} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  backButton: {
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    height: 30,
    width: 30,
    shadowOpacity: 10,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
  },
  notificationTitle: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: "20%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 15,
  },
  label: {
    fontSize: 16,
  },
};

export default NotifScreen;
