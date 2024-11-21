import { useReactiveVar } from "@apollo/client";
import { Button, HelperText, PasswordInput, ScreenText } from "@atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin, useWatchFields } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  IsForgotPasswordFlow,
  MutationResetPasswordArgs,
  UserPassword,
  Userinfo,
  createPassword,
  globalSuccessMessageVariable,
} from "@utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "react-native-paper";
import AuthLayout from "./AuthLayout";
type Props =
  | NativeStackScreenProps<AuthRoutes, "createPassword">
  | NativeStackScreenProps<AuthRoutes, "ResetPassword">;
type CreatePasswordInput = {
  password: string;
  confirmPassword: string;
};
const PasswordScreen = ({ route, navigation }: Props) => {
  const isForgotPassword = useReactiveVar(IsForgotPasswordFlow);
  const { verifiedToken } = route?.params;
  const [loading, setLoading] = useState<boolean>(false);

  const { ResetPassword } = useLogin();
  const user = useReactiveVar(Userinfo);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatePasswordInput>({
    defaultValues: { password: "", confirmPassword: "" },
    resolver: yupResolver(createPassword),
  });
  const theme = useTheme();
  const isDisable = useWatchFields(watch);
  const onSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const { password } = values;
    UserPassword(password);
    Userinfo({ ...user, password });
    if (isForgotPassword) {
      try {
        setLoading(true);
        const variables: MutationResetPasswordArgs = {
          newPassword: password,
          token: verifiedToken,
        };
        const res = await ResetPassword(variables);
        if (res?.data?.resetPassword) {
          globalSuccessMessageVariable({ message: "Password Updated" });
          setLoading(false);
          navigation.navigate("login");
          return;
        }
      } catch (err) {
        return;
      }
    }
    navigation.reset({
      index: 0,
      routes: [
        { name: "signupFlow", params: { screen: "userInfo", isEdit: false } },
      ],
    });
  };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <AuthLayout routeName={route.name} navigation={navigation}>
            <View style={styles.FieldsContainer}>
              <View>
                <ScreenText
                  label="password"
                  styles={{ textTransform: "uppercase", marginBottom: 5 }}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <PasswordInput value={value} onChangeText={onChange} />
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
                  label="confirm password"
                  styles={{ textTransform: "uppercase", marginBottom: 5 }}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { value, onChange } }) => (
                    <PasswordInput value={value} onChangeText={onChange} />
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
            <View style={styles.ConfirmButtonContainer}>
              <Button
                disabled={isDisable}
                loading={loading}
                title="confirm"
                ButtonStyle={{ borderRadius: 10 }}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </AuthLayout>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  FieldsContainer: {
    gap: 20,
    flex: 2,
  },

  ConfirmButtonContainer: {
    justifyContent: "flex-end",
    flex: 1,
    marginBottom: 20,
  },
});
