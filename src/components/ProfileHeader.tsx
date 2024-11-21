import { BackButton } from "@utils";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { ScreenText } from "./atoms/Typography";

type Props = {
  handleNavigate: () => void;
  routeName: string;
};

const ProfileHeader = ({ handleNavigate, routeName }: Props) => {
  const routeToHeaderMapping: { [key: string]: string } = {
    editBio: "Edit Personal Information",
    accountSettings: "account settings",
    changePassword: "change password",
    changeEmail: "change email",
    changeEmailOtp: "change email",
    profileManagement: "Profile Management",
    rpJourney: "Reproductive Journey",
    updatedRpStatus: "Reproductive Process Options",
    deleteAccount: "Delete Account",
    subscribePlan: "Subscriptions",
    donorPreferences: "Donor Preferences",
    medicalSetBacks: "Medical Setbacks",
  };
  const theme = useTheme();
  return (
    <View
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
      }}
    >
      {routeName === "profileManagement" ? (
        <ScreenText
          styles={{ textTransform: "capitalize" }}
          label={`${routeToHeaderMapping[routeName]}`}
        />
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable
            hitSlop={{
              left: 10, // To increase press area on the left side
              right: 10, // To increase press area on the right side
              bottom: 10,
              top: 10,
            }}
            onPress={handleNavigate}
          >
            <BackButton fill={theme?.colors?.secondary} />
          </Pressable>
          <ScreenText
            styles={{ textTransform: "capitalize" }}
            label={`${routeToHeaderMapping[routeName]}`}
          />
          <View style={{ width: 50 }} />
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  textcenter: {
    alignItems: "flex-end",
  },
});
