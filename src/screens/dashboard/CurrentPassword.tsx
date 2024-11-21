import { PasswordInput, ScreenText } from "@atoms";
import { StyleSheet, View } from "react-native";

const CurrentPassword = () => {
  return (
    <View>
      <ScreenText
        styles={{ textTransform: "uppercase", marginBottom: 10 }}
        label="CURRENT PASSWORD"
      />
      <PasswordInput />
    </View>
  );
};

export default CurrentPassword;

const styles = StyleSheet.create({});
