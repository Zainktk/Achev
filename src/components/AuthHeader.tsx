import { AchievLogin, BackButton } from "@utils";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
type Props = {};
const AuthHeader = () => {
  const theme = useTheme();
  return (
    <View>
      <View style={{}}>
        <AchievLogin />
      </View>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({});
