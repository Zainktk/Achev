import { Dimensions, StyleSheet, View } from "react-native";

import { ScreenText, ScreenTitle } from "@atoms";
import { AcheiveSplashLogo, SplashScreenLogo } from "@utils";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import achevLogoAnimate from "../assets/achev-logo-animate-v1 (1).json";

const SplashScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const height = Dimensions.get("window").height;

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.logoContainer}>
        <LottieView
          source={achevLogoAnimate}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titlesContainer: {
    width: "80%",
    flex: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
});
