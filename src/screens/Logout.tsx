import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Buttonn } from "@atoms";
import ProfileLayoutSignupFlow from "./ProfileLayoutSignupFlow";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { LoggedInUser, clearData, setLocalStorageItem } from "@utils";
type Props = NativeStackScreenProps<AuthRoutes, "logout">;
const Logout = ({ navigation, route }: Props) => {
  const handlePress = () => {
    LoggedInUser(null);
    clearData();
  };
  return (
    <ProfileLayoutSignupFlow screenNumber={4}>
      <View style={styles.logoutContainer}>
        <Buttonn
          title="logout"
          onPress={handlePress}
          LabelStyle={{ textTransform: "capitalize" }}
        />
      </View>
    </ProfileLayoutSignupFlow>
  );
};

export default Logout;

const styles = StyleSheet.create({
  logoutContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
