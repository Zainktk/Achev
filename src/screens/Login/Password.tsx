import { useReactiveVar } from "@apollo/client";
import {
  Buttonn,
  ButtonText,
  Input,
  OutlinedButton,
  PasswordInput,
  ScreenText,
} from "@atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin, useWatchFields } from "@hooks";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  LoggedInUser,
  MutationLoginArgs,
  PassowordSchema,
  getLocalStorageItem,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  loginSchema,
  newUser,
  setLocalStorageItem,
  userData,
  userToken,
} from "@utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AuthLayout from "../AuthLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import PasswordScreen from "../ResetPasswordScreen";
import Snackbar from "react-native-snackbar";
import {
  initialToken,
  NotifiScreenVisited,
  User,
} from "../../utils/GlobalVariables";

type Props = NativeStackScreenProps<AuthRoutes, "login">;
// login input types
type LInputForm = {
  password: string;
};

const Password = ({ navigation, route }: Props) => {
  const New = useNavigation<NativeStackNavigationProp<AuthRoutes>>();
  const { LoginUser } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: { password: "" },
    resolver: yupResolver(PassowordSchema),
  });
  const log = useReactiveVar(LoggedInUser);
  const [isLoading, setisloading] = useState<boolean>(false);
  const newuser = useReactiveVar(newUser);
  const isDisabled = useWatchFields(watch);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const email = watch("email");
  const [showNote, setShowNote] = useState<boolean>(false);
  const token = useReactiveVar(initialToken);

  const onSubmitLoginForm = async (values: LInputForm) => {
    const { email } = values;

    try {
      setisloading(true);
      const formattedEmail = email.trim().toLowerCase();
      const variables: MutationLoginArgs = {
        user: { email: formattedEmail },
      };

      const res = await LoginUser(variables);

      if (res.data?.login.user.id) {
        globalErrorMessageVariable({ message: null });
        globalSuccessMessageVariable({ message: "Login Successful" });
        LoggedInUser(res.data.login);
        setLocalStorageItem(res.data.login);
        await AsyncStorage.setItem("token", res.data.login.token);
        userToken(res.data.login.token);
        navigation.navigate("home");
      }
    } catch (err) {
      setisloading(false);
      reset();
      console.error("Login error:", err);
    }
  };
  console.log("route.params----------->>>>>>>>", route?.params?.email);
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };

  const verifyEmail = async (password: string) => {
    setisloading(true);
    try {
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: route?.params?.email, password }),
        }
      );

      if (!response.ok) {
        console.error("Response failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        setisloading(false);
        return;
      }
      const responseText = await response.text();

      console.log("Raw response body:=====>>>>", response.headers);

      const result = responseText ? JSON.parse(responseText) : null;
      console.log("result====-----=>>>", result);
      console.log("Verification response:========>>>>>>1", response);
      await AsyncStorage.setItem("responseText", responseText);
      const user: User = JSON.parse(responseText);
      userData(user);

      if (result.id > 0) {
        await AsyncStorage.setItem("token", token || "");
        // const notifiScreenVisitedValue = await AsyncStorage.getItem(
        //   "NotifiScreenVisited"
        // );
        // console.log("NotifiScreenVisited=====>>>>", notifiScreenVisitedValue);
        // const isNotifiScreenVisited = notifiScreenVisitedValue === "true";
        // NotifiScreenVisited(isNotifiScreenVisited);
        setisloading(false);
        userToken(token);
      } else {
        setisloading(false);
        setShowNote(true);
        Snackbar.show({
          text: "Please enter correct password.",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme?.colors?.error,
        });
      }
    } catch (error) {
      setisloading(false);
      console.error("Error verifying email:", error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/odoo/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "achev",
            password:
              "1TsraPAKp2fbV4x3vjtrhjtEa1QH0i9uBtwI45SKLZTY88MWEVdlI17epOM8pDBw8Cx5HJuOOUr4WOlXx8Nc6AZkBXyqauKc2IE20KIEEqii9zVRopgdCPZkVEfwoOQK",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
      }

      const data = response;
      console.log("data---------->>>>>>>", data);
    } catch (error) {
      Snackbar.show({
        text: " sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const getToken = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const expirationTime = await AsyncStorage.getItem("tokenExpirationTime");

      if (!token || !expirationTime || Date.now() >= Number(expirationTime)) {
        token = await login();
      }

      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  const handleSignIn = async (data: LInputForm) => {
    console.log("========>>>>>>>>>>>");
    await verifyEmail(data.password);
  };

  const onPressForgot = () => {
    navigation.navigate("ForgotConfirmScreen", {
      email: route.params?.email,
    });
  };

  const onpress = () => {
    navigation.goBack();
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <AuthLayout routeName={route.name} onpress={onpress}>
          <View style={styles.container}>
            <View style={{ alignSelf: "center", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelMedium.fontFamily,
                  fontSize: 26,
                  fontWeight: "800",
                  color: "#000000",
                }}
              >
                Welcome to Achev
              </Text>
            </View>

            <View style={{ height: 50, marginTop: 65 }}>
              {showNote && (
                <Text
                  style={[
                    styles.note,
                    {
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      fontSize: 14,
                      lineHeight: 17.5,
                    },
                  ]}
                >
                  <Text style={{ color: "#E25A45", fontWeight: "700" }}>
                    ERROR:
                  </Text>
                  <Text style={{ fontWeight: "600" }}>
                    The password you have entered is incorrect, please enter it
                    again, or reset using the “forgot password” link below
                  </Text>
                </Text>
              )}
            </View>

            <View style={styles.loginFieldsContainer}>
              <View>
                <ScreenText label="Password" styles={{ marginBottom: 10 }} />
                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { value, onChange },
                    formState: { errors },
                  }) => (
                    <PasswordInput
                      value={value}
                      onChangeText={onChange}
                      multiline={false}
                      error={errors?.password?.message}
                    />
                  )}
                />
              </View>
            </View>
            <View style={styles.loginButtonContainer}>
              <Buttonn
                disabled={isDisabled}
                title="Sign in"
                loading={isLoading}
                ButtonStyle={{ borderRadius: 10, marginTop: 15 }}
                onPress={handleSubmit(handleSignIn)} // Call handleSignIn on button press
              />
              <TouchableOpacity
                style={{ marginTop: 5 }}
                onPress={onPressForgot}
              >
                <ButtonText
                  label="Forgot your password?"
                  styles={{
                    textAlign: "center",

                    marginTop: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </AuthLayout>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  loginFieldsContainer: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 20,
  },
  forgotPasswordButton: {
    alignItems: "flex-end",
  },
  loginButtonContainer: {
    marginBottom: "35%",
    marginTop: 20,
  },
  note: {
    color: "black",
    marginTop: 5,
    fontSize: 12,
    height: 100,
    width: "100%",
    backgroundColor: "#FAF3F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E25A45",
    padding: 20,
  },
});
