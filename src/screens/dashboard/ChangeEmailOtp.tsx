import { useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import { Text, useTheme } from "react-native-paper";

import { useReactiveVar } from "@apollo/client";
import { Button, ButtonText, HelperText, ScreenText } from "@atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin, useProfile, useSignup, useWatchFields } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  IsForgotPasswordFlow,
  MutationVerifyArgs,
  ResendOtp,
  UserEmail,
  VerificationToken,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
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
import AuthLayout from "../AuthLayout";

type Props =
  | NativeStackScreenProps<AuthRoutes, "PasswordResetOTP">
  | NativeStackScreenProps<AuthRoutes, "changeEmailOtp">;
const CELL_COUNT = 6;
const otpSchema = Yup.object({
  otp: Yup.string().required("OTP is required").min(CELL_COUNT),
});

const ChangeEmailOtp = ({ route, navigation }: Props) => {
  const { SendResetCode } = useLogin();
  const { SendVerificationCode } = useSignup();
  const isForgotPassword = useReactiveVar(IsForgotPasswordFlow);
  const verificationToken = useReactiveVar(VerificationToken);
  const email = useReactiveVar(UserEmail);
  const graphqlError = useReactiveVar(globalErrorMessageVariable);
  const [value, setValue] = useState("");
  const height = Dimensions.get("window").height;
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState("");
  const [showTimer, setshowTimer] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { UpdateEmail } = useProfile();
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
        try {
          const res = await UpdateEmail({ token: verifiedToken });
          if (res?.data?.updateEmail) {
            setLoading(false);
            globalSuccessMessageVariable({ message: "Email Updated" });
            globalErrorMessageVariable({ message: null });
            navigation.navigate("accountSettingsFlow", {
              screen: "accountSettings",
            });
          }
        } catch (err) {
          console.log(err);
        }
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
  const handleChange = (value: string) => {
    let otp = getValues("otp");
    if (otp.length === CELL_COUNT) {
      Keyboard.dismiss();
    }
  };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={{ flex: 1 }}>
        <AuthLayout routeName={route.name} navigation={navigation}>
          <View style={styles.OTPContainer}>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, value } }) => (
                <CodeField
                  ref={ref}
                  {...props}
                  // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                  value={value}
                  onChangeText={(value) => {
                    onChange(value);
                    handleChange(value);
                  }}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="numeric"
                  textContentType="oneTimeCode"
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      style={{
                        ...styles.cell,
                        borderColor: theme?.colors?.divider,
                      }}
                      key={index}
                    >
                      <Text
                        key={index}
                        style={[
                          theme?.fonts?.bodySmall,
                          styles.textInput,
                          isFocused && styles.focusCell,
                          {
                            color: isDarkMode
                              ? theme?.colors?.secondary
                              : theme?.colors?.secondary,
                          },
                        ]}
                        onLayout={getCellOnLayoutHandler(index)}
                      >
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />
              )}
            />

            {errors?.otp?.message && (
              <HelperText
                styles={{ marginTop: 3 }}
                label={errors?.otp?.message}
              />
            )}
            <View
              style={{
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {showTimer ? (
                <ScreenText color={theme?.colors?.primary} label={timer} />
              ) : (
                <>
                  <TouchableOpacity onPress={handleResendOtp}>
                    <View
                      style={{
                        backgroundColor: theme?.colors?.primary,
                        padding: 10,
                        borderRadius: 50,
                        marginBottom: 5,
                      }}
                    >
                      <ResendOtp />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <ButtonText label="Resend OTP" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View
            style={{
              ...styles.VerifyButtonContainer,
              marginBottom: height * 0.06,
            }}
          >
            <Button
              disabled={isDisabled}
              loading={loading}
              title="verify"
              ButtonStyle={{ borderRadius: 10 }}
              onPress={handleSubmit(onSubmitLoginForm)}
            />
          </View>
        </AuthLayout>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChangeEmailOtp;

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
  },
  OTPContainer: {
    gap: 20,
    flex: 1,
  },
  focusCell: {
    borderColor: "#000",
  },

  FieldsContainer: {
    gap: 20,
    flex: 1,
  },

  VerifyButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  VerifyButton: {
    padding: 20,
  },
});
