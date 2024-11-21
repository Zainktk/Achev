import { BackButton } from "@utils";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { ScreenText } from "./atoms/Typography";

type Props = {
  handleNavigate: () => void;
  routeName: string;
  screenNumber: number;
};

const ProfileHeaderSignUpFlow = ({
  handleNavigate,
  routeName,
  screenNumber,
}: Props) => {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
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
        styles={
          routeName === "selectGender"
            ? {
                marginLeft: 50,
                textAlign: "center",
              }
            : {}
        }
        label="Setup  your account"
      />
      <ScreenText label={`Step ${screenNumber} of 3`} />
    </View>
  );
};

export default ProfileHeaderSignUpFlow;

const styles = StyleSheet.create({
  textcenter: {
    alignItems: "flex-end",
  },
});
