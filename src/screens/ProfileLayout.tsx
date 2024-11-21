import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";

import { ProgressBar, useTheme } from "react-native-paper";
import { ProfileHeader, ScreenText, ScreenTitle } from "@components";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactElement;
  navigation?: NativeStackNavigationProp<AuthRoutes>;
  routeName?: string;
  screenNumber?: number;
};
const ProfileLayout = ({ children, routeName, navigation }: Props) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleNavigate = () => {
    navigation?.goBack();
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 20,
      }}
    >
      <ProfileHeader
        routeName={routeName || ""}
        handleNavigate={handleNavigate}
      />

      <ProgressBar progress={1} color={theme?.colors?.primary} />
      <View style={styles.profileContainer}>{children}</View>
    </View>
  );
};

export default ProfileLayout;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  labelsContainer: { flex: 1, justifyContent: "flex-end" },
  contentContainer: {
    marginTop: 40,
    flex: 2,
  },
});
