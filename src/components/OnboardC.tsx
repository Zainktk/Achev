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

const OnboardC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const hanldePress = async () => {
    await AsyncStorage.setItem("isShowOnborading", "false");
    let res = await AsyncStorage.getItem("isShowOnborading");
    onBoarding(res);
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/3.png")}
          style={styles.image}
        />
      </View>

      <Text
        style={[
          styles.headerText,
          { fontFamily: theme.fonts.labelLarge.fontFamily, fontWeight: "800" },
        ]}
      >
        Looking for employment?
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
          Whether you are looking for your first job, a career change or more
          success with your job search, Achēv can help you land your next
          opportunity.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OnboardC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    backgroundColor: "#5CB8B2",
    height: height * 0.62,
    width: width * 2,
    borderBottomLeftRadius: width * 3,
    borderBottomRightRadius: width * 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "40%",
    height: "50%",
    position: "absolute",
    top: 150,
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
    right: width * 0.6,
    fontWeight: "800",
    fontSize: 26,
    color: "#FFFFFF",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.05,
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
