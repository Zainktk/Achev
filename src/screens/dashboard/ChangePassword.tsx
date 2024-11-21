import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Buttonn, HelperText, PasswordInput, ScreenText } from "@atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProfile, useWatchFields } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { changeCurrentPassword, globalSuccessMessageVariable } from "@utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProfileLayout from "../ProfileLayout";
type Props = NativeStackScreenProps<AuthRoutes, "changePassword">;

type ChangePasswordInputs = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};
const ChangePassword = ({ route, navigation }: Props) => {
  const height = Dimensions.get("window").height;
  const { UpdatePassword } = useProfile();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
    resolver: yupResolver(changeCurrentPassword),
  });
  const isDisabled = useWatchFields(watch);
  const onsubmit = async (values: ChangePasswordInputs) => {
    const { confirmPassword, currentPassword } = values;
    try {
      setLoading(true);
      const res = await UpdatePassword({
        newPassword: confirmPassword,
        currentPassword,
      });
      if (res) {
        globalSuccessMessageVariable({
          message: "Password Update Successfull",
        });
        setLoading(false);
        navigation.navigate("accountSettingsFlow", {
          screen: "accountSettings",
        });
      }
    } catch (err) {
      setLoading(false);
      reset();
      // globalErrorMessageVariable({
      //   message: "Current Password invalid",
      // });
      console.log(err);
    }
  };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <ProfileLayout navigation={navigation} routeName={route.name}>
            <View style={styles.passwordContainer}>
              <View>
                <ScreenText
                  styles={{ textTransform: "uppercase", marginBottom: 6 }}
                  label="CURRENT PASSWORD"
                />
                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field: { value, onChange } }) => (
                    <PasswordInput onChangeText={onChange} value={value} />
                  )}
                />
                {errors?.currentPassword?.message && (
                  <HelperText
                    styles={{ marginTop: 3 }}
                    label={errors?.currentPassword?.message}
                  />
                )}
              </View>
              <View>
                <ScreenText
                  styles={{ textTransform: "uppercase", marginBottom: 6 }}
                  label="CREATE NEW PASSWORD"
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <PasswordInput onChangeText={onChange} value={value} />
                  )}
                />
                {errors?.password?.message && (
                  <HelperText
                    styles={{ marginTop: 3 }}
                    label={errors?.password?.message}
                  />
                )}
              </View>
              <View>
                <ScreenText
                  styles={{ textTransform: "uppercase", marginBottom: 6 }}
                  label="CONFIRM NEW PASSWORD"
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { value, onChange } }) => (
                    <PasswordInput onChangeText={onChange} value={value} />
                  )}
                />
                {errors?.confirmPassword?.message && (
                  <HelperText
                    styles={{ marginTop: 3 }}
                    label={errors?.confirmPassword?.message}
                  />
                )}
              </View>
            </View>
            <View
              style={{ ...styles.buttonContainer, marginBottom: height * 0.06 }}
            >
              <Buttonn
                loading={loading}
                disabled={isDisabled}
                title="confirm"
                onPress={handleSubmit(onsubmit)}
              />
            </View>
          </ProfileLayout>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  passwordContainer: {
    flex: 2,
    gap: 20,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 100,
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
