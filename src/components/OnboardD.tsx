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
import { Buttonn } from "./atoms/AppButtons";

const { width, height } = Dimensions.get("window");

const OnboardD = () => {
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
          source={require("../assets/images/4.png")}
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
          { fontFamily: theme.fonts.labelLarge.fontFamily },
        ]}
      >
        Need other support?
      </Text>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.descriptionText,
            {
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "600",
            },
          ]}
        >
          Achēv offers employment, settlement, language, women, youth and
          technology solutions services in the GTA, throughout Canada. No matter
          what kind of support you are looking for, start here with Achēv.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OnboardD;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    backgroundColor: "#E04F39",
    height: height * 0.53,
    width: width * 2,
    borderBottomLeftRadius: width * 3,
    borderBottomRightRadius: width * 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: width * 1.15,
    height: height * 0.7,
    position: "absolute",
    top: -height * 0.14,
  },
  skipButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: width * 0.05,
    position: "absolute",
    top: height * 0.09,
    right: width * 0.3,
  },
  skipText: {
    color: "#FFFFFF",
    fontWeight: "400",
    fontSize: width * 0.04,
    alignSelf: "center",
  },
  headerText: {
    position: "absolute",
    top: height * 0.13,
    right: width * 0.63,
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
    fontSize: 16,
    lineHeight: width * 0.06,
  },
});
