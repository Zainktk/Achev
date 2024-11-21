import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Backarrow } from "@utils";
import { useTheme } from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import WebView from "react-native-webview";
import { LocationScreenFlowType } from "src/navigation/LocationNavigator";
import RenderHtml from "react-native-render-html";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";

const VenueDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const [getEvent, setGetEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const route = useRoute();
  const theme = useTheme();
  const scrollViewRef = useRef(null);
  const [showMap, setShowMap] = useState(true);

  // const source = {
  //   html: getEvent?.hours || "<p>No hours available</p>",
  // };

  const LocationStack =
    useNavigation<NativeStackNavigationProp<LocationScreenFlowType>>();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://achev.ca/wp-json/custom/v1/venues"
      );
      const venues = response.data;

      const desiredTitle = route?.params?.id;
      const venueToShow = venues.find(
        (venue: { title: string }) => venue?.title === route?.params?.id
      );

      if (venueToShow) {
        setGetEvent(venueToShow);
      } else {
        console.warn(`Venue with title "${desiredTitle}" not found`);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // const checkConsoleFunction = `
  //   (function() {
  //     window.checkConsole = function() {
  //       console.log("THISISATEST");
  //       window.ReactNativeWebView.postMessage("toggleMap");
  //     }
  //   })();
  //   window.checkConsole();
  // `;

  const stripHtmlTags = (html: string) => {
    return html ? html.replace(/<\/?[^>]+(>|$)/g, "") : "";
  };

  useEffect(() => {
    if (getEvent?.meta?._VenueLat && getEvent?.meta?._VenueLng) {
      console.log("Latitude:=========", getEvent?.meta._VenueLat[0]);
      console.log("Longitude:===========", getEvent?.meta._VenueLng[0]);
    }
  }, [getEvent]);

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
    <View style={{ flex: 1 }}>
      <View
        ref={scrollViewRef}
        style={{ flex: 1, paddingTop: insets.top + 10 }}
      >
        <ScrollView style={{ display: showMap === true ? null : "none" }}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 40,
              marginLeft: 20,
            }}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => LocationStack.goBack()}
            >
              <Backarrow />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "700",
                fontSize: 26,
                width: "70%",
              }}
            >
              {getEvent?.title}
            </Text>
          </View>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            mapType="terrain"
            initialRegion={{
              latitude: 43.65107,
              longitude: -79.347015,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            {getEvent?.meta?._VenueLat?.[0] &&
              getEvent?.meta?._VenueLng?.[0] && (
                <Marker
                  coordinate={{
                    latitude: parseFloat(getEvent.meta._VenueLat[0]),
                    longitude: parseFloat(getEvent.meta._VenueLng[0]),
                  }}
                />
              )}
          </MapView>
          <View
            style={{
              marginTop: 30,
              marginLeft: 30,
              gap: 20,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "800",
                fontSize: 16,
              }}
            >
              {getEvent?.title_data}
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              {getEvent?.address}
            </Text>
            <View style={{}}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                For long-distance calls:
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                {getEvent?.phone}
              </Text>
            </View>
            <View style={{}}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                Hours of Operation
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                {stripHtmlTags(getEvent?.hours)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <WebView
          style={styles.webView}
          javaScriptEnabled={true}
          containerStyle={{
            position: "absolute",
            top: showMap ? 430 : 0, // Adjust positioning as needed
            left: showMap ? 140 : 0,
            right: 0,
            bottom: showMap ? 0 : 0,
            zIndex: 10,
            backgroundColor: "transparent", // Ensure transparency

            // marginLeft: showMap ? 140 : 0,
            // marginTop: showMap ? 10 : 0,
            // marginBottom: showMap ? 5 : 0,
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
        background-color: transparent;
        overflow: hidden; 
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
      </View>
    </View>
  );
};

export default VenueDetailScreen;

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 50,
    height: 40,
    width: 40,
    shadowOpacity: 1,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  map: {
    width: "100%",
    height: 300,
    alignSelf: "center",
    marginTop: 20,
  },
  webViewContainer: {},
  webView: { backgroundColor: "transparent" },
});
