import { useReactiveVar } from "@apollo/client";
import { cloneDeep } from "@apollo/client/utilities";
import { Button, Checkbox, Input, ScreenText } from "@atoms";
import { useProfile } from "@hooks";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  AuthRoutes,
  ReproductivePreferenceOption,
  ReproductivePreferences,
} from "@types";
import {
  LoggedInUser,
  MutationUpdateProfileArgs,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  initialRpStatusForUpdate,
  setLocalStorageItem,
} from "@utils";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, useTheme } from "react-native-paper";
import ProfileLayout from "../ProfileLayout";

type Props = NativeStackScreenProps<AuthRoutes, "donorPreferences">;

const DonorPreferences = ({ navigation, route }: Props) => {
  const { rpOptions, multiSelect } = route.params;

  const { UpdateProfile } = useProfile();
  const user = useReactiveVar(LoggedInUser);
  const theme = useTheme();

  const getLoggedInUser = useReactiveVar(LoggedInUser);

  const [selectedDonorPreferences, setselectedDonorPreferences] =
    useState<ReproductivePreferences>(rpOptions);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loader, setLoader] = useState(false);
  const [others, setOthers] = useState<string>("");
  const [errorOthersField, seterrorOthersField] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = (value: boolean, key: string) => {
    console.log(value);
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
        LoggedInUser({
          ...getLoggedInUser,
          profile: { ...getLoggedInUser?.profile, reproductivePreferences },
        });
        setLocalStorageItem({
          ...getLoggedInUser,
          profile: { ...getLoggedInUser?.profile, reproductivePreferences },
        });
        setLoading(false);
        navigation.navigate("rpJourney");
      }
    } catch (err) {}
  };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };

  useEffect(() => {
    let rpDonorStatus: ReproductivePreferenceOption | null = null;

    const loggedInUserReproductiveStatus = getLoggedInUser?.profile
      ?.reproductiveStatus as any;
    if (loggedInUserReproductiveStatus) {
      rpDonorStatus = initialRpStatusForUpdate[loggedInUserReproductiveStatus];
    }

    if (rpDonorStatus?.donorPreferrences) {
      let updatedDonorPreferences = cloneDeep(rpDonorStatus?.donorPreferrences);
      const getRpPrefernces =
        getLoggedInUser?.profile?.reproductivePreferences?.map((item) =>
          item.toLocaleLowerCase().trim()
        );
      if (getRpPrefernces?.length) {
        setIsDisabled(false);
      }

      Object.values(updatedDonorPreferences).map((item) => {
        if (getRpPrefernces?.includes(item.value.toLocaleLowerCase().trim())) {
          updatedDonorPreferences[item.value] = {
            isSelected: true,
            value: item.value,
          };
        }
      });

      setselectedDonorPreferences(updatedDonorPreferences);
      // if (getLoggedInUser?.profile?.reproductivePreferences?.length) {
      //   const _tempselectedDonorPreferences = cloneDeep(selectedDonorPreferences);
      //   Object.values(_tempselectedDonorPreferences).map((item) => {
      //     for (const option in _tempselectedDonorPreferences) {
      //       if (option === rpOptions) {
      //         _tempselectedDonorPreferences[option] = {
      //           isSelected: true,
      //           value: rpOptions,
      //           donorPreferrences: {
      //             ..._tempselectedDonorPreferences[option].donorPreferrences,
      //             [_tempselectedDonorPreferences[option].donorPreferrences[
      //               item.value
      //             ]]: {
      //               isSelected: true,
      //               value: item.value,
      //             },
      //           },
      //         };
      //       }
      //     }
      //   });
      // Object.values(_tempselectedDonorPreferences).map((item) => {
      //   if (
      //     getLoggedInUser?.profile?.reproductivePreferences?.includes(
      //       item.value
      //     )
      //   ) {
      //     _tempselectedDonorPreferences[item.value] = {
      //       isSelected: true,
      //       value: item.value,
      //     };
      //   } else {
      //     _tempselectedDonorPreferences[item.value] = {
      //       isSelected: false,
      //       value: item.value,
      //     };
      //   }
      // });
      // setselectedDonorPreferences(_tempselectedDonorPreferences);
      // }
      //   const donorPreferences =
      //   updatedReproductiveStatus[loggedInUserReproductiveStatus]
      //     ?.donorPreferrences;
      // Object.values(donorPreferences).map((item) => {
      //   if (
      //     getLoggedInUser?.profile?.reproductivePreferences?.includes(
      //       item.value
      //     )
      //   ) {
      //     updatedReproductiveStatus[
      //       loggedInUserReproductiveStatus
      //     ].donorPreferrences[item.value]?.isSelected = true;
      //   }
      // });
      // if (getLoggedInUser?.profile) {
      //   const loggedInUserProfile = getLoggedInUser.profile;
      //   let updatedReproductiveStatus = cloneDeep(selectedDonorPreferences);

      //   const loggedInUserReproductivePreferences =
      //     loggedInUserProfile.reproductivePreferences as string[];
      //   if (loggedInUserReproductivePreferences.length) {
      //     Object.values(updatedReproductiveStatus).map((item) => {
      //       if (
      //         getLoggedInUser?.profile?.reproductivePreferences?.includes(
      //           item.value
      //         )
      //       ) {
      //         updatedReproductiveStatus[item.value] = {
      //           isSelected: true,
      //           value: item.value,
      //         };
      //       }
      //     });
      //     // if (updatedReproductiveStatus[loggedInUserReproductivePreferences]) {
      //     //   updatedReproductiveStatus[
      //     //     loggedInUserReproductivePreferences
      //     //   ].isSelected = true;
      //     // } else {
      //     //   updatedReproductiveStatus["Other"].isSelected = true;
      //     //   updatedReproductiveStatus["Other"].value =
      //     //     loggedInUserReproductivePreferences;
      //     // }
      //     setselectedDonorPreferences(updatedReproductiveStatus);
      //   } else {
      //     updatedReproductiveStatus["Not Undergoing"].isSelected = true;
      //     setselectedDonorPreferences(updatedReproductiveStatus);
      //   }
      // }
    }
  }, [getLoggedInUser?.profile]);

  return (
    <ProfileLayout routeName={route.name} navigation={navigation}>
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
                marginBottom: 5,
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

            {/* {selectedRpStatus?.map((item, index) => (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ScreenText label={item.name} styles={{ fontSize: 19 }} />
  
                    {Platform.OS === "ios" ? (
                      <CheckBox
                        animationDuration={0.1}
                        boxType="circle"
                        value={selectedRp[index] ? true : false}
                        style={styles.boxCheck}
                        lineWidth={1}
                        onCheckColor={"white"}
                        onTintColor={theme.colors.disabled}
                        onFillColor={theme.colors.outline}
                        onValueChange={(value) =>
                          handlePress(value, index, item.name)
                        }
                      />
                    ) : (
                      <Checkbox
                        tick={selectedRp[index] ? true : false}
                        handlePress={(value) => {
                          handlePress(value, index, item.name);
                        }}
                      />
                    )}
                  </View>
                  <TouchableWithoutFeedback onPress={handlePressOutside}>
                    <View>
                      {selectedRp[reproductiveProcessList.length - 1] &&
                        item.name === "Other" && (
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
  
                  {index < reproductiveProcessList.length - 1 && (
                    <Divider
                      bold
                      style={{
                        marginVertical: 20,
                        backgroundColor: theme?.colors?.divider,
                      }}
                    />
                  )}
                </View>
              ))} */}
            {/* <FlatList
                showsVerticalScrollIndicator={false}
                data={reproductiveProcessList}
                keyExtractor={(item, index) => "" + index}
                renderItem={({ item, index }) => (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ScreenText label={item.name} styles={{ fontSize: 19 }} />
    
                      {Platform.OS === "ios" ? (
                        <CheckBox
                          animationDuration={0.1}
                          boxType="circle"
                          value={selectedRp[index] ? true : false}
                          style={styles.boxCheck}
                          lineWidth={1}
                          onCheckColor={"white"}
                          onTintColor={theme.colors.disabled}
                          onFillColor={theme.colors.outline}
                          onValueChange={(value) =>
                            handlePress(value, index, item.name)
                          }
                        />
                      ) : (
                        <Checkbox
                          tick={selectedRp[index] ? true : false}
                          handlePress={(value) => {
                            handlePress(value, index, item.name);
                          }}
                        />
                      )}
                    </View>
                    <TouchableWithoutFeedback onPress={handlePressOutside}>
                      <View>
                        {selectedRp[reproductiveProcessList.length - 1] &&
                          item.name === "Other" && (
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
    
                    {index < reproductiveProcessList.length - 1 && (
                      <Divider
                        bold
                        style={{
                          marginVertical: 20,
                          backgroundColor: theme?.colors?.divider,
                        }}
                      />
                    )}
                  </View>
                )}
                //   keyExtractor={(item) => item.id}
              /> */}
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
    </ProfileLayout>
  );
};

export default DonorPreferences;

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
