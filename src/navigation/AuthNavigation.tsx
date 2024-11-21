import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignupFlowNavigation from "./SignupFlowNavigation";
import { AuthRoutes } from "@types";
import ResetPasswordNavigation from "./ResetPasswordNavigation";
import { EmailScreen, Home, Login, OTPScreen } from "@screens";
import CompleteProfile from "./../screens/CompleteProfile";
import AppTabNaviagtor from "./dashboard/AppTabNaviagtor";
import UpdateOtp from "./../screens/UpdateOtp";
import Password from "./../screens/Login/Password";
import ConfirmPassword from "./../screens/ConfirmPassword";
import ForgotConfirm from "./../screens/ForgotConfirm";
import ForgotOtp from "./../screens/ForgotOtp";
import DobNote from "./../screens/Signup/DobNote";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthNavigation = () => {
  const Stack = createNativeStackNavigator<AuthRoutes>();
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="login"
        component={Login}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="signupFlow"
        children={SignupFlowNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="signup"
        component={EmailScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SetResetPasswordFlow"
        children={ResetPasswordNavigation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PasswordResetOTP"
        component={OTPScreen}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="ProfileCompletion"
        component={CompleteProfile}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        component={AppTabNaviagtor}
        name="home"
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="UpdateOtp"
        component={UpdateOtp}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PasswordScreen"
        component={Password}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ConfirmPasswordScreen"
        component={ConfirmPassword}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ForgotConfirmScreen"
        component={ForgotConfirm}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ForgotOtp"
        component={ForgotOtp}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="dobnote"
        component={DobNote}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;

const styles = StyleSheet.create({});
