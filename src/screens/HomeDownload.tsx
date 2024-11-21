import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomedetailsHeader from "./../components/HomedetailsHeader";
import { useTheme } from "react-native-paper";
import { Calendar, Locationicon, userData } from "@utils";
import { Location } from "graphql";
import { OutlinedButton, Buttonn } from "@atoms";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNFetchBlob from "rn-fetch-blob";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import axios from "axios";
import { Buffer } from "buffer";
import RenderHTML from "react-native-render-html";
import { useReactiveVar } from "@apollo/client";
if (global.Buffer == null) {
  global.Buffer = Buffer;
}

const HomeDownload = () => {
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();
  const [showBottomView, setShowBottomView] = useState(false);
  const theme = useTheme();
  const route = useRoute();

  //useStateStartHere
  const [getEvent, setGetEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [getService, setGetService] = useState({});
  const [eventData, setEventData] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  const [FetchedeventData, setFetchedEventData] = useState([{}]);
  const user = useReactiveVar(userData);
  //useStateEndHere

  //functionStartHere

  const encodeBase64 = (str) => {
    return Buffer.from(str).toString("base64");
  };

  // const fetchServiceById = async () => {
  //   try {
  //     const username = "emaz@doerz.tech";
  //     const password = "ZeKfy!ngHBUkMVWNKIRdL2lQ";
  //     const authString = `${username}:${password}`;
  //     const encodedAuthString = encodeBase64(authString);
  //     const response = await axios.get(
  //       `https://achev.ca/wp-json/wp/v2/theme_services/${route?.params?.serviceId}`
  //     );

  //     console.log("responseservice------->>", response.data);
  //     setGetService(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(
  //       "Error fetching events:",
  //       error.response?.data || error.message
  //     );
  //     setLoading(false);
  //   }
  // };
  console.log("route?.params?.eventId---->>", route?.params?.eventId);

  console.log("route?.params?.serviceId---->>", route?.params?.serviceId);

  console.log("getevent---->>>", getEvent?.title);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `https://achev.ca/wp-json/tribe/events/v1/events/${route?.params?.eventId}`
      );

      console.log("response------->>", response.data);
      setGetEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  const fetch = async () => {
    try {
      const response = await axios.get(
        `https://achev.thedev.ca/wp-json/custom/v1/venues1`
      );

      console.log("response-------00009999000=====>>", response.data);

      setFetchedEventData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // fetchServiceById();
    fetch();
  }, []);
  console.log("route------>>>>", route);
  const onpress = () => {
    if (route?.params?.param === "eventdetail") {
      homeStack.canGoBack;
    }
    if (route?.params?.param === "home") {
      homeStack.canGoBack;
    }
  };
  //functionEndHere

  const startDate = new Date(getEvent?.start_date);
  const hours = String(startDate.getHours()).padStart(2, "0");
  const minutes = String(startDate.getMinutes()).padStart(2, "0");

  const endDate = new Date(getEvent?.end_date);
  const endhours = String(endDate.getHours()).padStart(2, "0");
  const endminutes = String(endDate.getMinutes()).padStart(2, "0");

  console.log("hetttt====>", getEvent?.venue?.address);

  console.log("getService----->>>>>", getService);

  // const Download = () => {
  //   RNFetchBlob.config({
  //     // add this option that makes response data to be stored as a file,
  //     // this is much more performant.
  //     fileCache: true,
  //   })
  //     .fetch("GET", "http://www.example.com/file/example.zip", {
  //       //some headers ..
  //     })
  //     .then((res) => {
  //       // the temp file path
  //       console.log("The file saved to ", res.path());
  //     });
  // };

  const generatePDF = async () => {
    const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .title { font-size: 24px; font-weight: bold; }
          .date { font-size: 18px; margin-top: 10px; }
          .venue { font-size: 16px; margin-top: 10px; }
          .description { font-size: 14px; margin-top: 20px; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <h1 class="title">${getEvent.title}</h1>
        <img src="${getEvent.image?.url || ""}" alt="Event Image" />
        <div class="date">
          ${new Date(getEvent.start_date).toLocaleDateString()} 
          ${new Date(getEvent.start_date).toLocaleTimeString()} - 
          ${new Date(getEvent.end_date).toLocaleTimeString()}
        </div>
        <div class="venue">
          Venue: ${getEvent?.venue?.venue} 
        </div>
        <div class="description">
          ${getEvent?.description || ""}
        </div>
      </body>
    </html>
  `;

    try {
      const options = {
        html: htmlContent,
        fileName: "event_details",
        directory: "Documents",
      };
      const file = await RNHTMLtoPDF.convert(options);
      console.log("PDF generated at:", file.filePath);

      // Share the file
      const shareOptions = {
        title: "Share PDF",
        url: `file://${file.filePath}`,
        type: "application/pdf",
      };

      Share.open(shareOptions)
        .then((res) => console.log("Share success:", res))
        .catch((err) => console.error("Share error:", err));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const shareArticle = () => {
    const message = `
      Check out this event: ${getEvent?.title}
      Date: ${new Date(getEvent.start_date).toLocaleDateString()}
      Time: ${hours}:${minutes} - ${endhours}:${endminutes}
      Venue: ${getEvent?.venue?.venue}
      
      ${getEvent?.description || ""}
      More details: ${getEvent?.link || "N/A"}
    `;

    Share.open({
      title: `Share Event: ${getEvent?.title}`,
      message: message,
      url: getEvent?.image?.url, // Optional image URL
    })
      .then((res) => console.log("Share success:", res))
      .catch((err) => console.error("Share error:", err));
  };

  const handleDownloadPress = () => {
    generatePDF();
  };
  const stripHtmlTags = (text: string) => {
    return text?.replace(/<[^>]*>/g, "");
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{
          alignSelf: "center",
          justifyContent: "center",
          flex: 1,
        }}
      />
    );
  }
  console.log("Address---------------->>", getEvent?.venue);

  const obj = FetchedeventData.find(
    (item) => item.post_title === getEvent.title
  );
  console.log("obj==>", obj);
  const sendEmail = () => {
    const email = obj?.email; // Correct email
    const subject = `Registration for ${getEvent?.title}`;
    const body = "Your email body here";
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    if (Platform.OS === "ios") {
      Linking.canOpenURL(mailto)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(mailto);
          } else {
            console.error("Mail app is not configured to handle mailto URLs");
          }
        })
        .catch((err) =>
          console.error("Error occurred while sending email:", err)
        );
    }
    if (Platform.OS === "android") {
      Linking.openURL(
        `mailto:${obj?.email}?subject=Registration for ${
          getEvent?.title
        }&body=User firstname:${user?.firstName}\n User lastname:${
          user?.lastName
        }\nUser Email:${
          user?.email
        } \n Event Date:${startDate.getDay()}/${startDate.getMonth()}/${startDate.getFullYear()}\nEvent Time:${hours}:${minutes}`
      );
    }
  };
  const { width } = Dimensions.get("window");

  const renderPostContent = (content: string) => {
    const linkRegex = /https?:\/\/[^\s]+/g; // Regex to find URLs
    const parts = content.split(linkRegex);
    const links = content.match(linkRegex);

    return parts.map(
      (
        part:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | null
          | undefined,
        index: string | number
      ) => {
        // Render each part as a Text component
        const key = `part-${index}`;
        if (links && links[index]) {
          return (
            <Text key={key}>
              {part}
              <Text
                style={{ color: "blue", textDecorationLine: "underline" }}
                onPress={() => Linking.openURL(links[index])}
              >
                {links[index]}
              </Text>
            </Text>
          );
        }
        return <Text key={key}>{part}</Text>;
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <Image
            source={{ uri: getEvent?.image?.url }}
            style={{
              height: 200,
              width: 500,
            }}
          />
          <HomedetailsHeader
            onPressback={onpress}
            prop={""}
            backgroundcolor={""}
            shareArticle={shareArticle}
          />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "rgba(165, 0, 52, 1)",
                borderRadius: 50,
                height: 20,
                width: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            ></View>
            <Text
              style={{
                paddingHorizontal: 10,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              Newcomer Services
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: 15 }}>
          <Text
            style={{
              paddingHorizontal: 25,
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 24,
              fontWeight: "800",
              lineHeight: 30,
            }}
          >
            {getEvent.title}
          </Text>
          <View
            style={{
              width: "90%",
              backgroundColor: "rgba(244, 245, 246, 1)",
              alignSelf: "center",
              marginTop: 30,
              padding: 20,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#333" }}>
                Date & Time
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 8,
                }}
              >
                <Calendar />
                <Text
                  style={{ fontSize: 14, fontWeight: "400", color: "#555" }}
                >
                  {new Date(getEvent.start_date).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {new Date(getEvent.start_date).getDate()}{" "}
                  {new Date(getEvent.start_date).getFullYear()} {hours}:
                  {minutes} - {endhours}:{endminutes}
                </Text>
              </View>
            </View>

            {/* Venue Section */}
            <View style={{ marginBottom: 15 }}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#333",
                }}
              >
                Venue
              </Text>
              <Text
                style={{
                  textTransform: "capitalize",
                  fontSize: 14,
                  color: "#555",
                  marginTop: 5,
                }}
              >
                {getEvent?.venue?.slug}
              </Text>
            </View>

            {/* Location Section */}
            {getEvent?.venue?.venue === "Online" ? null : (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Locationicon />
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#333",
                  }}
                >
                  {getEvent?.venue?.address}
                </Text>
              </View>
            )}
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <RenderHTML
              source={{ html: obj?.post_content }}
              contentWidth={width}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <OutlinedButton
          title={"Download PDF"}
          ButtonStyle={{
            alignSelf: "flex-start",
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginHorizontal: 20,
            borderColor: "rgba(224, 79, 57, 1)",
          }}
          LabelStyle={{ color: "rgba(224, 79, 57, 1)" }}
          onPress={handleDownloadPress}
        />
        <TouchableOpacity
          style={{
            height: 55,
            width: 170,
            backgroundColor: "rgba(224, 79, 57, 1)",
            borderRadius: 40,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 15,
          }}
          onPress={sendEmail}
        >
          <Text
            style={{
              color: "white",
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Register Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeDownload;

const styles = StyleSheet.create({
  bottomView: {
    height: 90,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    shadowOpacity: 1,
    shadowColor: "rgba(0, 0, 0, 0.15)",
  },
});
