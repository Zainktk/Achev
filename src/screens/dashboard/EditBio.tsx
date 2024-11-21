import { useReactiveVar } from "@apollo/client";
import { Button, HelperText, Input, ScreenText } from "@atoms";
import { useProfile, useWatchFields } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  Calender,
  LoggedInUser,
  MutationUpdateProfileArgs,
  editUserInfo,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  setLocalStorageItem,
} from "@utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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

import { yupResolver } from "@hookform/resolvers/yup";
import { ProfileLayout } from "@screens";

type Props =
  | NativeStackScreenProps<AuthRoutes, "userInfo">
  | NativeStackScreenProps<AuthRoutes, "editBio">;

type User = {
  firstName: string;
  lastName: string;
  nickName: string;
  emergencyNo: string;
  emergencyContactName: string;
  state: string;
  dob: Date;
  agreePrivacyPolicy?: boolean;
};
const UserInfo = ({ navigation, route }: Props) => {
  let initialDate = new Date().toLocaleDateString();
  const getLoggedInUser = useReactiveVar(LoggedInUser);
  const user = useReactiveVar(LoggedInUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { UpdateProfile } = useProfile();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm<User>({
    resolver: yupResolver(editUserInfo),
    defaultValues: {
      firstName: user?.user?.firstName || "",
      lastName: user?.user?.lastName || "",
      nickName: user?.profile?.nickName || "",
      emergencyNo: user?.profile?.phone || "",
      emergencyContactName: user?.profile?.emergencyName || "",
      state: user?.profile?.state || "",
      dob: new Date(user?.profile?.dob),
      // Platform.OS === "ios"
      //   ? new Date(user?.profile?.dob).toLocaleDateString()
      //   : user?.profile?.dob.split("/"),
    },
  });
  const isDisabled = useWatchFields(watch);
  const theme = useTheme();
  console.log("hdhajsda", getValues("dob"));
  const onSubmitLoginForm = async (values: User) => {
    console.log("values", values);
    try {
      const {
        firstName,
        lastName,
        emergencyNo,
        emergencyContactName,
        ...restUser
      } = values;
      setLoading(true);
      const variables: MutationUpdateProfileArgs = {
        user: { firstName, lastName },
        profile: {
          ...restUser,
          phone: emergencyNo,
          emergencyName: emergencyContactName,
        },
      };
      const res = await UpdateProfile(variables);
      if (res?.data?.updateProfile) {
        globalSuccessMessageVariable({
          message: "Profile Updated",
        });

        globalErrorMessageVariable({ message: null });
        LoggedInUser({
          ...getLoggedInUser,
          profile: {
            ...getLoggedInUser?.profile,
            ...variables.profile,
          },
          user: {
            ...getLoggedInUser?.user,
            ...variables.user,
          },
        });

        // LoggedInUser({ user:{...}, token: user?.token || "" });
        setLocalStorageItem({
          ...getLoggedInUser,
          profile: {
            ...getLoggedInUser?.profile,
            ...variables.profile,
          },
          user: {
            ...getLoggedInUser?.user,
            ...variables.user,
          },
        });
        setLoading(false);
        navigation.navigate("accountSettingsFlow", {
          screen: "accountSettings",
        });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={{ flex: 1 }}>
        <ProfileLayout navigation={navigation} routeName="editBio">
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
                            theme="light"
                            maximumDate={new Date()}
                            mode="date"
                            style={{ backgroundColor: "#fff" }}
                            open={open}
                            date={value}
                            onConfirm={(date) => {
                              onChange(date);
                              console.log(date);
                              setOpen(false);
                            }}
                            onCancel={() => setOpen(false)}
                          />
                        )}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 4,
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <Pressable
                          onPress={() => setOpen(true)}
                          style={{
                            flexDirection: "row",
                            gap: 4,
                            // alignSelf: "flex-start",
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
                                getValues("dob")
                                  ? (getValues("dob").getMonth() + 1)
                                      .toString()
                                      .padStart(2, "0")
                                  : ""
                              }
                            />
                            {/* {Platform.OS === "ios" ? (
                          <ScreenText
                            label={
                              getValues("dob") !== ""
                                ? getValues("dob")?.split("/")[1]
                                : ""
                            }
                          />
                        ) : (
                          <ScreenText
                            label={
                              getValues("dob") !== ""
                                ? getValues("dob")?.split("/")[1]
                                : ""
                            }
                          />
                        )} */}
                          </View>
                          <View
                            style={{
                              ...styles.dobString,
                              borderBottomColor: theme?.colors?.divider,
                            }}
                          >
                            <ScreenText
                              label={
                                getValues("dob")
                                  ? getValues("dob")
                                      .getDate()
                                      .toString()
                                      .padStart(2, "0")
                                  : ""
                              }
                            />
                            {/* {Platform.OS === "ios" ? (
                          <ScreenText
                            label={
                              getValues("dob") !== ""
                                ? getValues("dob")?.split("/")[0]
                                : ""
                            }
                          />
                        ) : (
                          <ScreenText label={getValues("dob")[0]} />
                        )} */}
                          </View>
                          <View
                            style={{
                              ...styles.dobString,
                              borderBottomColor: theme?.colors?.divider,
                            }}
                          >
                            <ScreenText
                              label={
                                getValues("dob")
                                  ? getValues("dob").getFullYear().toString()
                                  : ""
                              }
                            />
                            {/* {Platform.OS === "ios" ? (
                          <ScreenText
                            label={
                              getValues("dob") !== ""
                                ? getValues("dob")?.split("/")[2]
                                : ""
                            }
                          />
                        ) : (
                          <ScreenText label={getValues("dob")[2]} />
                        )} */}
                          </View>
                        </Pressable>

                        <Calender
                          onPress={() => {
                            // if (getValues("dob") === "") {
                            //   setValue("dob", initialDate);
                            // }
                            setOpen(true);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.NextButtonContainer}>
                <Button
                  // disabled={isDisabled}
                  loading={loading}
                  title={"Edit Bio"}
                  ButtonStyle={{ borderRadius: 10 }}
                  onPress={handleSubmit(onSubmitLoginForm)}
                />
              </View>
            </View>
          </ScrollView>
        </ProfileLayout>
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
    width: 55,
  },
});
