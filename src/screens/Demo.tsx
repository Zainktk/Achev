import { Buttonn } from "@atoms";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { LoggedInUser, clearData } from "@utils";
import { StyleSheet, View } from "react-native";
import ProfileLayoutSignupFlow from "./ProfileLayoutSignupFlow";
type Props = NativeStackScreenProps<AuthRoutes, "logout">;
const Demo = () => {
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

export default Demo;

const styles = StyleSheet.create({
  logoutContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
