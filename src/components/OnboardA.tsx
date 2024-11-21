import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onBoarding } from "../utils/GlobalVariables";
import { Achevicon } from "@utils";

const { width, height } = Dimensions.get("window");

const OnboardA = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hanldePress = async () => {
    await AsyncStorage.setItem("isShowOnborading", "false");
    let res = await AsyncStorage.getItem("isShowOnborading");
    onBoarding(res);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.imageContainer}>
        <View style={styles.curvedContainer}>
          <Image
            source={require("../assets/images/Maskgroup.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={hanldePress}>
          <Text
            style={[
              styles.skipText,
              { fontFamily: theme.fonts.labelLarge.fontFamily },
            ]}
          >
            Skip
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.headerText,
            {
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "800",
            },
          ]}
        >
          Welcome to Achēv!
        </Text>
        <View
          style={{
            position: "absolute",
            top: height * 0.13,
            right: width * 0.3,
          }}
        >
          <Achevicon height={200} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.text,
            { fontFamily: theme.fonts.labelLarge.fontFamily },
          ]}
        >
          Achēv provides programs and services to create faster paths to
          prosperity for our diverse clients. We connect people with
          opportunities and provide the resources & guidance you need to achieve
          your goals.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    fontWeight: "800",
    fontSize: width * 0.07,
    color: "#FFFFFF",
    position: "absolute",
    top: height * 0.05,
    right: width * 0.2,
  },
  imageContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  curvedContainer: {
    width: "140%",
    height: "100%",
    backgroundColor: "#776E64",
    borderBottomLeftRadius: width * 0.6,
    borderBottomRightRadius: width * 0.6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
  },
  text: {
    color: "#776E64",
    fontWeight: "600",
    textAlign: "center",
    fontSize: width * 0.045,
    lineHeight: width * 0.06,
  },
  skipButton: {
    position: "absolute",
    top: height * 0.03,
    right: width * 0.03,
    zIndex: 10,
  },
  skipText: {
    color: "#FFFFFF",
    fontWeight: "400",
    fontSize: width * 0.04,
  },
});

export default OnboardA;
