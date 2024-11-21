import { useReactiveVar } from "@apollo/client";
import { ProfileHeaderSignUpFlow } from "@components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { BottomFlowers, RpStatus } from "@utils";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ProgressBar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactElement;
  navigation?: NativeStackNavigationProp<AuthRoutes>;
  routeName?: string;
  screenNumber?: number;
};
const ProfileLayoutSignupFlow = ({
  children,
  screenNumber,

  routeName,
  navigation,
}: Props) => {
  const rpStatus = useReactiveVar(RpStatus);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const progress = screenNumber && screenNumber * 0.3333;
  const handleNavigate = () => {
    if (routeName == "medicalSetBacks" && !rpStatus) {
      navigation?.navigate("selectReproductiveProcess", { screenNumber: 3 });
      return;
    } else if (routeName == "userInfo") {
      navigation?.navigate("signup");
      return;
    }
    navigation?.goBack();
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 20,
        // paddingBottom: insets.bottom,
      }}
    >
      <ProfileHeaderSignUpFlow
        screenNumber={screenNumber || 0}
        routeName={routeName || ""}
        handleNavigate={handleNavigate}
      />
      <View>
        <ProgressBar progress={progress} color={theme?.colors?.primary} />
      </View>

      <View style={styles.profileContainer}>{children}</View>

      <View>
        <BottomFlowers />
      </View>
    </View>
  );
};

export default ProfileLayoutSignupFlow;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});
