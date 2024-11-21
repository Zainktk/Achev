import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backarrow, LinkSvg, NextArrow } from "@utils";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { useNavigation } from "@react-navigation/native";
import { Divider, useTheme } from "react-native-paper";

const PrivacyPolicy = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const openURL = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to open URL: " + url);
      console.error("Error opening URL:", error);
    }
  };
  return (
    <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
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
            Privacy & Security
          </Text>
        </View>
      </View>
      <ScrollView style={{ flex: 2 }}>
        <View style={{ marginLeft: 15, marginTop: 20 }}>
          <Text
            style={{
              color: "#000000",
              lineHeight: 20.8,
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "400",
              fontSize: 16,
              width: "100%",
            }}
          >
            Achēv values your privacy and the protection of your personal
            information. We always comply with the requirements of applicable
            privacy legislation. That means, among other things, that:
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 10 }}>{`\u25CF`}</Text>
            <Text
              style={{
                marginLeft: 10,
                color: "#000000",
                lineHeight: 20.8,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
                width: "95%",
              }}
            >
              we clearly state the purposes for which we process personal data.
              We do this by means of our privacy policy;
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 10 }}>{`\u25CF`}</Text>
            <Text
              style={{
                marginLeft: 10,
                color: "#000000",
                lineHeight: 20.8,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
                width: "95%",
              }}
            >
              we aim to limit our collection of personal data to only the
              personal data required for legitimate purposes;
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 10 }}>{`\u25CF`}</Text>
            <Text
              style={{
                marginLeft: 10,
                color: "#000000",
                lineHeight: 20.8,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
                width: "95%",
              }}
            >
              we first request your consent to process your personal data;
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 10 }}>{`\u25CF`}</Text>
            <Text
              style={{
                marginLeft: 10,
                color: "#000000",
                lineHeight: 20.8,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              we take appropriate security measures to protect your personal
              data;
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 10 }}>{`\u25CF`}</Text>
            <Text
              style={{
                marginLeft: 10,
                color: "#000000",
                lineHeight: 20.8,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
                width: "93%",
              }}
            >
              we only retain your data as long for as long as required based on
              the purposes for which consent was given;
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 10 }}>{`\u25CF`}</Text>
            <Text
              style={{
                marginLeft: 10,
                color: "#000000",
                lineHeight: 20.8,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              we respect your right to access your personal data or have it
              corrected or deleted, at your request.
            </Text>
          </View>
          <View style={{ marginTop: 20, width: "100%" }}>
            <Text
              style={{
                color: "#000000",
                lineHeight: 20.8,
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              Please take a look at our Privacy Policy and Terms of Use for more
              information. If you have any questions, please contact us.
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 40, marginHorizontal: 30, gap: 40 }}>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => openURL("https://achev.ca/terms-use/")}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                Terms of Use
              </Text>
              <TouchableOpacity
                onPress={() => openURL("https://achev.ca/terms-use/")}
              >
                <LinkSvg />
              </TouchableOpacity>
            </TouchableOpacity>
            <Divider
              style={{
                backgroundColor: "#776E64",
                borderWidth: 0.4,
                marginTop: 10,
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() =>
                openURL("https://achev.ca/privacy-statement-canada/")
              }
            >
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                Privacy Policy
              </Text>
              <TouchableOpacity
                onPress={() =>
                  openURL("https://achev.ca/privacy-statement-canada/")
                }
              >
                <LinkSvg />
              </TouchableOpacity>
            </TouchableOpacity>
            <Divider
              style={{
                backgroundColor: "#776E64",
                borderWidth: 0.4,
                marginTop: 10,
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => openURL("https://achev.ca/contact-us/#contactus")}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "400",
                  fontSize: 16,
                }}
              >
                Contact Us
              </Text>
              <TouchableOpacity
                onPress={() =>
                  openURL("https://achev.ca/contact-us/#contactus")
                }
              >
                <LinkSvg />
              </TouchableOpacity>
            </TouchableOpacity>
            <Divider
              style={{
                backgroundColor: "#776E64",
                borderWidth: 0.4,
                marginTop: 10,
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 30,
            }}
            onPress={() => profileStack.navigate("requesetToRemove")}
          >
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                color: "#000000",
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              Request to Remove my Account
            </Text>
            <TouchableOpacity
              onPress={() => profileStack.navigate("requesetToRemove")}
            >
              <NextArrow />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({});
