import { Button, Checkbox, Input, ScreenText } from "@atoms";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes, ReproductivePreferences } from "@types";
import { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Divider, useTheme } from "react-native-paper";

import { useReactiveVar } from "@apollo/client";
import { cloneDeep } from "@apollo/client/utilities";
import { useProfile } from "@hooks";
import {
  LoggedInUser,
  MutationUpdateProfileArgs,
  SelectedDonorPreferences,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  initialRpStatusForUpdate,
} from "@utils";
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProfileLayoutSignupFlow from "../ProfileLayoutSignupFlow";

type Props = NativeStackScreenProps<AuthRoutes, "rpDonorPreferences">;

const RPDonorPreferences = ({ navigation, route }: Props) => {
  const { rpStatus, multiSelect } = route.params;

  const { UpdateProfile } = useProfile();
  const user = useReactiveVar(LoggedInUser);
  const theme = useTheme();

  const getLoggedInUser = useReactiveVar(LoggedInUser);

  const [selectedDonorPreferences, setselectedDonorPreferences] =
    useState<ReproductivePreferences>(
      initialRpStatusForUpdate[rpStatus].donorPreferrences
    );
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loader, setLoader] = useState(false);
  const [others, setOthers] = useState<string>("");
  const [errorOthersField, seterrorOthersField] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const getDonorPrefernces = useReactiveVar(SelectedDonorPreferences);
  const handlePress = (value: boolean, key: string) => {
    let _tempselectedDonorPreferences = cloneDeep(selectedDonorPreferences);
    if (multiSelect) {
      _tempselectedDonorPreferences[key] = {
        isSelected: value,
        value: key,
      };
    } else {
      for (const optionKey in _tempselectedDonorPreferences) {
        _tempselectedDonorPreferences[optionKey] = {
          isSelected: optionKey === key ? value : false,
          value: optionKey,
        };
      }
    }

    Object.values(_tempselectedDonorPreferences).filter(
      (item) => item.isSelected
    ).length
      ? setIsDisabled(false)
      : setIsDisabled(true);
    setselectedDonorPreferences(_tempselectedDonorPreferences);
    SelectedDonorPreferences(_tempselectedDonorPreferences);
  };

  const onSubmit = async () => {
    // console.log("selceted", selectedDonorPreferences);
    const reproductivePreferences = Object.values(selectedDonorPreferences)
      .filter((donor) => donor.isSelected)
      .map((donor) => donor.value);
    if (reproductivePreferences.length > 2) {
      globalErrorMessageVariable({
        message: "You can select only upto 2",
      });
      return;
    }

    try {
      setLoading(true);
      const variables: MutationUpdateProfileArgs = {
        profile: { reproductivePreferences: reproductivePreferences },
      };

      const res = await UpdateProfile(variables);
      if (res?.data?.updateProfile) {
        globalSuccessMessageVariable({
          message: "Reproductive Preferences Updated",
        });

        setLoading(false);
        navigation.navigate("medicalSetBacks");
      }
    } catch (err) {}
  };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };

  useEffect(() => {
    // console.log("dsada", getDonorPrefernces);
    // setselectedDonorPreferences(getDonorPrefernces);
    // if (getDonorPrefernces) {
    //   setIsDisabled(false);
    // }
    // let rpDonorStatus: ReproductivePreferenceOption | null = null;
    // if (rpStatus) {
    //   rpDonorStatus = initialRpStatusForUpdate[rpStatus];
    // }
    // if (rpDonorStatus?.donorPreferrences) {
    //   let updatedDonorPreferences = cloneDeep(rpDonorStatus?.donorPreferrences);
    //   setselectedDonorPreferences(updatedDonorPreferences);
    // const getRpPrefernces =
    //   getLoggedInUser?.profile?.reproductivePreferences?.map((item) =>
    //     item.toLocaleLowerCase().trim()
    //   );
    // if (getRpPrefernces?.length) {
    //   setIsDisabled(false);
    // }
    // Object.values(updatedDonorPreferences).map((item) => {
    //   if (getRpPrefernces?.includes(item.value.toLocaleLowerCase().trim())) {
    //     updatedDonorPreferences[item.value] = {
    //       isSelected: true,
    //       value: item.value,
    //     };
    //   }
    // });
    // }
  }, []);

  return (
    <ProfileLayoutSignupFlow
      screenNumber={2}
      routeName={route.name}
      navigation={navigation}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={{ flex: 1 }}>
          <View style={styles.RbCataogariesContainer}>
            <ScreenText
              label="Please choose from the following"
              styles={{
                fontSize: theme?.fonts?.labelMedium?.fontSize,
                marginBottom: 10,
              }}
            />
            {multiSelect && (
              <ScreenText
                label="( You can select up to 2 )"
                styles={{
                  fontSize: theme?.fonts?.labelMedium?.fontSize,
                  marginBottom: 10,
                }}
              />
            )}

            {Object.values(selectedDonorPreferences).map((item, index) => (
              <>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ScreenText label={item.value} styles={{ fontSize: 19 }} />

                    {Platform.OS === "ios" ? (
                      <CheckBox
                        animationDuration={0.1}
                        boxType="circle"
                        value={item.isSelected}
                        style={styles.boxCheck}
                        lineWidth={1}
                        onCheckColor={"white"}
                        onTintColor={theme.colors.disabled}
                        onFillColor={theme.colors.outline}
                        onValueChange={(value) =>
                          handlePress(value, item.value)
                        }
                      />
                    ) : (
                      <Checkbox
                        tick={item.isSelected}
                        handlePress={(value) => {
                          handlePress(value, item.value);
                        }}
                      />
                    )}
                  </View>
                  <TouchableWithoutFeedback onPress={handlePressOutside}>
                    <View>
                      {item.value === "Other" && item.isSelected && (
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
                  </TouchableWithoutFeedback>

                  {index < Object.keys(selectedDonorPreferences).length - 1 && (
                    <Divider
                      bold
                      style={{
                        marginVertical: 20,
                        backgroundColor: theme?.colors?.divider,
                      }}
                    />
                  )}
                </View>
              </>
            ))}
          </View>
        </View>
        <View style={styles.ConfirmButtonContainer}>
          <Button
            disabled={isDisabled}
            title="save"
            loading={loading}
            // ButtonStyle={{ borderRadius: 0, paddingVertical: 40 }}
            onPress={onSubmit}
          />
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </ProfileLayoutSignupFlow>
  );
};

export default RPDonorPreferences;

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
