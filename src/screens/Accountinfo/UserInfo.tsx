import { useReactiveVar } from "@apollo/client";
import { Buttonn, Checkbox, HelperText, Input, ScreenText } from "@atoms";
import { useProfile, useSignup, useWatchFields } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  Calender,
  LoggedInUser,
  MutationUserSignupArgs,
  UserPassword,
  VerificationToken,
  VerifiedToken,
  createUserInfo,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  setLocalStorageItem,
} from "@utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { useTheme } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select/";
import ProfileLayoutSignupFlow from "../ProfileLayoutSignupFlow";

import { yupResolver } from "@hookform/resolvers/yup";
type Props = NativeStackScreenProps<AuthRoutes, "userInfo">;

type User = {
  firstName: string;
  lastName: string;
  nickName: string;
  emergencyNo: string;
  state: string;
  dob: Date | null;
  agreePrivacyPolicy?: boolean;
  emergencyContactName: string;
};
const UserInfo = ({ navigation, route }: Props) => {
  const { UserSignUp } = useSignup();
  const { screenNumber, isEdit } = route.params;

  const verifiedToken = useReactiveVar(VerifiedToken);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const password = useReactiveVar(UserPassword);
  const width = Dimensions.get("window").width;
  console.log("width", width);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm<User>({
    resolver: yupResolver(createUserInfo),
    defaultValues: {
      firstName: "",
      lastName: "",
      emergencyContactName: "",
      nickName: "",
      emergencyNo: "",
      state: "",
      dob: null,
      agreePrivacyPolicy: false,
    },
  });
  const isDisabled = useWatchFields(watch);

  const theme = useTheme();

  const onSubmitLoginForm = async (values: User) => {
    const {
      firstName,
      lastName,
      nickName,
      state,
      dob,
      emergencyNo,
      emergencyContactName,
    } = values;
    const variables: MutationUserSignupArgs = {
      profileDetails: {
        nickName,
        phone: emergencyNo,
        emergencyName: emergencyContactName,
        state,
        dob,
      },
      userDetails: {
        password,
        firstName,
        lastName,
      },
      token: verifiedToken,
    };

    try {
      setLoading(true);

      const res = await UserSignUp(variables);

      if (res?.data?.userSignup) {
        const loggedInUser = {
          token: res?.data?.userSignup.token,
          user: res?.data?.userSignup.user,
          profile: res?.data?.userSignup.profile,
        };
        setLocalStorageItem(loggedInUser);
        // LoggedInUser(loggedInUser);
        globalSuccessMessageVariable({
          message: "Signup Successfull",
        });
        globalErrorMessageVariable({ message: null });
        setLoading(false);
        VerifiedToken("");
        VerificationToken("");
        navigation.navigate("selectReproductiveProcess");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={{ flex: 1 }}>
        <ProfileLayoutSignupFlow
          navigation={navigation}
          screenNumber={screenNumber}
          routeName="userInfo"
        >
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 7 }}>
              <View style={{ flex: 1 }}>
                <View style={styles.FieldsContainer}>
                  <View>
                    <ScreenText
                      label="first Name"
                      styles={{ textTransform: "uppercase", marginBottom: 2 }}
                    />
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field: { value, onChange } }) => (
                        <Input value={value} onChangeText={onChange} />
                      )}
                    />
                    {errors?.firstName?.message && (
                      <HelperText
                        styles={{ marginTop: 3 }}
                        label={errors?.firstName?.message}
                      />
                    )}
                  </View>
                  <View>
                    <ScreenText
                      label="last name"
                      styles={{ textTransform: "uppercase", marginBottom: 2 }}
                    />
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field: { value, onChange } }) => (
                        <Input value={value} onChangeText={onChange} />
                      )}
                    />
                    {errors?.lastName?.message && (
                      <HelperText
                        styles={{ marginTop: 3 }}
                        label={errors?.lastName?.message}
                      />
                    )}
                  </View>
                  <View>
                    <ScreenText
                      label="nick name"
                      styles={{ textTransform: "uppercase", marginBottom: 2 }}
                    />
                    <Controller
                      control={control}
                      name="nickName"
                      render={({ field: { value, onChange } }) => (
                        <Input value={value} onChangeText={onChange} />
                      )}
                    />
                    {errors?.nickName?.message && (
                      <HelperText
                        styles={{ marginTop: 3 }}
                        label={errors?.nickName?.message}
                      />
                    )}
                  </View>
                  <View>
                    <ScreenText
                      label="emergency contact "
                      styles={{ textTransform: "uppercase", marginBottom: 2 }}
                    />
                    <Controller
                      control={control}
                      name="emergencyNo"
                      render={({ field: { value, onChange } }) => (
                        <Input
                          keyboardType="phone-pad"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                    {errors?.emergencyNo?.message && (
                      <HelperText
                        styles={{ marginTop: 3 }}
                        label={errors?.emergencyNo?.message}
                      />
                    )}
                  </View>
                  <View>
                    <ScreenText
                      label="emergency contact name"
                      styles={{ textTransform: "uppercase", marginBottom: 2 }}
                    />
                    <Controller
                      control={control}
                      name="emergencyContactName"
                      render={({ field: { value, onChange } }) => (
                        <Input value={value} onChangeText={onChange} />
                      )}
                    />
                    {errors?.emergencyContactName?.message && (
                      <HelperText
                        styles={{ marginTop: 3 }}
                        label={errors?.emergencyContactName?.message}
                      />
                    )}
                  </View>
                  <View>
                    <ScreenText
                      label="state"
                      styles={{ textTransform: "uppercase", marginBottom: 14 }}
                    />

                    <Controller
                      name="state"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <RNPickerSelect
                          value={value}
                          onValueChange={onChange}
                          items={[
                            { label: "Alabama", value: "Alabama" },
                            { label: "Alaska", value: "Alaska" },
                            { label: "Arizona", value: "Arizona" },
                            { label: "Arkansas", value: "Arkansas" },
                            { label: "California", value: "California" },
                            { label: "Colorado", value: "Colorado" },
                            { label: "Connecticut", value: "Connecticut" },
                            { label: "Delaware", value: "Delaware" },
                            { label: "Florida", value: "Florida" },
                            { label: "Georgia", value: "Georgia" },
                            { label: "Hawaii", value: "Hawaii" },
                            { label: "Idaho", value: "Idaho" },
                            { label: "Illinois", value: "Illinois" },
                            { label: "Indiana", value: "Indiana" },
                            { label: "Iowa", value: "Iowa" },
                            { label: "Kansas", value: "Kansas" },
                            { label: "Kentucky", value: "Kentucky" },
                            { label: "Louisiana", value: "Louisiana" },
                            { label: "Maine", value: "Maine" },
                            { label: "Maryland", value: "Maryland" },
                            { label: "Massachusetts", value: "Massachusetts" },
                            { label: "Michigan", value: "Michigan" },
                            { label: "Minnesota", value: "Minnesota" },
                            { label: "Mississippi", value: "Mississippi" },
                            { label: "Missouri", value: "Missouri" },
                            { label: "Montana", value: "Montana" },
                            { label: "Nebraska", value: "Nebraska" },
                            { label: "Nevada", value: "Nevada" },
                            { label: "New Hampshire", value: "New Hampshire" },
                            { label: "New Jersey", value: "New Jersey" },
                            { label: "New Mexico", value: "New Mexico" },
                            { label: "New York", value: "New York" },
                            {
                              label: "North Carolina",
                              value: "North Carolina",
                            },
                            { label: "North Dakota", value: "North Dakota" },
                            { label: "Ohio", value: "Ohio" },
                            { label: "Oklahoma", value: "Oklahoma" },
                            { label: "Oregon", value: "Oregon" },
                            { label: "Pennsylvania", value: "Pennsylvania" },
                            { label: "Rhode Island", value: "Rhode Island" },
                            {
                              label: "South Carolina",
                              value: "South Carolina",
                            },
                            { label: "South Dakota", value: "South Dakota" },
                            { label: "Tennessee", value: "Tennessee" },
                            { label: "Texas", value: "Texas" },
                            { label: "Utah", value: "Utah" },
                            { label: "Vermont", value: "Vermont" },
                            { label: "Virginia", value: "Virginia" },
                            { label: "Washington", value: "Washington" },
                            { label: "West Virginia", value: "West Virginia" },
                            { label: "Wisconsin", value: "Wisconsin" },
                            { label: "Wyoming", value: "Wyoming" },
                          ]}
                          // style={}
                        >
                          <View
                            style={{
                              borderBottomWidth: 1,
                              borderBottomColor: theme?.colors?.divider,
                              paddingVertical: 7,
                            }}
                          >
                            <ScreenText label={getValues("state")} />
                          </View>
                        </RNPickerSelect>
                      )}
                    />
                  </View>
                  <View>
                    <ScreenText
                      label="DOB"
                      styles={{ textTransform: "uppercase", marginBottom: 14 }}
                    />
                    <View>
                      <Controller
                        control={control}
                        name="dob"
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            modal
                            style={{ backgroundColor: "#fff" }}
                            maximumDate={new Date()}
                            mode="date"
                            theme="light"
                            open={open}
                            date={new Date(value)}
                            onCancel={() => setOpen(false)}
                            onConfirm={(date) => {
                              onChange(date);
                              setOpen(false);
                            }}
                          />
                        )}
                      />

                      <Pressable
                        onPress={() => setOpen(true)}
                        style={{
                          flexDirection: "row",
                          gap: 4,
                          alignSelf: "flex-start",
                        }}
                      >
                        <View
                          style={{
                            ...styles.dobString,
                            borderBottomColor: theme?.colors?.divider,
                          }}
                        >
                          <ScreenText
                            label={
                              !getValues("dob")
                                ? "MM"
                                : getValues("dob")
                                    ?.toLocaleDateString()
                                    .split("/")[1]
                            }
                          />
                        </View>
                        <View
                          style={{
                            ...styles.dobString,
                            borderBottomColor: theme?.colors?.divider,
                          }}
                        >
                          <ScreenText
                            label={
                              !getValues("dob")
                                ? "DD"
                                : getValues("dob")
                                    ?.toLocaleDateString()
                                    .split("/")[0]
                            }
                            styles={{}}
                          />
                        </View>
                        <View
                          style={{
                            ...styles.dobString,
                            borderBottomColor: theme?.colors?.divider,
                          }}
                        >
                          <ScreenText
                            label={
                              !getValues("dob")
                                ? "YYYY"
                                : getValues("dob")
                                    ?.toLocaleDateString()
                                    .split("/")[2]
                            }
                          />
                        </View>
                        <View
                          style={{
                            alignSelf: "flex-end",
                          }}
                        >
                          <Calender
                            onPress={() => {
                              // if (getValues("dob") === "") {
                              //   setValue("dob", initialDate);
                              // }
                              setOpen(true);
                            }}
                          />
                        </View>
                      </Pressable>
                    </View>
                  </View>
                  {!isEdit && (
                    <View style={styles.privacyPolicyText}>
                      <Controller
                        control={control}
                        name="agreePrivacyPolicy"
                        render={({ field: { value, onChange } }) => (
                          <Checkbox
                            height={18}
                            width={18}
                            borderRadius={5}
                            handlePress={() => onChange(!value)}
                            tick={value}
                          />
                        )}
                      />

                      <View style={{ flex: 1 }}>
                        <HelperText
                          color={theme?.colors?.secondary}
                          label="By signing Up, creating an account and are agreeing to Terms of use and Privacy Policy"
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.NextButtonContainer}>
                <Buttonn
                  disabled={isDisabled}
                  loading={loading}
                  title={!isEdit ? "next" : "Edit Bio"}
                  ButtonStyle={{ borderRadius: 10 }}
                  onPress={handleSubmit(onSubmitLoginForm)}
                />
              </View>
            </View>
          </ScrollView>
        </ProfileLayoutSignupFlow>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  FieldsContainer: {
    gap: 10,
    flex: 1,
  },

  NextButtonContainer: {
    marginTop: 30,
  },
  termsConditionTextContainer: {
    flexDirection: "row",
  },
  loginButton: {
    padding: 20,
  },
  privacyPolicyText: {
    flexDirection: "row",
    gap: 5,
  },
  dobString: {
    paddingVertical: 5,
    borderBottomWidth: 2,
    minWidth: 50,
  },
});
