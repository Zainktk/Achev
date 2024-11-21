import { StyleSheet, Text, View } from "react-native";

import { Buttonn, ScreenText } from "@atoms";
import { useTheme } from "react-native-paper";
import ProfileLayoutSignupFlow from "./ProfileLayoutSignupFlow";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { LoggedInUser, clearData } from "@utils";

type Props = NativeStackScreenProps<AuthRoutes, "ConfirmLogout">;
const ConfirmLogout = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const handleSubmit = (value: string) => {
    if (value === "yes") {
      clearData();
      LoggedInUser(null);
      navigation.navigate("login");
    } else {
      navigation.navigate("medicalSetBacksCatogaries");
    }
  };
  return (
    <ProfileLayoutSignupFlow>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            ...styles.confirmLogoutContainer,
            borderWidth: 1,
            borderColor: theme?.colors?.outline,
          }}
        >
          <ScreenText
            label="Are you you sure you want to logout?"
            styles={{
              fontSize: theme?.fonts?.labelMedium?.fontSize,
              marginBottom: 15,
              textAlign: "center",
            }}
          />
          <View
            style={{
              ...styles.buttonsContainer,
            }}
          >
            <Buttonn
              //   disabled={!(checked === "yes" || checked === "no")}
              title="Yes"
              ButtonStyle={{ borderRadius: 10 }}
              onPress={() => handleSubmit("yes")}
            />
            <Buttonn
              //   disabled={!(checked === "yes" || checked === "no")}
              title="No"
              ButtonStyle={{ borderRadius: 10 }}
              onPress={() => handleSubmit("yes")}
            />
          </View>
        </View>
      </View>
    </ProfileLayoutSignupFlow>
  );
};

export default ConfirmLogout;

const styles = StyleSheet.create({
  confirmLogoutContainer: {
    paddingVertical: 50,
    paddingHorizontal: 100,
    borderRadius: 40,
    justifyContent: "center",
  },

  buttonsContainer: {
    gap: 15,
  },
  boxCheck: {
    // marginTop: Platform.OS === "ios" ? hp(0.4) : hp(0),
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    // marginRight: 40,
  },
});
