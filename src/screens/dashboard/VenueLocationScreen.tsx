import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Filtericon } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LocationScreenFlowType } from "src/navigation/LocationNavigator";
import { useTheme } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import FilterLocations from "../../components/FilterLocations";
import SelectLocation from "../../components/SelectLocation";
import SelectServices from "../../components/SelectServices";
import { Buttonn } from "@atoms";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";
import WebView from "react-native-webview";

const VenueLocationScreen = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectvenue, setSelectedvenue] = useState("");
  const [selectedDays, setSelectedDays] = useState("");
  const [venuePress, setvenuePress] = useState(false);
  const [originalEvents, setOriginalEvents] = useState<any[]>([]);
  const [dayPress, setdayPress] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [CityPress, setCityPress] = useState(false);
  const [dimOpacity, setDimOpacity] = useState(0);
  const [isDatafiltered, setisDatafiltered] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const insets = useSafeAreaInsets();

  const serviceMapping = {
    "515": "Language Services",
    "512": "Employment Services - Job Seeker",
    "522": "Newcomer Services",
    "510": "Employment Services - Employer",
  };

  const LocationStack =
    useNavigation<NativeStackNavigationProp<LocationScreenFlowType>>();

  const theme = useTheme();

  const categoriesArray = events?.map((item) => ({
    ...item,
    category: item.category.split(","),
  }));

  const category = categoriesArray.map((item) => item?.category);

  console.log(
    "categorynew=======>>>>>>>>",
    category.map((item) => item)
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://achev.ca/wp-json/theme/v1/locations"
        );
        const venues = response.data;

        setEvents(venues);
        setOriginalEvents(venues);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCalloutPress = (id: number) => {
    LocationStack.navigate("VenueDetails", {
      id: id,
    });
  };

  const onpressVenue = () => {
    setvenuePress(true);
  };

  const onpressCity = () => {
    setCityPress(true);
  };

  const onpressDay = () => {
    setdayPress(true);
  };

  const rbSheetRef = useRef<RBSheet>(null);
  const onPressFilter = () => {
    setShowFilterModal(!showFilterModal);
    setDimOpacity(showFilterModal ? 0 : 0.5);
    if (rbSheetRef.current) {
      rbSheetRef.current.open();
    }
  };

  const filterEvents = () => {
    let filtered = originalEvents;

    if (selectedDays) {
      console.log("Filtering by day:=====>>>>>", selectedDays);
      filtered = filtered.filter((event) => {
        setisDatafiltered(true);
        console.log("Event days:", event.category);
        return event.category.includes(selectedDays);
      });
    }
    if (selectvenue) {
      console.log("Filtering by venue:=====>>>>>", selectvenue);
      filtered = filtered.filter((event: any) => {
        setisDatafiltered(true);
        console.log(
          "Event venue:====>>>>>>>>>>>>>>>>>>>>>>>>>>>",
          event?.title_data
        );

        return event?.title_data === selectvenue;
      });
    }

    setFilteredEvents(filtered);
  };

  console.log(
    "originalEvents ----==========------->>>>",
    category?.map((item) => item.map((itam: any) => itam === selectedDays))
  );

  const onPressApplyfilter = () => {
    filterEvents();
    setShowFilterModal(!showFilterModal);
    setDimOpacity(showFilterModal ? 0 : 0.5);
    if (rbSheetRef.current) {
      rbSheetRef.current.close();
    }
  };

  const onpressVenueListBack = () => {
    setvenuePress(false);
  };

  const onpressDayListBack = () => {
    setdayPress(false);
  };
  const Resetfilter = () => {
    let filtered = originalEvents;
    setFilteredEvents(filtered);
    setSelectedDays("");
    setSelectedvenue("");
    setisDatafiltered(false);
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
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 26,
              fontWeight: "700",
            }}
          >
            Our Locations
          </Text>
          <TouchableOpacity
            style={{
              height: 30,
              width: 80,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#776E64",
            }}
            onPress={onPressFilter}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Filtericon />
              <Text>Filter</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 16,
              fontWeight: "400",
              marginHorizontal: 20,
              marginTop: 20,
            }}
          >
            Click on an Achēv Location to see hours, contact info, and link to
            transit routes.
          </Text>
        </View>

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType="terrain"
          initialRegion={{
            latitude: 43.6532,
            longitude: -79.3832,
            latitudeDelta: 0.9,
            longitudeDelta: 0.9,
          }}
        >
          {filteredEvents.length > 0
            ? filteredEvents.map((item) => (
                <Marker
                  key={item.title}
                  coordinate={{
                    latitude: Number(item?.lat),
                    longitude: Number(item?.lng),
                  }}
                >
                  <Callout onPress={() => handleCalloutPress(item?.title)}>
                    <View style={{ padding: 5, height: 80 }}>
                      <Text
                        style={{
                          fontFamily: theme.fonts.labelLarge.fontFamily,
                          color: "#776E64",
                          fontWeight: "800",
                          fontSize: 16,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text style={{ marginTop: 10 }}>{item.address}</Text>
                    </View>
                  </Callout>
                </Marker>
              ))
            : events.map((item) => (
                <Marker
                  key={item.title}
                  coordinate={{
                    latitude: Number(item?.lat),
                    longitude: Number(item?.lng),
                  }}
                >
                  <Callout onPress={() => handleCalloutPress(item?.title)}>
                    <View style={{ padding: 5, height: 80 }}>
                      <Text
                        style={{
                          fontFamily: theme.fonts.labelLarge.fontFamily,
                          color: "#776E64",
                          fontWeight: "800",
                          fontSize: 16,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text style={{ marginTop: 10 }}>{item.address}</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
        </MapView>
        <View
          style={{
            position: "absolute",
            bottom: 20,
            alignSelf: "center",
            right: 68,
          }}
        >
          {isDatafiltered && (
            <TouchableOpacity
              style={{
                width: "115%",
                height: 50,
                borderRadius: 30,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                borderWidth: 2,
                borderColor: "#776E64",
              }}
              onPress={Resetfilter}
            >
              <Text
                style={{
                  color: "#776E64",
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Reset Filter
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{}}>
          <RBSheet
            ref={rbSheetRef}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: venuePress ? 630 : dayPress ? 450 : 350,
              },
            }}
          >
            {venuePress ? (
              <View style={{ marginTop: 15 }}>
                <SelectLocation
                  onpressVenueListBack={onpressVenueListBack}
                  setSelectedvenue={setSelectedvenue}
                  selectvenue={selectvenue}
                  filteredEvents={filteredEvents}
                />
              </View>
            ) : dayPress ? (
              <SelectServices
                onpressDayListBack={onpressDayListBack}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                filteredEvents={[]}
              />
            ) : (
              <View style={{ marginTop: 20 }}>
                <FilterLocations
                  onPressBack={onPressFilter}
                  onpressVenue={onpressVenue}
                  onPressApplyfilter={onPressApplyfilter}
                  onpressDay={onpressDay}
                  onpressCity={onpressCity}
                  selectedDays={selectedDays}
                  selectvenue={selectvenue}
                  setShowFilterModal={setShowFilterModal}
                  Resetfilter={Resetfilter}
                />
              </View>
            )}
          </RBSheet>
        </View>
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

export default VenueLocationScreen;

const styles = StyleSheet.create({
  container: {},
  map: {
    width: "100%",
    height: "100%",
    marginTop: 30,
  },
  webView: {
    backgroundColor: "transparent",
  },
});
