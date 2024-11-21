import { useReactiveVar } from "@apollo/client";
import {
  Buttonn,
  ButtonText,
  HelperText,
  Input,
  OutlinedButton,
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
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  initialToken,
  loginSchema,
  newUser,
  setLocalStorageItem,
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
  Platform,
  PermissionsAndroid,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AuthLayout from "../AuthLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import Snackbar from "react-native-snackbar";

type Props = NativeStackScreenProps<AuthRoutes, "login">;
// login input types
type LInputForm = {
  email: string;
};

const Login = ({ navigation, route }: Props) => {
  const New = useNavigation<NativeStackNavigationProp<AuthRoutes>>();
  const { LoginUser } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(loginSchema),
  });
  const log = useReactiveVar(LoggedInUser);
  const [isLoading, setisloading] = useState<boolean>(false);
  const newuser = useReactiveVar(newUser);
  const token = useReactiveVar(initialToken);
  const isDisabled = useWatchFields(watch);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const email = watch("email");
  const [showNote, setShowNote] = useState<boolean>(false);
  const [newtokendata, setNewtokendata] = useState({});

  const currentRoute = useNavigationState(
    (state) => state.routes[state.index]
  ).name;
  console.log("currentRoute====>>>>", currentRoute);
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

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setShowNote(!showNote);
  };

  const verifyEmail = async (email: string) => {
    setisloading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/user/verifyemail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
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
      console.log("Raw response body:", responseText);

      const result = responseText ? JSON.parse(responseText) : null;
      console.log("result:", result?.isActive);

      if (response.ok) {
        if (result?.id === 0) {
          New.navigate("signup", { email: email });
          setisloading(false);
        }
        if (result?.password === "") {
          New.navigate("ConfirmPasswordScreen", { email });
        } else if (result?.id > 0 && result?.password != "") {
          await AsyncStorage.setItem("initialtoken", token || "");
          navigation.navigate("PasswordScreen", {
            email: email,
          });
          setisloading(false);
        }
      } else {
        setisloading(false);
        console.error("Verification failed or no ID found");
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

      const data = await response.json();
      console.log("ta--->>>", data);
      const token = data.token;
      await AsyncStorage.setItem("initialtoken", `Bearer ${token}`);
      initialToken(token);
      console.log("data---------->>>>>>>", data);

      return token;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // useEffect(() => {
  //   login();
  // }, []);

  const getToken = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const expirationTime = await AsyncStorage.getItem("tokenExpirationTime");

      if (!token || !expirationTime || Date.now() >= Number(expirationTime)) {
        token = await login();
      }
      console.log("token----->>>>>", token);
      return token;
    } catch (error) {
      Snackbar.show({
        text: " sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
      console.error("Error getting token:", error);
      throw error;
    }
  };

  const handleSignIn = async (data: LInputForm) => {
    await verifyEmail(data.email); // Call verifyEmail with the form email
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <AuthLayout routeName={route.name}>
          <View style={styles.container}>
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
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
            <View style={{ height: 50, marginTop: 40 }}>
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
                  <Text style={{ color: "#5CB8B2", fontWeight: "700" }}>
                    Note:
                  </Text>{" "}
                  <Text style={{ fontWeight: "600" }}>
                    If you have previously accessed our services, please ensure
                    you are using the same email address you used to register
                  </Text>
                </Text>
              )}
            </View>
            <View style={styles.loginFieldsContainer}>
              <View>
                <ScreenText
                  label="Email Address"
                  styles={{ marginBottom: 10 }}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { value, onChange },
                    formState: { errors },
                  }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      multiline={false}
                      onBlur={() => setShowNote(false)}
                      onFocus={() => setShowNote(true)}
                    />
                  )}
                />
                {errors?.email?.message && (
                  <HelperText
                    styles={{ marginTop: 3 }}
                    label={errors?.email?.message}
                  />
                )}
              </View>
            </View>
            <View style={styles.loginButtonContainer}>
              <Buttonn
                disabled={isDisabled}
                title="Next"
                loading={isLoading}
                ButtonStyle={{ borderRadius: 10, marginTop: 15 }}
                onPress={handleSubmit(handleSignIn)}
              />
            </View>
          </View>
        </AuthLayout>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

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
    backgroundColor: "#F7FBFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5CB8B2",
    padding: 20,
  },
});
