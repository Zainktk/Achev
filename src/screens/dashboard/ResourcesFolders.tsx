import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { useTheme } from "react-native-paper";
import axios from "axios";
import ResourcesComp from "../../components/ResourcesComp";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";
import WebView from "react-native-webview";

const ResourcesFolders = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [Foldername, setFolderName] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);

  const fetchContent = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        "https://oneclientapi.achev.ca/api/Resources/SharedDocumentsFolders",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFolderName(response?.data);
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

  useEffect(() => {
    fetchContent();
  }, []);

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
        style={[
          styles.container,
          { paddingTop: insets.top + 10, display: showMap ? "flex" : "none" },
        ]}
      >
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 26,
                fontWeight: "800",
              }}
            >
              Resources
            </Text>
          </View>
        </View>

        <FlatList
          data={Foldername}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ResourcesComp item={item} />}
          numColumns={2}
          contentContainerStyle={styles.flatListContentContainer}
          columnWrapperStyle={styles.columnWrapper}
        />
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

export default ResourcesFolders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  flatListContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  webView: {
    backgroundColor: "transparent",
  },
});
