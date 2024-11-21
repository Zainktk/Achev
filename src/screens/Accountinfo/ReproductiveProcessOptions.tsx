import { useReactiveVar } from "@apollo/client";
import { Button, Checkbox, ScreenText } from "@atoms";
import { useProfile } from "@hooks";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  MutationUpdateProfileArgs,
  RpStatus,
  SelecteRpStatus,
  globalSuccessMessageVariable,
  initialRpStatusForUpdate,
} from "@utils";
import { useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, useTheme } from "react-native-paper";
import ProfileLayoutSignupFlow from "../ProfileLayoutSignupFlow";

type Props = NativeStackScreenProps<
  AuthRoutes,
  "selectReproductiveProcessFromList"
>;

const reproductiveProcessOptions = [
  {
    name: "IUI",
    isSelected: false,
  },
  {
    name: "IVF",
    isSelected: false,
  },
  {
    name: "Egg Freezing only",
    isSelected: false,
  },
  {
    name: "Adoption (of a child)",
    isSelected: false,
  },
  {
    name: "Adoption (of a embryo)",
    isSelected: false,
  },
  { name: "Surrogate (with my partner)", isSelected: false },
  { name: "Surrogate (for a couple)", isSelected: false },
];
const ReproductiveProcessOptions = ({ navigation, route }: Props) => {
  const { UpdateProfile } = useProfile();
  const [others, setOthers] = useState<string>("");
  const [errorOthersField, seterrorOthersField] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [reproductiveProcessList, setreproductiveProcessList] = useState(
    reproductiveProcessOptions
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRp, setselectedRp] = useState<{ [key: string]: string }>({});
  const getSelectedRpStatus = useReactiveVar(SelecteRpStatus);
  const getRpStatus = useReactiveVar(RpStatus);
  const theme = useTheme();
  const handlePress = (
    value: boolean,
    indexPosition: number,
    rpName: string
  ) => {
    // value ? setIsDisabled(false) : setIsDisabled(true);

    // setOthers("");
    // seterrorOthersField(false);
    let tempSelectedRp: { [key: string]: string } = {};
    if (!tempSelectedRp[indexPosition]) {
      setIsDisabled(false);
      tempSelectedRp[indexPosition] = rpName;
    } else {
      setIsDisabled(true);
      delete tempSelectedRp[indexPosition];
    }
    if (Platform.OS === "ios") {
      value ? setIsDisabled(false) : setIsDisabled(true);
    }
    setselectedRp(tempSelectedRp);

    SelecteRpStatus(tempSelectedRp);
  };
  const onSubmit = async () => {
    let RpChecked = Object?.values(selectedRp)[0];

    // if (!others && RpChecked === "Other") {
    //   seterrorOthersField(true);
    //   return;
    // }

    let reproductiveStatus: string = RpChecked;
    const isDonorOptionsExist =
      initialRpStatusForUpdate[RpChecked]?.donorPreferrences;

    try {
      setLoading(true);
      const variables: MutationUpdateProfileArgs = {
        profile: { reproductiveStatus, reproductivePreferences: [] },
      };

      const res = await UpdateProfile(variables);
      if (res?.data?.updateProfile) {
        globalSuccessMessageVariable({
          message: "Reproductive Status Updated",
        });

        setLoading(false);
        if (isDonorOptionsExist) {
          navigation.navigate("rpDonorPreferences", {
            multiSelect:
              initialRpStatusForUpdate[reproductiveStatus].multiSelect,
            rpStatus: reproductiveStatus,
          });
        } else {
          navigation.navigate("medicalSetBacks");
        }
      }

      // navigation.navigate("ReproductiveProcessScreen");
    } catch (err) {}
  };

  useEffect(() => {
    setselectedRp(getSelectedRpStatus);
    if (getSelectedRpStatus) {
      setIsDisabled(false);
    }
  }, []);
  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  return (
    <ProfileLayoutSignupFlow screenNumber={2} navigation={navigation}>
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

            {reproductiveProcessList.map((item, index) => (
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
                {/* <TouchableWithoutFeedback onPress={handlePressOutside}>
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
                </TouchableWithoutFeedback> */}

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
            ))}
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
            title="next"
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

export default ReproductiveProcessOptions;

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
