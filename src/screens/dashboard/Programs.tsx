import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Buttonn, SearchBox } from "@atoms";
import ProgramsHeader from "../../components/ProgramsHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import {
  AppliedPrograms,
  EmploymentServices,
  EmploymentServicestick,
  EmploymentSvg,
  Langtick,
  LanguageServicesIcon,
  NewcomerServicesIcon,
  NewcomerServicestick,
  ProgrammeTick,
  Selected,
  WomenServicesIcon,
  WomenServicestick,
  YouthServicesIcon,
  initialToken,
  selectedEmploymentStatusVar,
  selectedGenderVar,
  selectedStatusInCanadaVar,
  userData,
  userToken,
} from "@utils";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgramScreenFlowType } from "src/navigation/dashboard/ProgramNavigator";
import WebView from "react-native-webview";
import Webview from "../../components/WebviewComp";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";
import { SvgUri } from "react-native-svg";
import Snackbar from "react-native-snackbar";
import { useReactiveVar } from "@apollo/client";
import atob from "atob";

const Programs = () => {
  const ProgramStack =
    useNavigation<NativeStackNavigationProp<ProgramScreenFlowType>>();

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [Update, setUpdate] = useState<any>();
  const [showMap, setShowMap] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [selectedServiceNames, setSelectedServiceNames] = useState<string[]>(
    []
  );
  const token = useReactiveVar(userToken);
  const initialtoken = useReactiveVar(initialToken);
  const user = useReactiveVar(userData);
  const Applied = useReactiveVar(AppliedPrograms);
  console.log("token-->?", token);
  const toggleService = (serviceId: number, serviceName: string) => {
    setSelectedServices((prevSelected) => {
      const updatedSelected = prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId];
      setUpdate(updatedSelected);
      console.log("Selected IDs:", updatedSelected);
      return updatedSelected;
    });

    setSelectedServiceNames((prevSelectedNames) => {
      if (prevSelectedNames.includes(serviceName)) {
        return prevSelectedNames.filter((name) => name !== serviceName);
      } else {
        return [...prevSelectedNames, serviceName];
      }
    });
  };
  console.log("selectedServiceNames===>>>>", selectedServiceNames);
  console.log("Update=====>>>>.", Update);
  const isSelected = (serviceName: any) =>
    selectedServices.includes(serviceName);
  const theme = useTheme();

  const handlePress = () => {
    ProgramStack.navigate("selectprogram", {
      updatedSelected: Update,
      servicename: selectedServiceNames,
    });
  };
  console.log("token====", token);
  console.log("initialtoken-----", initialtoken);
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "https://oneclientapi.achev.ca/api/Programs/Services",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServices(response.data);
      console.log("res--->>>>", response);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching services:",
        error.response?.data || error.message
      );
      setError("Failed to fetch services");
      setLoading(false);
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
          }), // replace with actual credentials
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
      }

      const data = await response.json();
      const token = data.token;
      console.log("data---------->>>>>>>", data);
      const expirationTime = Date.now() + data.expiresIn * 10000; // Assuming `expiresIn` is in seconds

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

  useEffect(() => {
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

        const data = response;
        console.log("data---------->>>>>>>", data);
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
    login();
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const gettoken = async () => {
    const decodedString = atob(token?.split(".")[1]);
    console.log("decodedString======--------->>>>>>", decodedString);

    const decodedPayload = JSON.parse(decodedString);

    const nbf = decodedPayload.nbf;
    const exp = decodedPayload.exp;

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime < nbf) {
      console.log("Token is not yet valid (nbf).");
    } else if (currentTime > exp) {
      console.log("Session has expired (exp).");
      await AsyncStorage.removeItem("token");
      userToken(null);
      await AsyncStorage.removeItem("responseText");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("appliedPrograms");

      await AsyncStorage.removeItem("selectedCanadaLabel");
      await AsyncStorage.removeItem("selectedGenderLabel");
      await AsyncStorage.removeItem("selectedGroupLabels");
      await AsyncStorage.removeItem("selectedEmploymentLabel");
      await AsyncStorage.removeItem("initialtoken");
      selectedStatusInCanadaVar(null);
      selectedEmploymentStatusVar(null);
      selectedGenderVar(null);
      selectedEmploymentStatusVar(null);

      userData(null);
      AppliedPrograms([]);
      Snackbar.show({
        text: "Session Expired, Login again",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme.colors.error,
      });
    } else {
      console.log("Token is valid.");
    }

    return token;
  };

  useEffect(() => {
    gettoken();
  }, []);

  console.log(
    "services=========>>>",
    services.map((item) => item)
  );

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
  console.log("group====>>>>", user?.designatedGroupsID);
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          display: showMap ? "flex" : "none",
        }}
      >
        <ProgramsHeader prop={"initialScreen"} />

        <Text
          style={{
            marginHorizontal: 25,
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontWeight: "600",
            fontSize: 22,
            lineHeight: 22.61,
            letterSpacing: -1.3,
            marginTop: 10,
          }}
        >
          Please choose your areas of interest
        </Text>
        <ScrollView style={{ flex: 1 }}>
          {error && <Text>{error}</Text>}

          {/* Render services */}
          {!loading && !error && services.length > 0 && (
            <View style={styles.servicesContainer}>
              {services.map((service) => (
                <TouchableOpacity
                  onPress={() => toggleService(service.id, service.name)}
                  style={[
                    styles.serviceItem,
                    {
                      backgroundColor: isSelected(service.id)
                        ? "transparent"
                        : "transparent",
                    },
                  ]}
                >
                  <Image
                    source={{ uri: service.image }}
                    style={styles.serviceImage}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 40,
                      zIndex: 1000,
                    }}
                  >
                    {isSelected(service.id) && (
                      <View
                        style={{
                          borderColor:
                            service?.name === "Youth"
                              ? "rgba(224, 79, 57, 1)"
                              : service?.name === "Women's Services"
                              ? "rgba(96, 25, 84, 1)"
                              : service?.name === "Language"
                              ? "rgba(71, 93, 118, 1)"
                              : service?.name === "Newcomer"
                              ? "rgba(165, 0, 52, 1)"
                              : service?.name === "Employment"
                              ? "rgba(92, 184, 178, 1)"
                              : null,
                          borderWidth: 3,
                          borderRadius: 50,
                          height: 30,
                          width: 30,
                          backgroundColor: "white",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ProgrammeTick
                          color={
                            service?.name === "Employment"
                              ? "rgba(92, 184, 178, 1)"
                              : service?.name === "Newcomer"
                              ? "rgba(165, 0, 52, 1)"
                              : service?.name === "Language"
                              ? "rgba(71, 93, 118, 1)"
                              : service?.name === "Women's Services"
                              ? "rgba(96, 25, 84, 1)"
                              : service?.name === "Youth"
                              ? "rgba(224, 79, 57, 1)"
                              : "none"
                          }
                        />
                      </View>
                    )}
                  </View>
                  <SvgUri uri={service.image} height={120} />
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {Update?.length > 0 && (
            <Buttonn
              title={"Next"}
              ButtonStyle={{ marginTop: 0, height: 60, marginHorizontal: 20 }}
              onPress={handlePress}
            />
          )}
        </ScrollView>
      </SafeAreaView>

      <WebView
        style={styles.webView}
        javaScriptEnabled={true}
        containerStyle={{
          position: "absolute",
          bottom: 70, // Increase this value to move the icon up
          right: showMap ? 20 : 0, // Increase this value to move the icon left
          width: showMap ? 80 : "100%", // Increase size to show more of the icon
          height: showMap ? 80 : "85%", // Increase size to show more of the icon
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

export default Programs;

const styles = StyleSheet.create({
  webView: {
    backgroundColor: "transparent",
  },
  serviceImage: {},

  serviceItem: {
    width: "48%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  servicesContainer: {
    flexDirection: "row",

    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
