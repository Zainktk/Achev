import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onBoarding } from "../utils/GlobalVariables";
import { useTheme } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const OnboardA = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const hanldePress = async () => {
    await AsyncStorage.setItem("isShowOnborading", "false");
    let res = await AsyncStorage.getItem("isShowOnborading");
    onBoarding(res);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/2.png")}
          style={styles.image}
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
          { fontFamily: theme.fonts.labelLarge.fontFamily, fontWeight: "800" },
        ]}
      >
        New to Canada?
      </Text>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.descriptionText,
            {
              fontFamily: theme.fonts.labelLarge.fontFamily,
            },
          ]}
        >
          Achēv’s newcomer settlement services can help you find employment and
          training, language referrals, get to know your community, and much
          more. Start your life in Canada here.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OnboardA;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    backgroundColor: "#A50034",
    height: height * 0.62,
    width: width * 2,
    borderBottomLeftRadius: width * 3,
    borderBottomRightRadius: width * 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: width * 1.15,
    height: height * 0.9,
    position: "absolute",
    top: -height * 0.22,
  },
  skipButton: {
    position: "absolute",
    top: height * 0.08,
    right: width * 0.55,
    zIndex: 10,
  },
  skipText: {
    color: "#FFFFFF",
    fontWeight: "400",
    fontSize: width * 0.04,
  },
  headerText: {
    position: "absolute",
    top: height * 0.13,
    right: width * 0.7,
    fontWeight: "800",
    fontSize: width * 0.07,
    color: "#FFFFFF",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.1,
    width: width * 1,
    marginLeft: "50%",
  },
  descriptionText: {
    color: "#776E64",
    fontWeight: "600",
    textAlign: "center",
    fontSize: width * 0.04,
    lineHeight: width * 0.06,
  },
});
