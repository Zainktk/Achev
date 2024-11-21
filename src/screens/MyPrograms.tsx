import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { useTheme } from "react-native-paper";
import axios from "axios";
import { useReactiveVar } from "@apollo/client";
import { userData, userToken } from "../utils/GlobalVariables";
import MyProgramsComp from "../components/MyProgramsComp";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { Backarrow, getLocalStorageItem } from "@utils";
import LottieView from "lottie-react-native";
import AchevLoader from "../assets/AchevLoader.json";
import WebView from "react-native-webview";

const MyPrograms = () => {
  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(true);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useReactiveVar(userData);
  const token = useReactiveVar(userToken);

  console.log("token===>>", token);

  const currentRoute = useNavigationState(
    (state) => state.routes[state.index]
  ).name;
  console.log("currentRoute====>>>>", currentRoute);

  // const verifyEmail = async () => {
  //   try {
  //     const token = await getToken();
  //     const response = await fetch(
  //       "https://oneclientapi.achev.ca/api/user/login",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           email: user?.email,
  //           password: user?.password,
  //         }),
  //       }
  //     );
  //     console.log("response==>>>>>>>>>>", response);
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //   }
  // };
  // useEffect(() => {
  //   verifyEmail();
  // }, []);

  const fetchPrograms = async () => {
    try {
      console.log("MyPrograms====>>>>", user?.id);
      const response = await axios.get(
        `https://oneclientapi.achev.ca/api/Programs/UserPrograms/${user?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Response Data:============---------=========>>>>>>",
        response?.data
      );
      setResponse(response?.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching services:",
        error.response?.data || error.message
      );
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);
  const getToken = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const expirationTime = await AsyncStorage.getItem("tokenExpirationTime");

      if (!token || !expirationTime || Date.now() >= Number(expirationTime)) {
        token = await login();
      }

      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  const login = async () => {
    try {
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/odoo/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "achev",
            password:
              "1TsraPAKp2fbV4x3vjtrhjtEa1QH0i9uBtwI45SKLZTY88MWEVdlI17epOM8pDBw8Cx5HJuOOUr4WOlXx8Nc6AZkBXyqauKc2IE20KIEEqii9zVRopgdCPZkVEfwoOQK",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Login response data:", data);
      const token = data.token;
      const expirationTime = Date.now() + data.expiresIn * 1000;

      if (token && expirationTime) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem(
          "tokenExpirationTime",
          expirationTime.toString()
        );
      }

      return token;
    } catch (error) {
      Snackbar.show({
        text: " sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
      console.error("Error logging in:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <LottieView
        source={AchevLoader}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
          justifyContent: "center",
          alignSelf: "center",
          flex: 1,
        }}
      />
    );
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 10,
          display: showMap ? "flex" : "none",
        }}
      >
        <View
          style={{
            flexDirection: "row",

            marginHorizontal: 20,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 30,
              width: 30,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={() => profileStack.goBack()}
          >
            <Backarrow />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 22,
                fontWeight: "800",
              }}
            >
              My Programs
            </Text>
          </View>
        </View>
        <View style={{ margin: 20 }}>
          <Text
            style={{
              color: "#776E64",
              fontFamily: theme.fonts.titleMedium.fontFamily,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            HISTORY
          </Text>
        </View>
        {response.length > 0 ? (
          <FlatList
            data={response}
            renderItem={({ item }) => (
              <MyProgramsComp
                date={item?.createDate}
                status={item?.status}
                name={item?.name}
              />
            )}
            contentContainerStyle={{ gap: 20 }}
          />
        ) : (
          <Text
            style={{
              justifyContent: "center",
              alignItems: "center",

              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "600",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            No programs accessed yet
          </Text>
        )}
      </View>
      <WebView
        style={styles.webView}
        javaScriptEnabled={true}
        containerStyle={{
          position: "absolute",
          bottom: 70,
          right: showMap ? 20 : 0,
          width: showMap ? 80 : "100%",
          height: showMap ? 80 : "85%",
          zIndex: 9999,
          backgroundColor: "transparent",
        }}
        originWhitelist={["*"]}
        source={{
          html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
       body, html {
       margin: 0;
       padding: 0;
      background-color: transparent !important;
    overflow: visible !important;
  }
  #tidio-chat-iframe {
    transform: scale(1) !important; // Reset scale to original size
    transform-origin: bottom right !important;
    position: fixed !important;
    bottom: 0 !important;
    right: 0 !important;
  }
</style>
        </head>
        <body>
          <script>
            (function() {
              window.addEventListener("message", function(event) {
                if (event.data === "toggleMap") {
                  window.ReactNativeWebView.postMessage("toggleMap");
                }
              });

              function hideBadge() {
              if (tidioChatApi) {
                tidioChatApi.hideBadge();
              }
            }


              document.addEventListener("DOMContentLoaded", function() {
                var tidioScript = document.createElement("script");
                tidioScript.src = "https://code.tidio.co/vndgds0tz32ubhsgosc8ne6tj68xut3m.js";
                tidioScript.async = true;
                tidioScript.onload = function() {
                  tidioChatApi.on("open", function() {
                    window.ReactNativeWebView.postMessage("chatOpened");
                  });
                  tidioChatApi.on("close", function() {
                    window.ReactNativeWebView.postMessage("chatClosed");
                  });
                  
                };
                document.body.appendChild(tidioScript);
              });
            })();
          </script>
        </body>
      </html>
    `,
        }}
        onMessage={(event) => {
          if (event.nativeEvent.data === "chatOpened") {
            setShowMap(false);
          } else if (event.nativeEvent.data === "chatClosed") {
            setShowMap(true);
          }
        }}
      />
    </>
  );
};

export default MyPrograms;

const styles = StyleSheet.create({
  webView: {
    backgroundColor: "transparent",
  },
});
