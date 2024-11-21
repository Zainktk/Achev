import { useReactiveVar } from "@apollo/client";
import { cloneDeep } from "@apollo/client/utilities";
import { Buttonn, Checkbox, ScreenText } from "@atoms";
import { useProfile } from "@hooks";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes, ReproductivePreferences } from "@types";
import {
  LoggedInUser,
  MutationUpdateProfileArgs,
  globalSuccessMessageVariable,
  initialRpStatusForUpdate,
  setLocalStorageItem,
} from "@utils";
import { useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, useTheme } from "react-native-paper";
import ProfileLayout from "../ProfileLayout";

type Props = NativeStackScreenProps<AuthRoutes, "updatedRpStatus">;

const UpdateRpStatus = ({ navigation, route }: Props) => {
  const [reproductiveJourneyStatus, setReproductiveJourneyStatus] =
    useState("");

  const [rpPrefrences, setrpPrefrences] = useState<string[]>([]);
  const { UpdateProfile } = useProfile();
  const user = useReactiveVar(LoggedInUser);
  const theme = useTheme();

  const getLoggedInUser = useReactiveVar(LoggedInUser);

  const [selectedRpStatus, setSelectedRpStatus] =
    useState<ReproductivePreferences>(initialRpStatusForUpdate);

  const [loader, setLoader] = useState(false);
  const [others, setOthers] = useState<string>("");
  const [errorOthersField, seterrorOthersField] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = (value: boolean, key: string) => {
    seterrorOthersField(false);
    let _getSelectedReproductiveStatus = cloneDeep(selectedRpStatus);

    for (const optionKey in _getSelectedReproductiveStatus) {
      if (optionKey === "Not Undergoing") {
        _getSelectedReproductiveStatus[optionKey] = {
          ..._getSelectedReproductiveStatus[optionKey],
          isSelected: optionKey === key ? true : false,
          value: optionKey === key ? optionKey : "Other",
        };
        setOthers("");
      } else {
        _getSelectedReproductiveStatus[optionKey] = {
          ..._getSelectedReproductiveStatus[optionKey],
          isSelected: optionKey === key,
          value:
            optionKey === key && optionKey !== "Other" ? optionKey : "Other",
        };
      }
    }
    if (Platform.OS === "ios") {
      value ? setIsDisabled(false) : setIsDisabled(true);
    }

    setSelectedRpStatus(_getSelectedReproductiveStatus);
  };

  const onSubmit = async () => {
    const _tempreproductiveStatus = Object?.values(selectedRpStatus)
      ?.filter((rpStatus) => rpStatus?.isSelected)
      ?.find((rpStatus) => rpStatus)?.value;
    // if (others === "" && _tempreproductiveStatus === "Other") {
    //   seterrorOthersField(true);
    //   return;
    // }
    const reproductiveStatus = _tempreproductiveStatus;
    const isDonorOptionsExist =
      selectedRpStatus[_tempreproductiveStatus || ""].donorPreferrences;
    const rpPrefrences =
      getLoggedInUser?.profile?.reproductivePreferences?.length;
    const updatedRpStatus = getLoggedInUser?.profile?.reproductiveStatus;
    if (reproductiveStatus === "Not Undergoing") {
      const variables: MutationUpdateProfileArgs = {
        profile: { reproductiveStatus: "", reproductivePreferences: [] },
      };
      const res = await UpdateProfile(variables);
      if (res) {
        LoggedInUser({
          ...getLoggedInUser,
          profile: {
            ...getLoggedInUser?.profile,
            reproductiveStatus: "",
            reproductivePreferences: [],
          },
        });

        setLocalStorageItem({
          ...getLoggedInUser,
          profile: {
            ...getLoggedInUser?.profile,
            reproductiveStatus: "",
            reproductivePreferences: [],
          },
        });
        navigation.goBack();
        return;
      }
      try {
      } catch (err) {}
    }

    try {
      setLoading(true);
      // const variables: MutationUpdateProfileArgs = {
      //   profile: isDonorOptionsExist
      //     ? { reproductiveStatus }
      //     : { reproductiveStatus, reproductivePreferences: [] },
      // };
      const variables: MutationUpdateProfileArgs = {
        profile:
          rpPrefrences && updatedRpStatus === reproductiveStatus
            ? { reproductiveStatus }
            : { reproductiveStatus, reproductivePreferences: [] },
      };

      const res = await UpdateProfile(variables);
      if (res?.data?.updateProfile) {
        globalSuccessMessageVariable({
          message: "Reproductive Status Updated",
        });

        // LoggedInUser({
        //   ...getLoggedInUser,
        //   profile: isDonorOptionsExist
        //     ? { ...getLoggedInUser?.profile, reproductiveStatus }
        //     : {
        //         ...getLoggedInUser?.profile,
        //         reproductiveStatus,
        //         reproductivePreferences: [],
        //       },
        // });

        // setLocalStorageItem({
        //   ...getLoggedInUser,
        //   profile: isDonorOptionsExist
        //     ? { ...getLoggedInUser?.profile, reproductiveStatus }
        //     : {
        //         ...getLoggedInUser?.profile,
        //         reproductiveStatus,
        //         reproductivePreferences: [],
        //       },
        // });
        LoggedInUser({
          ...getLoggedInUser,
          profile:
            rpPrefrences && updatedRpStatus === reproductiveStatus
              ? {
                  ...getLoggedInUser?.profile,
                  reproductiveStatus,
                }
              : {
                  ...getLoggedInUser?.profile,
                  reproductiveStatus,
                  reproductivePreferences: [],
                },
        });

        setLocalStorageItem({
          ...getLoggedInUser,
          profile:
            rpPrefrences && updatedRpStatus === reproductiveStatus
              ? {
                  ...getLoggedInUser?.profile,
                  reproductiveStatus,
                }
              : {
                  ...getLoggedInUser?.profile,
                  reproductiveStatus,
                  reproductivePreferences: [],
                },
        });
        setLoading(false);
        if (
          (reproductiveStatus ===
            getLoggedInUser?.profile?.reproductiveStatus &&
            getLoggedInUser?.profile?.reproductivePreferences?.length) ||
          !isDonorOptionsExist
        ) {
          navigation.navigate("rpJourney");
          return;
        }

        navigation.navigate("donorPreferences", {
          rpOptions:
            selectedRpStatus[reproductiveStatus || ""].donorPreferrences || {},
          multiSelect:
            selectedRpStatus[reproductiveStatus || ""].multiSelect || false,
        });
      }
      // navigation.navigate("ReproductiveProcessScreen");
    } catch (err) {}
  };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };

  useEffect(() => {
    if (getLoggedInUser?.profile) {
      const loggedInUserProfile = getLoggedInUser.profile;
      let updatedReproductiveStatus = cloneDeep(selectedRpStatus);

      const loggedInUserReproductiveStatus =
        loggedInUserProfile.reproductiveStatus as any;

      if (loggedInUserReproductiveStatus) {
        setIsDisabled(false);
        if (updatedReproductiveStatus[loggedInUserReproductiveStatus]) {
          updatedReproductiveStatus[loggedInUserReproductiveStatus].isSelected =
            true;
          setSelectedRpStatus(updatedReproductiveStatus);
        }
      } else {
        updatedReproductiveStatus["Not Undergoing"].isSelected = true;
        setSelectedRpStatus(updatedReproductiveStatus);
      }
    }
    console.log("profile", getLoggedInUser?.profile);
  }, [getLoggedInUser?.profile]);
  return (
    <ProfileLayout
      screenNumber={3}
      navigation={navigation}
      routeName={route.name}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={{ flex: 1 }}>
          <View style={styles.RbCataogariesContainer}>
            <ScreenText
              label="Please choose only one option from below"
              styles={{
                fontSize: theme?.fonts?.labelMedium?.fontSize,
                marginBottom: 10,
              }}
            />

            {Object.entries(selectedRpStatus).map(([key, options], index) => (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ScreenText label={key} styles={{ fontSize: 19 }} />

                  {Platform.OS === "ios" ? (
                    <CheckBox
                      animationDuration={0.1}
                      boxType="circle"
                      value={options.isSelected}
                      style={styles.boxCheck}
                      lineWidth={1}
                      onCheckColor={"white"}
                      onTintColor={theme.colors.disabled}
                      onFillColor={theme.colors.outline}
                      onValueChange={(value) => handlePress(value, key)}
                    />
                  ) : (
                    <Checkbox
                      tick={options.isSelected}
                      handlePress={(value) => {
                        handlePress(value, key);
                      }}
                    />
                  )}
                </View>
                {/* <TouchableWithoutFeedback onPress={handlePressOutside}>
                  <View>
                    {key === "Other" && options.isSelected && (
                      <Input
                        error={
                          errorOthersField ? "Field should not be empty" : ""
                        }
                        value={others}
                        onChangeText={(value) => {
                          seterrorOthersField(false);
                          setOthers(value);
                        }}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback> */}

                {index < Object.keys(selectedRpStatus).length - 1 && (
                  <Divider
                    bold
                    style={{
                      marginVertical: 20,
                      backgroundColor: theme?.colors?.divider,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.ConfirmButtonContainer}>
          <Buttonn
            disabled={isDisabled}
            title="next"
            loading={loading}
            // ButtonStyle={{ borderRadius: 0, paddingVertical: 40 }}
            onPress={onSubmit}
          />
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </ProfileLayout>
  );
};

export default UpdateRpStatus;

const styles = StyleSheet.create({
  RbCataogariesContainer: {
    flex: 1,
  },
  ConfirmButtonContainer: {
    // flex: 1,
    marginTop: 20,
  },
  boxCheck: {
    // marginTop: Platform.OS === "ios" ? hp(0.4) : hp(0),
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    // marginRight: 40,
  },
});
