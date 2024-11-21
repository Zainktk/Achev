import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import OnboardA from "../components/OnboardA";
import OnboardB from "../components/OnboardB";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onBoarding } from "../utils/GlobalVariables";
import { assertListType } from "GraphQl";
import { Buttonn, SecondaryButton } from "@atoms";
import GestureRecognizer from "react-native-swipe-gestures";
import OnboardC from "../components/OnboardC";
import OnboardD from "../components/OnboardD";
import { Dimensions } from "react-native";

const OnboardingScreen = () => {
  const [step, setstep] = useState(0);
  const [showPreviewVideo, setShowPreviewVideo] = useState(true);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

  const handleSwipeLeft = async () => {
    if (step < 3) {
      setstep(step + 1);
    } else {
      await AsyncStorage.setItem("isShowOnborading", "false");
      let res = await AsyncStorage.getItem("isShowOnborading");
      onBoarding(res);
      // navigation.navigate('authStack', { screen: 'login' });
    }
  };
  const handleSwipeRight = async () => {
    if (step > 0) {
      setstep(step - 1);
    }
  };

  return (
    <GestureRecognizer
      onSwipeLeft={handleSwipeLeft}
      style={styles.container}
      onSwipeRight={handleSwipeRight}
    >
      <View style={styles.contentContainer}>
        {step === 0 && <OnboardA />}
        {step === 1 && <OnboardB />}
        {step === 2 && <OnboardC />}
        {step === 3 && <OnboardD />}
      </View>

      <View style={styles.footerContainer}>
        <View
          style={[
            styles.dotsContainer,
            { marginVertical: step === 3 ? 10 : height * 0.05 },
          ]}
        >
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.dotStyle,
                step === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {step === 3 ? (
        <View>
          <Buttonn
            title={"Next"}
            ButtonStyle={{
              marginHorizontal: 20,
              marginBottom: 30,
            }}
            onPress={handleSwipeLeft}
          />
        </View>
      ) : null}
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
  },
  dotStyle: {
    height: 10,
    width: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#776E64",
  },
  inactiveDot: {
    backgroundColor: "rgba(217, 217, 217, 1)",
  },
  footerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
});

export default OnboardingScreen;
