import { useReactiveVar } from "@apollo/client";
import { Button, Checkbox, Input, ScreenText } from "@atoms";
import { useLogin, useProfile } from "@hooks";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  LoggedInUser,
  MutationLoginArgs,
  MutationUpdateProfileArgs,
  SelecteRpStatus,
  SelectedMedicalPreferences,
  UserEmail,
  UserPassword,
  Userinfo,
  VerificationToken,
  VerifiedToken,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  setLocalStorageItem,
} from "@utils";
import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, useTheme } from "react-native-paper";
import ProfileLayoutSignupFlow from "../ProfileLayoutSignupFlow";

type Props = NativeStackScreenProps<AuthRoutes, "medicalSetBacksCatogaries">;

const medicalSetbacksOptions = [
  {
    name: "PCOS",
    isSelected: false,
  },
  {
    name: "Endometriosis",
    isSelected: false,
  },
  {
    name: "Polyps",
    isSelected: false,
  },
  { name: "Autoimmune Condition", isSelected: false },
  { name: "Other", isSelected: false },
];
const MedicalSetbacksCatogaries = ({ navigation, route }: Props) => {
  const { UpdateProfile } = useProfile();
  const [MedicalSetbacksOptions, setmedicalSetbacksOptions] = useState(
    medicalSetbacksOptions
  );
  const userEmail = useReactiveVar(UserEmail);
  const userPassword = useReactiveVar(UserPassword);

  const { LoginUser } = useLogin();
  const [errorOthersField, seterrorOthersField] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const getSelectedMedicalPreferences = useReactiveVar(
    SelectedMedicalPreferences
  );
  const [selectedOptions, setselectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [others, setOthers] = useState<string>("");
  const [reproductiveProcessOption, setreproductiveProcessOption] = useState(
    medicalSetbacksOptions
  );

  const theme = useTheme();
  const handlePress = (indexPosition: number, RpName: string) => {
    seterrorOthersField(false);
    let tempMedicalSetBacks: { [key: string]: string } = { ...selectedOptions };
    if (tempMedicalSetBacks[indexPosition]) {
      delete tempMedicalSetBacks[indexPosition];
    } else {
      tempMedicalSetBacks[indexPosition] = RpName;
    }
    Object.keys(tempMedicalSetBacks).length
      ? setIsDisabled(false)
      : setIsDisabled(true);

    setselectedOptions(tempMedicalSetBacks);
    SelectedMedicalPreferences(tempMedicalSetBacks);
  };
  const onSubmit = async () => {
    if (Object.keys(selectedOptions).length > 3) {
      globalErrorMessageVariable({ message: "Select  upto 3 options only" });
      return;
    }

    if (!others && selectedOptions[medicalSetbacksOptions.length - 1]) {
      seterrorOthersField(true);
      return;
    }
    if (selectedOptions[MedicalSetbacksOptions.length - 1]) {
      selectedOptions[MedicalSetbacksOptions.length - 1] = others;
    }

    let medicalSetbacks = Object.values(selectedOptions);
    try {
      setLoading(true);
      const variables: MutationUpdateProfileArgs = {
        profile: { medicalSetbacks },
      };

      const res = await UpdateProfile(variables);
      if (res?.data?.updateProfile) {
        globalSuccessMessageVariable({
          message: "Medical Setbacks  Updated",
        });
        setLoading(false);

        const variables: MutationLoginArgs = {
          user: { email: userEmail, password: userPassword },
        };
        try {
          const res = await LoginUser(variables);

          if (res.data?.login.user.id) {
            globalSuccessMessageVariable({
              message: "Reproductive Preferences Updated",
            });
            globalErrorMessageVariable({ message: null });
            setLocalStorageItem(res.data?.login);
            LoggedInUser(res.data?.login);
            UserEmail("");
            UserPassword("");
            Userinfo(null);
            VerificationToken("");
            VerifiedToken("");
            SelecteRpStatus({});
            SelectedMedicalPreferences({});
          }
        } catch (err) {}
      }
    } catch (err) {}
  };

  useEffect(() => {
    setselectedOptions(getSelectedMedicalPreferences);
    if (getSelectedMedicalPreferences) setIsDisabled(false);
  }, []);

  const handlePressOutside = () => {
    Keyboard.dismiss(); // Close the keyboard
  };
  return (
    <ProfileLayoutSignupFlow screenNumber={4} navigation={navigation}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* <ScrollView> */}
        <View style={{ flex: 1 }}>
          <View style={styles.medicalSetBacksOptions}>
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
            <FlatList
              keyExtractor={(item, index) => "" + index}
              data={MedicalSetbacksOptions}
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
                        value={selectedOptions[index] ? true : false}
                        style={styles.boxCheck}
                        onCheckColor={"white"}
                        onTintColor={theme.colors.disabled}
                        onFillColor={theme.colors.outline}
                        onValueChange={(value) => handlePress(index, item.name)}
                      />
                    ) : (
                      <Checkbox
                        tick={selectedOptions[index] ? true : false}
                        handlePress={() => {
                          handlePress(index, item.name);
                        }}
                      />
                    )}
                  </View>
                  <TouchableWithoutFeedback onPress={handlePressOutside}>
                    <View>
                      {selectedOptions[MedicalSetbacksOptions.length - 1] &&
                        item.name === "Other" && (
                          <Input
                            placeholder="Type your  response here"
                            error={
                              errorOthersField
                                ? "Field should not be empty"
                                : ""
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

                  {index < MedicalSetbacksOptions.length - 1 && (
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
            />
          </View>
          <View style={styles.ConfirmButtonContainer}>
            <Button
              disabled={isDisabled}
              loading={loading}
              title="next"
              onPress={onSubmit}
            />
          </View>
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </ProfileLayoutSignupFlow>
  );
};

export default MedicalSetbacksCatogaries;

const styles = StyleSheet.create({
  ConfirmButtonContainer: {
    // marginBottom: 20,
    marginTop: 20,
  },
  medicalSetBacksOptions: {
    flex: 1,
  },
  boxCheck: {
    // marginTop: Platform.OS === "ios" ? hp(0.4) : hp(0),
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    // borderRadius: 50,
    // marginRight: 40,
  },
});
function SelectedRpStatus(arg0: {}) {
  throw new Error("Function not implemented.");
}
