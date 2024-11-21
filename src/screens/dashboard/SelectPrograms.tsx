import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import EmploymentServices from "../../components/EmploymentServices";
import ProgramsHeader from "../../components/ProgramsHeader";
import { useTheme } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import YouthServices from "../../components/YouthServices";
import LanguageServices from "../../components/LanguageServices";
import NewComerServices from "../../components/NewComerServices";
import { OutlinedButton, Buttonn } from "@atoms";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgramScreenFlowType } from "src/navigation/dashboard/ProgramNavigator";
import WomenServices from "../../components/WomenServices";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReactiveVar } from "@apollo/client";
import { AppliedPrograms, userData, userToken } from "@utils";

const SelectPrograms = () => {
  const [showMap, setShowMap] = useState(true);
  const insets = useSafeAreaInsets();
  const [responseData, setResponseata] = useState([{}]);
  const [isloading, setIsLoading] = useState(true);
  const applied = useReactiveVar(AppliedPrograms);
  const token = useReactiveVar(userToken);
  const userdata = useReactiveVar(userData);

  const route = useRoute();

  console.log("routeEEEeeeee-------->", route.params?.updatedSelected);
  console.log("servicename--->", route.params?.servicename);
  console.log("applied--->", applied);
  console.log("userId===>>", userdata?.id);

  const fetchServices = async () => {
    try {
      const serviceIds = route.params?.updatedSelected;
      console.log("Service IDs:", serviceIds);

      const requestBody = { serviceIds };
      console.log("Request Body:", requestBody);
      const response = await axios.post(
        `https://oneclientapi.achev.ca/api/Programs/ProgramList/${userdata?.id}`,
        route.params?.updatedSelected,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response Data:=====================>>>>>>", response?.data);
      setResponseata(response?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(
        "Error fetching services:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const ProgramStack =
    useNavigation<NativeStackNavigationProp<ProgramScreenFlowType>>();
  const theme = useTheme();

  const onBack = () => {
    ProgramStack.navigate("program");
  };
  const onApply = () => {
    ProgramStack.navigate("apply");
  };

  const onPress = (id: number, status: string) => {
    ProgramStack.navigate("content", {
      id: id,
      status: status,
    });
  };

  const itm = responseData.map((item) => item?.id);
  console.log("item------------->>", itm);

  const filteredData = responseData.filter((item) => item?.serviceId === 4);
  const filtered = responseData.filter((item) => item?.serviceId === 3);
  const filteredNewcomer = responseData.filter((item) => item?.serviceId === 2);
  const filteredlanguage = responseData.filter((item) => item?.serviceId === 1);
  const filteredWomen = responseData.filter((item) => item?.serviceId === 5);
  console.log("Filtered Data id4:", filteredData);
  console.log("Filtered Data id3:", filtered);
  console.log("filteredNewcomerId2", filteredNewcomer);
  console.log("filteredlanguage===>>", filteredlanguage);
  console.log("filterWomen-->>", filteredWomen);

  if (isloading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
        <View style={{ display: showMap === true ? null : "none" }}>
          <ProgramsHeader prop={"Select"} onBack={onBack} />
        </View>

        <Text
          style={{
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 22,
            fontWeight: "600",
            color: " rgba(0, 0, 0, 1)",
            marginHorizontal: 25,
            marginVertical: 20,
            letterSpacing: -0.9,
          }}
        >
          Click on the program to see details
        </Text>

        <ScrollView style={{ marginTop: 20, flex: 2 }}>
          <View style={{ gap: 60 }}>
            {route?.params?.servicename.map((item: string) =>
              item == "Youth" ? (
                <View style={{ display: showMap === true ? null : "none" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 25,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 22,
                        fontWeight: "800",
                        color: "rgba(224, 79, 57, 1)",
                      }}
                    >
                      {route?.params?.servicename.find(
                        (item) => item === "Youth"
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 14,
                        fontWeight: "700",
                        color: "rgba(224, 79, 57, 1)",
                      }}
                    >
                      {filteredData.length} programs
                    </Text>
                  </View>

                  <FlatList
                    data={filteredData}
                    contentContainerStyle={{ gap: 20, marginTop: 20 }}
                    renderItem={({ item }) => (
                      <YouthServices
                        service={item?.name}
                        id={item?.id}
                        onPress={onPress}
                        status={item?.status}
                      />
                    )}
                    scrollEnabled={false}
                  />
                </View>
              ) : item == "Employment" ? (
                <View style={{ display: showMap === true ? null : "none" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 25,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 22,
                        fontWeight: "800",
                        color: "rgba(92, 184, 178, 1)",
                      }}
                    >
                      {route?.params?.servicename.find(
                        (item) => item === "Employment"
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 14,
                        fontWeight: "700",
                        color: "rgba(92, 184, 178, 1)",
                      }}
                    >
                      {filtered.length} programs
                    </Text>
                  </View>
                  {
                    <FlatList
                      data={filtered}
                      contentContainerStyle={{ gap: 20, marginTop: 20 }}
                      renderItem={({ item }) => (
                        <EmploymentServices
                          service={item?.name}
                          id={item?.id}
                          onPress={onPress}
                          status={item?.status}
                        />
                      )}
                      scrollEnabled={false}
                    />
                  }
                </View>
              ) : item == "Language" ? (
                <View style={{ display: showMap === true ? null : "none" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 25,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 22,
                        fontWeight: "800",
                        color: "rgba(71, 93, 118, 1)",
                      }}
                    >
                      {route?.params?.servicename.find(
                        (item) => item === "Language"
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 14,
                        fontWeight: "700",
                        color: "rgba(71, 93, 118, 1)",
                      }}
                    >
                      {filteredlanguage.length} programs
                    </Text>
                  </View>
                  <FlatList
                    data={filteredlanguage}
                    contentContainerStyle={{ gap: 20, marginTop: 20 }}
                    renderItem={({ item }) => (
                      <LanguageServices
                        service={item?.name}
                        id={item?.id}
                        onPress={onPress}
                        status={item?.status}
                      />
                    )}
                    scrollEnabled={false}
                  />
                </View>
              ) : item == "Newcomer" ? (
                <View style={{ display: showMap === true ? null : "none" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 25,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 22,
                        fontWeight: "800",
                        color: "rgba(165, 0, 52, 1)",
                      }}
                    >
                      {route?.params?.servicename.find(
                        (item) => item === "Newcomer"
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 14,
                        fontWeight: "700",
                        color: "rgba(165, 0, 52, 1)",
                      }}
                    >
                      {filteredNewcomer.length} programs
                    </Text>
                  </View>
                  <FlatList
                    data={filteredNewcomer}
                    contentContainerStyle={{ gap: 20, marginTop: 20 }}
                    renderItem={({ item }) => (
                      <NewComerServices
                        service={item?.name}
                        id={item?.id}
                        onPress={onPress}
                        status={item?.status}
                      />
                    )}
                    scrollEnabled={false}
                  />
                </View>
              ) : item == "Women's Services" ? (
                <View style={{ display: showMap === true ? null : "none" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 25,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 22,
                        fontWeight: "800",
                        color: "rgba(96, 25, 84, 1)",
                      }}
                    >
                      {route?.params?.servicename.find(
                        (item) => item === "Women's Services"
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily: theme.fonts.labelLarge.fontFamily,
                        fontSize: 14,
                        fontWeight: "700",
                        color: "rgba(96, 25, 84, 1)",
                      }}
                    >
                      {filteredWomen.length} programs
                    </Text>
                  </View>
                  <FlatList
                    data={filteredWomen}
                    contentContainerStyle={{
                      gap: 20,
                      marginTop: 20,
                    }}
                    renderItem={({ item }) => (
                      <WomenServices
                        service={item?.name}
                        id={item?.id}
                        onPress={onPress}
                        status={item?.status}
                      />
                    )}
                    scrollEnabled={false}
                  />
                </View>
              ) : null
            )}
          </View>
        </ScrollView>
      </View>
      <WebView
        style={styles.webView}
        javaScriptEnabled={true}
        containerStyle={{
          position: "absolute",
          bottom: 70, // Increase this value to move the icon up
          right: showMap ? 20 : 0, // Increase this value to move the icon left
          width: showMap ? 80 : "100%", // Increase size to show more of the icon
          height: showMap ? 80 : "90%", // Increase size to show more of the icon
          zIndex: 9999, // Ensure it's above other elements
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

export default SelectPrograms;

const styles = StyleSheet.create({
  webView: { backgroundColor: "transparent" },
});
