import { Button, Input, ScreenText } from "@atoms";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useSignup, useWatchFields } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  UserEmail,
  VerificationToken,
  changeEmail,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
} from "@utils";
import ProfileLayout from "../ProfileLayout";

type Props = NativeStackScreenProps<AuthRoutes, "changeEmail">;

const ChangeEmail = ({ route, navigation }: Props) => {
  const height = Dimensions.get("window").height;
  const { SendVerificationCode } = useSignup();
  const [loading, setLoading] = useState<boolean>(false);

  const onsubmit = async ({
    email,
  }: {
    email: string;
    matchedEmail: String;
  }) => {
    UserEmail(email);
    const formattedEmail = email.trim().toLocaleLowerCase();
    try {
      setLoading(true);
      const res = await SendVerificationCode({ email: formattedEmail });

      let verificationToken = res.data?.sendVerificationCode?.token;

      if (verificationToken) {
        VerificationToken(verificationToken);

        globalSuccessMessageVariable({
          message: "Verification Code sent to  email",
        });
        globalErrorMessageVariable({ message: null });

        setLoading(false);
        navigation.navigate("changeEmailOtp");
      }
    } catch (err) {
      reset();
      setLoading(false);
    }
  };

  const {
    control,
    handleSubmit,

    watch,
    reset,
  } = useForm({
    defaultValues: { email: "", matchedEmail: "" },
    resolver: yupResolver(changeEmail),
  });
  const isDisabled = useWatchFields(watch);
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={{ flex: 1 }}>
        <ProfileLayout navigation={navigation} routeName={route.name}>
          <View style={{ flex: 1 }}>
            <View style={styles.emailContainer}>
              <View>
                <ScreenText
                  styles={{ textTransform: "uppercase", marginBottom: 5 }}
                  label="new email"
                />
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Input
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </View>
              <View>
                <ScreenText
                  styles={{ textTransform: "uppercase", marginBottom: 5 }}
                  label="confirm new email"
                />
                <Controller
                  control={control}
                  name="matchedEmail"
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Input
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </View>
            </View>
            <View
              style={{ ...styles.buttonContainer, marginBottom: height * 0.06 }}
            >
              <Button
                loading={loading}
                disabled={isDisabled}
                title="confirm"
                onPress={handleSubmit(onsubmit)}
              />
            </View>
          </View>
        </ProfileLayout>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChangeEmail;
const styles = StyleSheet.create({
  emailContainer: {
    flex: 2,
    gap: 20,
  },

  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    // marginBottom: 20,
  },
});
