import { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
  Text,
  Clipboard,
} from "react-native";
import { useTheme } from "react-native-paper";

import { useReactiveVar } from "@apollo/client";
import {
  Buttonn,
  ButtonText,
  HelperText,
  OutlinedButton,
  ScreenText,
  ScreenTitle,
  TextLinkButton,
} from "@atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin, useSignup, useWatchFields } from "@hooks";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  Backarrow,
  ClipBoard,
  IsForgotPasswordFlow,
  MutationVerifyArgs,
  ResendOtp,
  UserEmail,
  VerificationToken,
  VerifiedToken,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  userData,
} from "@utils";
import { Controller, useForm } from "react-hook-form";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Snackbar from "react-native-snackbar";
import * as Yup from "yup";
import AuthLayout from "./AuthLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { useNavigation } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  valueCanada: Yup.number().required("Status in Canada is required"),
  valueEmployment: Yup.number().required("Employment Status is required"),
  valueGender: Yup.number().required("Gender is required"),
  valueGroup: Yup.number().required("Designated Group is required"),
});

const CELL_COUNT = 4;
const otpSchema = Yup.object({
  otp: Yup.string().required("OTP is required").min(CELL_COUNT),
});

const ChangePasswordOtp = ({ route, navigation }: Props) => {
  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const { SendResetCode } = useLogin();
  const { SendVerificationCode } = useSignup();
  const isForgotPassword = useReactiveVar(IsForgotPasswordFlow);
  const verificationToken = useReactiveVar(VerificationToken);
  const email = useReactiveVar(UserEmail);
  const graphqlError = useReactiveVar(globalErrorMessageVariable);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState("");
  const [showTimer, setshowTimer] = useState(false);
  const user = useReactiveVar(userData);
  const [copiedText, setCopiedText] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const height = Dimensions.get("window").height;
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { Verifycode } = useSignup();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue: setOtpValue,
  } = useForm<{ otp: string }>({
    defaultValues: { otp: "" },
    resolver: yupResolver(otpSchema),
  });
  const isDarkMode = useColorScheme() === "dark";
  const isDisabled = useWatchFields(watch);
  const theme = useTheme();
  const userr = useReactiveVar(userData);

  const onSubmitLoginForm = async (values: { otp: string }) => {
    try {
      setLoading(true);

      const variables: MutationVerifyArgs = {
        code: values.otp,
        token: verificationToken,
      };
      const res = await Verifycode(variables);

      if (res?.data?.verify) {
        const verifiedToken = res?.data?.verify?.token;
        VerifiedToken(res?.data?.verify?.token);
        setLoading(false);
        globalSuccessMessageVariable({ message: "Email Verified" });
        globalErrorMessageVariable({ message: null });
        navigation.navigate("createPassword", { verifiedToken });
      }
    } catch (err) {
      setOtpValue("otp", "");
      setLoading(false);
    }
  };

  const StartTimer = () => {
    setOtpValue("otp", "");
    setshowTimer(true);
    let startingtTime = 90;
    let time = Math.floor(startingtTime / 60) + ":" + (startingtTime % 60);

    let timeDurationArray = time.split(":");
    let seconds = Number(timeDurationArray[1]);
    let minutes = Number(timeDurationArray[0]);
    setTimer(`0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);

    const IntervalForOtp = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      }
      if (seconds <= 0) {
        seconds = 59;
        minutes--;
      }
      if (minutes < 1) {
        seconds--;
        minutes = 0;
      }
      if (minutes == 0 && seconds == 0) {
        setshowTimer(false);
        seconds = 0;
        minutes = 0;
        clearInterval(IntervalForOtp);
      }
      setTimer(`0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
    }, 1000);
  };
  const handleResendOtp = async () => {
    if (isForgotPassword) {
      try {
        const res = await SendResetCode({ email });

        let verificationToken = res.data?.sendResetVerificationCode?.token;

        if (verificationToken) {
          VerificationToken(verificationToken);
          globalSuccessMessageVariable({
            message: "Reset Verification Code sent to  email",
          });
          globalErrorMessageVariable({ message: null });
        }
      } catch (err) {
        throw err;
      }
    } else {
      try {
        const res = await SendVerificationCode({ email });

        let verificationToken = res.data?.sendVerificationCode?.token;
        if (verificationToken) {
          VerificationToken(verificationToken);
          globalSuccessMessageVariable({
            message: "Verification Code sent to  email",
          });
          globalErrorMessageVariable({ message: null });
        }
        // VerificationToken(verificationToken);
      } catch (err) {
        Snackbar.show({
          text: graphqlError.message || "",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme?.colors?.error,
        });
        // setLoading(false);
      }
    }
    StartTimer(); // start otp expiry time
  };
  // const handleChange = (value: string) => {
  //   let otp = getValues("otp");
  //   if (otp.length === CELL_COUNT) {
  //     Keyboard.dismiss();
  //   }
  // };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  const handleViewCopiedText = async () => {
    setOtpValue("otp", copiedText);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCopiedText();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpSubmit = async () => {
    const otpValue = getValues("otp");
    console.log("otpval-------->>>>", otpValue);
    if (otpValue.length === CELL_COUNT) {
      try {
        const token = await getToken();
        setLoading(true);

        const response = await axios({
          method: "PUT",
          url: "https://oneclientapi.achev.ca/api/user/activate",
          data: {
            Email: userr?.email, // Email from route params
            RmdCode: otpValue, // OTP value
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("response---->>>>>", response.data);

        if (response.data === 1) {
          globalSuccessMessageVariable({
            message: "Password changed successfully",
          });
          profileStack.navigate("MainProfile");
        }
        if (response.data === 0) {
          Snackbar.show({
            text: "Please enter a valid OTP.",
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: theme?.colors?.error,
          });
        }
      } catch (error) {
        // Handle error
        Snackbar.show({
          text: "Failed to activate. Please try again.",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme?.colors?.error,
        });
      } finally {
        setLoading(false);
      }
    } else {
      Snackbar.show({
        text: "Please enter a valid OTP.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
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
      const token = data.token;
      console.log("data---------->>>>>>>", data);
      const expirationTime = Date.now() + data.expiresIn * 10000; // Assuming `expiresIn` is in seconds

      if (token && expirationTime) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem(
          "tokenExpirationTime",
          expirationTime.toString()
        );
      }

      return token;
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
  const Resend = async () => {
    try {
      const token = await getToken();
      const response = await axios({
        method: "PUT",
        url: "https://oneclientapi.achev.ca/api/user/regeneratecode",
        data: {
          Email: userr?.email,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        globalSuccessMessageVariable({ message: "OTP sent successfully" });
      }
    } catch (error) {
      Snackbar.show({
        text: "Error resending otp.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.OTPContainer}>
          <View style={{ paddingHorizontal: 20, gap: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  shadowColor: "rgba(0, 0, 0, 0.25)",
                  borderRadius: 50,
                  height: 50,
                  width: 50,

                  shadowOpacity: 1,
                  shadowRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                }}
                onPress={() => navigation.goBack()}
              >
                <Backarrow />
              </TouchableOpacity>
              <ScreenTitle
                label={"Confirmation code"}
                styles={{ marginLeft: 20 }}
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  marginLeft: 15,
                }}
              >
                Enter the 4-digit code was sent to your email
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                }}
              >
                {user?.email}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: "5%",
              borderColor: theme.colors.primary,
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
              height: "25%",
              width: "80%",
              alignSelf: "center",
              borderRadius: 25,
            }}
          >
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, value } }) => (
                <CodeField
                  value={value}
                  onChangeText={(inputValue) => {
                    onChange(inputValue);
                    setValue(inputValue);
                  }}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  renderCell={({ index, symbol, isFocused }) => (
                    <Text
                      key={index}
                      style={[
                        [
                          styles.cell,
                          {
                            color: "black",
                            fontWeight: "700",

                            borderColor: theme.colors.primary,
                            fontFamily: "ProductSans-Regular",
                            borderWidth: 2,
                          },
                        ],
                        isFocused && [
                          styles.focusCell,
                          {
                            color: theme.colors.primary,
                            borderColor: theme.colors.primary,
                          },
                        ],
                      ]}
                      onLayout={getCellOnLayoutHandler(index)}
                    >
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  )}
                />
              )}
            />
            <View>
              {errors?.otp?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.otp?.message}
                />
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={{}}>Paste from clipboard</Text>
              <TouchableOpacity
                onPress={handleViewCopiedText}
                style={{ marginHorizontal: 10 }}
              >
                <ClipBoard />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              marginTop: 60,
            }}
          >
            <Buttonn
              title={"Continue"}
              LabelStyle={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontWeight: "700",
                fontSize: 16,
              }}
              ButtonStyle={{ paddingHorizontal: 50 }}
              onPress={handleSubmit(handleOtpSubmit)}
            />
            <TextLinkButton
              title={"Resend Code"}
              labelStyle={{
                color: "#776E64",
                fontSize: 16,
                fontWeight: "700",
                marginTop: 20,
              }}
              styles={{ color: "#776E64" }}
              onPress={Resend}
            />
          </View>
        </View>
        <View
          style={{
            ...styles.VerifyButtonContainer,
            marginBottom: route.name === "changeEmailOtp" ? height * 0.06 : 20,
          }}
        ></View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ChangePasswordOtp;

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  textInput: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 38,
  },
  cell: {
    width: 40,
    height: 40,
    borderBottomWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    fontSize: 24,
    lineHeight: 38,
    marginHorizontal: 10,
  },
  OTPContainer: {
    gap: 20,
    flex: 1,
  },
  focusCell: {
    borderColor: "#000",
    borderWidth: 4,
  },

  forgotPasswordButton: {
    alignItems: "flex-end",
  },

  VerifyButtonContainer: {
    marginBottom: 20,
  },
  VerifyButton: {
    padding: 20,
  },
});
