import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AppliedPrograms,
  ContactLinksvg,
  Designated,
  NextArrow,
  NotifiScreenVisited,
  ProfileSvg,
  PushEnabled,
  notificationVar,
  selectedDesignatedGroupsVar,
  selectedEmploymentStatusVar,
  selectedGenderVar,
  selectedStatusInCanadaVar,
  userData,
  userToken,
} from "@utils";
import { useReactiveVar } from "@apollo/client";
import { Divider, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { OutlinedButton } from "@components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const ProfileManagement = () => {
  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();
  const userr = useReactiveVar(userData);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [showMap, setShowMap] = useState(true);

  const onlogout = async () => {
    await AsyncStorage.removeItem("token");
    userToken(null);
    await AsyncStorage.removeItem("responseText");
    await AsyncStorage.removeItem("designated");
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("appliedPrograms");
    await AsyncStorage.removeItem("selectedCanadaLabel");
    await AsyncStorage.removeItem("selectedGenderLabel");
    await AsyncStorage.removeItem("selectedGroupLabels");
    await AsyncStorage.removeItem("selectedEmploymentLabel");
    await AsyncStorage.removeItem("initialtoken");
    await AsyncStorage.removeItem("pushEnabled");
    await AsyncStorage.removeItem("NotifiScreenVisited");
    PushEnabled(null);

    selectedStatusInCanadaVar(null);
    selectedEmploymentStatusVar(null);
    NotifiScreenVisited(undefined);
    selectedGenderVar(null);
    Designated(null);
    selectedDesignatedGroupsVar(null);
    userData(null);
    AppliedPrograms([]);
  };

  const onpressProf = () => {
    profileStack.navigate("profile");
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: insets.top + 10,
          display: showMap ? "flex" : "none",
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentContainer}>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#F7FBFA",
                borderRadius: 100,
                height: "25%",
                width: "45%",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <ProfileSvg />
            </View>
            <View style={{ alignSelf: "center", marginTop: 40 }}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "700",
                  fontSize: 24,
                }}
              >
                Hi, {userr?.firstName}
              </Text>
            </View>

            {/* Profile Section */}
            <View style={styles.sectionContainer}>
              <TouchableOpacity style={styles.row} onPress={onpressProf}>
                <Text
                  style={[
                    styles.sectionText,
                    { fontFamily: theme.fonts.labelLarge.fontFamily },
                  ]}
                >
                  Profile
                </Text>
                <TouchableOpacity onPress={onpressProf}>
                  <NextArrow />
                </TouchableOpacity>
              </TouchableOpacity>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => profileStack.navigate("myPrograms")}
              >
                <Text
                  style={[
                    styles.sectionText,
                    { fontFamily: theme.fonts.labelLarge.fontFamily },
                  ]}
                >
                  My Programs
                </Text>
                <TouchableOpacity
                  onPress={() => profileStack.navigate("myPrograms")}
                >
                  <NextArrow />
                </TouchableOpacity>
              </TouchableOpacity>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => profileStack.navigate("notifScreen")}
              >
                <Text
                  style={[
                    styles.sectionText,
                    { fontFamily: theme.fonts.labelLarge.fontFamily },
                  ]}
                >
                  Notifications
                </Text>
                <TouchableOpacity
                  onPress={() => profileStack.navigate("notifScreen")}
                >
                  <NextArrow />
                </TouchableOpacity>
              </TouchableOpacity>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => profileStack.navigate("privacyPolicy")}
              >
                <Text
                  style={[
                    styles.sectionText,
                    { fontFamily: theme.fonts.labelLarge.fontFamily },
                  ]}
                >
                  Privacy & Security
                </Text>
                <TouchableOpacity
                  onPress={() => profileStack.navigate("privacyPolicy")}
                >
                  <NextArrow />
                </TouchableOpacity>
              </TouchableOpacity>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => profileStack.navigate("Password")}
              >
                <Text
                  style={[
                    styles.sectionText,
                    { fontFamily: theme.fonts.labelLarge.fontFamily },
                  ]}
                >
                  Change Password
                </Text>
                <TouchableOpacity
                  onPress={() => profileStack.navigate("Password")}
                >
                  <NextArrow />
                </TouchableOpacity>
              </TouchableOpacity>
              <Divider style={styles.divider} />
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  Linking.openURL(
                    "https://achev.ca/contact-us/#wpcf7-f6-p25-o1"
                  );
                }}
              >
                <Text
                  style={[
                    styles.sectionText,
                    {
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  Contact Us
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      "https://achev.ca/contact-us/#wpcf7-f6-p25-o1"
                    );
                  }}
                >
                  <ContactLinksvg />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>

          {/* Button at the bottom */}
          <View style={{ justifyContent: "flex-end", marginTop: 20, flex: 1 }}>
            <OutlinedButton
              title={"LOG OUT"}
              onPress={onlogout}
              ButtonStyle={styles.button}
            />
          </View>
        </ScrollView>
      </View>
      <WebView
        style={styles.webView}
        javaScriptEnabled={true}
        containerStyle={{
          position: "absolute",
          bottom: 50,
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

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  webView: {
    backgroundColor: "transparent",
  },
  sectionContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionText: {
    color: "#000000",
    fontWeight: "400",
    fontSize: 16,
  },
  divider: {
    backgroundColor: "#776E64",
    borderWidth: 0.4,
    marginTop: 10,
  },
  button: {
    borderRadius: 30,
    borderColor: "#776E64",
    borderWidth: 1,
    marginHorizontal: 15,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
  },
});

export default ProfileManagement;
