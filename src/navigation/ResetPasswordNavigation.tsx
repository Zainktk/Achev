import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { EmailScreen, OTPScreen, PasswordScreen } from "@screens";
import { AuthRoutes } from "@types";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
type Props = NativeStackScreenProps<AuthRoutes, "SetResetPasswordFlow">;

const ResetPasswordNavigation = ({ route, navigation }: Props) => {
  const Stack = createNativeStackNavigator<AuthRoutes>();
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="PasswordResetEmail"
        component={EmailScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PasswordResetOTP"
        component={OTPScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="createPassword"
        component={PasswordScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="createPassword"
        component={PasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default ResetPasswordNavigation;

const styles = StyleSheet.create({});
