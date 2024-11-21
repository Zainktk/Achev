import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider, useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { useNavigation } from "@react-navigation/native";
import { Backarrow, LinkSvg, NextArrow, ProfileSvg, userData } from "@utils";
import WebView from "react-native-webview";
import { useReactiveVar } from "@apollo/client";
import { Buttonn, OutlinedButton } from "@atoms";
import RBSheet from "react-native-raw-bottom-sheet";
import emailjs, { EmailJSResponseStatus, send } from "emailjs-com";

const RequestScreen = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [showMap, setShowMap] = useState(true);
  const user = useReactiveVar(userData);
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const rbSheetRef = useRef<RBSheet>(null);

  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const onpress = () => {
    openURL("https://forms.office.com/r/aTte1yfNNQ");

    rbSheetRef.current?.close();
    profileStack.navigate("removeAccount");
  };

  const onSubmit = async () => {
    try {
      await send(
        "service_uljyiok",
        "template_3y7zj7w",
        {
          name,
          email,
          message: "This is a static message",
        },

        "MN-SscwnFRkkHsYPcMYrN"
      );

      console.log("SUCCESS!");
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const openURL = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to open URL: " + url);
      console.error("Error opening URL:", error);
    }
  };

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
              Remove my Account
            </Text>
          </View>
        </View>

        <ScrollView style={{ flex: 2 }}>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#F7FBFA",
              borderRadius: 100,
              height: 160,
              width: 180,
              justifyContent: "center",
              alignSelf: "center",
              marginTop: 20,
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
              Hi, {user?.firstName}
            </Text>
          </View>
          <View style={{ marginTop: 40, marginHorizontal: 30, gap: 40 }}>
            <View>
              <Text
                style={{
                  color: "#000000",
                  lineHeight: 25,
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                Submitting this request will trigger the deletion of all of your
                personal, identifiable information and the removal of your
                account from the Achev online services system. Any additional,
                non-identifiable information may be anonymized and archived.
              </Text>
              <Text
                style={{
                  marginTop: 30,
                  color: "#000000",
                  lineHeight: 25,
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                You will no longer be able to login to any of Achev's online
                services, including this mobile app. Are you sure you want to
                request the removal of your account?
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
              gap: 40,
            }}
          >
            <OutlinedButton
              title={"Yes"}
              ButtonStyle={{
                borderTopEndRadius: 30,
                borderBottomEndRadius: 30,
                borderTopLeftRadius: 30,
                borderBottomLeftRadius: 30,
                width: 150,
              }}
              onPress={() => rbSheetRef.current?.open()}
            />
            <Buttonn
              title={"Cancel"}
              ButtonStyle={{
                borderTopEndRadius: 30,
                borderBottomEndRadius: 30,
                borderTopLeftRadius: 30,
                borderBottomLeftRadius: 30,
                width: 150,
              }}
            />
          </View>
        </ScrollView>
        <RBSheet
          ref={rbSheetRef}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: 400,
            },
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                gap: 30,
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "600",
                  fontSize: 24,
                }}
              >
                Are you sure you want to submitting this request to remove your
                Achēv account?
              </Text>
              <Buttonn
                title={"No, I’ve changed my mind"}
                onPress={() => rbSheetRef.current?.close()}
              />
              <OutlinedButton
                title={"Submit"}
                ButtonStyle={{
                  borderTopEndRadius: 30,
                  borderBottomEndRadius: 30,
                  borderTopLeftRadius: 30,
                  borderBottomLeftRadius: 30,
                  width: 300,
                }}
                onPress={onpress}
              />
            </View>
          </View>
        </RBSheet>
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

export default RequestScreen;

const styles = StyleSheet.create({
  webView: {
    backgroundColor: "transparent",
  },
});
