import { ScreenText, ScreenTitle } from "@atoms";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Backarrow, BottomFlowers } from "@utils";

import { AuthHeader } from "@components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { AuthRoutes } from "@types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type Props = {
  children: React.ReactElement;
  navigation?: NativeStackNavigationProp<AuthRoutes>;
  routeName?: string;
};

const AuthLayout = ({ children, routeName, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const New = useNavigation<NativeStackNavigationProp<AuthRoutes>>();

  const title: { [key: string]: string } = {
    // login: "Login",
    signup: "sign up",
    PasswordResetEmail: "forgot password",
    PasswordResetOTP: "Authentication",
    changeEmailOtp: "Authentication",
    createPassword: "create new password",
  };

  const subtitle: { [key: string]: string } = {
    signup: "Please enter email address to continue",
    PasswordResetEmail: "Please entered your registered email address",
    login: "Please enter your details to login",
    PasswordResetOTP:
      "Please enter the 6 digit code we have sent your email address",
    changeEmailOtp:
      "Please enter the 6 digit code we have sent your email address",
    createPassword: "Type and confirm a secure new password for your account",
  };

  const handleNavigate = () => {
    console.log("back------>>>>");
    New?.goBack();
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 20,
        // paddingBottom: insets.bottom,
        // paddingLeft: insets.left,
        // paddingRight: insets.right,
        flexDirection: "column",
      }}
    >
      {routeName === "login" && (
        <View style={{ alignItems: "center" }}>
          <AuthHeader />
        </View>
      )}
      {routeName === "ForgotConfirmScreen" && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 80 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 40,
              width: 40,
              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 12,
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={handleNavigate}
          >
            <Backarrow />
          </TouchableOpacity>
          <AuthHeader />
        </View>
      )}

      <View
        style={{
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <View style={styles.labelsContainer}>
          <ScreenTitle
            label={title?.[routeName || ""]}
            styles={{
              ...{ textTransform: "capitalize" },
              ...(routeName === "login"
                ? {
                    marginTop: "20%",
                  }
                : {}),
            }}
          />
          {/* <ScreenText label={subtitle?.[routeName || ""]} /> */}
        </View>
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </View>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  labelsContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    marginTop: 40,
    flex: 2,
  },
  bottomLogo: {
    // marginTop: 30,
    alignItems: "center",
  },
});
