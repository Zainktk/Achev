import { useReactiveVar } from "@apollo/client";
import { cloneDeep } from "@apollo/client/utilities";
import { Buttonn, Checkbox, Input, ScreenText } from "@atoms";
import { useProfile } from "@hooks";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes, ReproductivePreferences } from "@types";
import {
  LoggedInUser,
  MutationUpdateProfileArgs,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  initialMedicalSetbacksForUpdate,
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

type Props = NativeStackScreenProps<AuthRoutes, "medicalSetBacks">;

const UpdatedMedicalSetbacks = ({ navigation, route }: Props) => {
  const [isDisabled, setisDisabled] = useState<boolean>(false);
  const { UpdateProfile } = useProfile();
  const theme = useTheme();

  const getLoggedInUser = useReactiveVar(LoggedInUser);

  const [selectedRpMedicalSetbacks, setselectedRpMedicalSetbacks] =
    useState<ReproductivePreferences>(initialMedicalSetbacksForUpdate);

  const [others, setOthers] = useState<string | null>(null);
  const [errorOthersField, seterrorOthersField] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = (value: boolean, key: string) => {
    console.log(value);
    let _getSelectedMedicalPreferences = cloneDeep(selectedRpMedicalSetbacks);
    if (key === "No Medical Setbacks") {
      for (let option in _getSelectedMedicalPreferences) {
        _getSelectedMedicalPreferences[option] = {
          isSelected: key === option ? true : false,
          value: key,
        };
      }
      setOthers("");
    } else {
      _getSelectedMedicalPreferences["No Medical Setbacks"] = {
        isSelected: false,
        value: key,
      };
      _getSelectedMedicalPreferences[key] = {
        isSelected: value,
        value: key,
      };
    }
    Object.values(_getSelectedMedicalPreferences).filter(
      (item) => item.isSelected
    ).length
      ? setisDisabled(false)
      : setisDisabled(true);
    setselectedRpMedicalSetbacks(_getSelectedMedicalPreferences);
  };

  const onSubmit = async () => {
    const getNoOfOptionsSelected = Object.values(
      selectedRpMedicalSetbacks
    ).filter((medicalSetback) => medicalSetback.isSelected);

    if (getNoOfOptionsSelected.length > 3) {
      globalErrorMessageVariable({ message: "Select  upto 3 options only" });
      return;
    }
    if (!others && selectedRpMedicalSetbacks["Other"]?.isSelected) {
      seterrorOthersField(true);
      return;
    }
    const medicalSetbacks = Object.values(selectedRpMedicalSetbacks)
      .filter((medicalPreference) => medicalPreference.isSelected)
      .map((medicalPreference) =>
        medicalPreference.value === "Other" ? others : medicalPreference.value
      );

    if (medicalSetbacks?.[0] === "No Medical Setbacks") {
      try {
        setLoading(true);
        const variables: MutationUpdateProfileArgs = {
          profile: { medicalSetbacks: [] },
        };
        const res = await UpdateProfile(variables);
        if (res?.data?.updateProfile) {
          setLocalStorageItem({
            ...getLoggedInUser,
            profile: { ...getLoggedInUser?.profile, medicalSetbacks: [] },
          });
          LoggedInUser({
            ...getLoggedInUser,
            profile: { ...getLoggedInUser?.profile, medicalSetbacks: [] },
          });
          setLoading(false);
          navigation.navigate("rpJourney");
          return;
        }
        // navigation.navigate("ReproductiveProcessScreen");
      } catch (err) {
        // console.log(err);
      }
    }

    try {
      setLoading(true);
      const variables: MutationUpdateProfileArgs = {
        profile: { medicalSetbacks },
      };
      const res = await UpdateProfile(variables);
      if (res?.data?.updateProfile) {
        globalSuccessMessageVariable({
          message: "Medical Preferences Updated",
        });

        setLocalStorageItem({
          ...getLoggedInUser,
          profile: { ...getLoggedInUser?.profile, medicalSetbacks },
        });
        LoggedInUser({
          ...getLoggedInUser,
          profile: { ...getLoggedInUser?.profile, medicalSetbacks },
        });
        setLoading(false);
        navigation.navigate("rpJourney");
      }
      // navigation.navigate("ReproductiveProcessScreen");
    } catch (err) {
      // console.log(err);
    }
  };
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };

  useEffect(() => {
    if (getLoggedInUser?.profile) {
      const loggedInUserProfile = getLoggedInUser.profile;
      let updatedMedicalsetbBacks = cloneDeep(selectedRpMedicalSetbacks);
      const loggedInUserMedicalSetbacks =
        loggedInUserProfile.medicalSetbacks as any;
      let addedPreferences: any = [];

      if (loggedInUserMedicalSetbacks?.[0]) {
        Object.values(selectedRpMedicalSetbacks).map(
          (medicalSetBacks, index) => {
            if (loggedInUserMedicalSetbacks?.includes(medicalSetBacks.value)) {
              updatedMedicalsetbBacks[medicalSetBacks.value] = {
                isSelected: true,
                value:
                  medicalSetBacks.value !== "Other"
                    ? medicalSetBacks?.value
                    : "Other",
              };
              addedPreferences.push(medicalSetBacks.value);
            }
          }
        );
        const othersValue = loggedInUserMedicalSetbacks.filter(
          (item) => !addedPreferences.includes(item)
        );

        if (othersValue?.[0]) {
          updatedMedicalsetbBacks["Other"].isSelected = true;
          setOthers(othersValue[0]);
        }
        setselectedRpMedicalSetbacks(updatedMedicalsetbBacks);
      } else {
        updatedMedicalsetbBacks["No Medical Setbacks"].isSelected = true;
        setselectedRpMedicalSetbacks(updatedMedicalsetbBacks);
      }
    }
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
              label="Please choose  from the following"
              styles={{
                fontSize: theme?.fonts?.labelMedium?.fontSize,
              }}
            />
            <ScreenText
              label="(you can select more than one)"
              styles={{
                fontSize: theme?.fonts?.labelMedium?.fontSize,
                marginBottom: 10,
              }}
            />

            {Object.entries(selectedRpMedicalSetbacks).map(
              ([key, options], index) => (
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
                  <TouchableWithoutFeedback onPress={handlePressOutside}>
                    <View>
                      {key === "Other" && options.isSelected && (
                        <Input
                          placeholder="Type your  response here"
                          error={
                            errorOthersField ? "Field should not be empty" : ""
                          }
                          value={others}
                          onChangeText={(value) => {
                            seterrorOthersField(false);
                            setOthers(value);
                            setselectedRpMedicalSetbacks({
                              ...selectedRpMedicalSetbacks,
                              ["Other"]: {
                                isSelected: true,
                                value,
                              },
                            });
                          }}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>

                  {index <
                    Object.keys(selectedRpMedicalSetbacks).length - 1 && (
                    <Divider
                      bold
                      style={{
                        marginVertical: 20,
                        backgroundColor: theme?.colors?.divider,
                      }}
                    />
                  )}
                </View>
              )
            )}

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

export default UpdatedMedicalSetbacks;

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
