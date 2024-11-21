import { Checkbox, Input, OutlinedButton, ScreenText } from "@atoms";
import { useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProfileLayout from "../ProfileLayout";
// import CheckBox from "@react-native-community/checkbox";
import { useProfile } from "@hooks";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { globalErrorMessageVariable } from "@utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, useTheme } from "react-native-paper";
let deleteAccountReasons = [
  {
    name: "Found success in the reproductive process & no longer need this service",
  },
  {
    name: "Cleaning up online accounts",
  },
  {
    name: "Other",
  },
];
type Props = NativeStackScreenProps<AuthRoutes, "deleteAccount">;
const DeleteAccount = ({ route, navigation }: Props) => {
  const { UpdateProfile } = useProfile();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const height = Dimensions.get("window").height;

  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedOption, setselectedOption] = useState<{
  //   [key: string]: string;
  // }>({});
  const [selectedOption, setselectedOption] = useState<string>("");
  const theme = useTheme();
  const [others, setOthers] = useState<string>("");
  const [valueFromService, setvalueFromService] = useState<string>("");
  const [errorField, seterrorField] = useState<boolean>(false);
  const [errorOthersField, seterrorOthersField] = useState<boolean>(false);
  const { DeleteUser } = useProfile();
  const handlePress = (
    value: boolean,
    indexPosition: number,
    rpName: string
  ) => {
    seterrorOthersField(false);
    seterrorField(false);
    setOthers("");
    setvalueFromService("");

    let tempSelectedRp: { [key: string]: string } = {};
    if (value) {
      tempSelectedRp[indexPosition] = rpName;
    } else {
      delete tempSelectedRp[indexPosition];
    }

    setselectedOption(tempSelectedRp);
  };
  const handlePressOutside = () => {
    console.log("Dsadas");

    Keyboard.dismiss(); // Close the keyboard
  };
  const handleDelete = async () => {
    let OptionChecked = selectedOption;
    if (!OptionChecked) {
      globalErrorMessageVariable({ message: "Select atleast one option" });
      return;
    }
    // if (!valueFromService && OptionChecked === "Cleaning up online accounts") {
    //   seterrorField(true);
    //   return;
    // }
    if (!others && OptionChecked === "Other") {
      seterrorOthersField(true);
      return;
    }
    let reason: string = others ? others : OptionChecked;
    if (reason) {
      navigation.navigate("confirmDeleteAccount", { reason });
    }
  };

  return (
    <ProfileLayout navigation={navigation} routeName={route.name}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.RbCataogariesContainer}>
            <View
              style={{
                flexDirection: "row",
                gap: 5,

                // flexWrap: "wrap",
              }}
            >
              {Platform.OS === "ios" ? (
                <CheckBox
                  animationDuration={0.1}
                  boxType="circle"
                  value={selectedOption === deleteAccountReasons[0].name}
                  style={styles.boxCheck}
                  lineWidth={1}
                  onCheckColor={"white"}
                  onTintColor={theme.colors.disabled}
                  onFillColor={theme.colors.outline}
                  onValueChange={(value) => {
                    value
                      ? setselectedOption(deleteAccountReasons[0].name)
                      : setselectedOption("");
                    setOthers("");
                    setvalueFromService("");
                  }}
                />
              ) : (
                <Checkbox
                  tick={selectedOption === deleteAccountReasons[0].name}
                  handlePress={(value) => {
                    setselectedOption(deleteAccountReasons[0].name);
                    setOthers("");
                    setvalueFromService("");
                  }}
                />
              )}
              <View style={{ flexShrink: 1 }}>
                <ScreenText
                  label={deleteAccountReasons[0].name}
                  styles={{
                    fontSize: 17,
                  }}
                />
              </View>
            </View>
            <Divider
              bold
              style={{
                marginVertical: 20,
                backgroundColor: theme?.colors?.divider,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                gap: 5,

                // flexWrap: "wrap",
              }}
            >
              {Platform.OS === "ios" ? (
                <CheckBox
                  animationDuration={0.1}
                  boxType="circle"
                  value={selectedOption === deleteAccountReasons[1].name}
                  style={styles.boxCheck}
                  lineWidth={1}
                  onCheckColor={"white"}
                  onTintColor={theme.colors.disabled}
                  onFillColor={theme.colors.outline}
                  onValueChange={(value) => {
                    value
                      ? setselectedOption(deleteAccountReasons[1].name)
                      : setselectedOption("");
                    setOthers("");
                    seterrorField(false);
                  }}
                />
              ) : (
                <Checkbox
                  tick={selectedOption === deleteAccountReasons[1].name}
                  handlePress={(value) => {
                    setselectedOption(deleteAccountReasons[1].name);
                    setOthers("");
                    seterrorField(false);
                  }}
                />
              )}
              <View style={{ flexShrink: 1 }}>
                <ScreenText
                  label={deleteAccountReasons[1].name}
                  styles={{
                    fontSize: 17,
                  }}
                />
              </View>
            </View>
            {/* <TouchableWithoutFeedback onPress={handlePressOutside}>
              <View>
                {selectedOption === deleteAccountReasons[1].name && (
                  <Input
                    multiline={true}
                    // placeholder="Please type in a reason you felt the product didn’t meet your needs?"
                    error={errorField ? "Field should not be empty" : ""}
                    value={valueFromService}
                    onChangeText={(value) => {
                      seterrorField(false);
                      setvalueFromService(value);
                    }}
                  />
                )}
              </View>
            </TouchableWithoutFeedback> */}
            <Divider
              bold
              style={{
                marginVertical: 20,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 5,

                // flexWrap: "wrap",
              }}
            >
              {Platform.OS === "ios" ? (
                <CheckBox
                  animationDuration={0.1}
                  boxType="circle"
                  value={selectedOption === deleteAccountReasons[2].name}
                  style={styles.boxCheck}
                  lineWidth={1}
                  onCheckColor={"white"}
                  onTintColor={theme.colors.disabled}
                  onFillColor={theme.colors.outline}
                  onValueChange={(value) => {
                    value
                      ? setselectedOption(deleteAccountReasons[2].name)
                      : setselectedOption("");
                    seterrorOthersField(false);
                    setvalueFromService("");
                  }}
                />
              ) : (
                <Checkbox
                  tick={selectedOption === deleteAccountReasons[2].name}
                  handlePress={(value) => {
                    setselectedOption(deleteAccountReasons[2].name);

                    seterrorOthersField(false);
                    setvalueFromService("");
                  }}
                />
              )}
              <View style={{ flexShrink: 1 }}>
                <ScreenText
                  label={deleteAccountReasons[2].name}
                  styles={{
                    fontSize: 17,
                  }}
                />
              </View>
            </View>
            <TouchableWithoutFeedback onPress={handlePressOutside}>
              <View>
                {selectedOption === deleteAccountReasons[2].name && (
                  <Input
                    placeholder="Type your response here"
                    error={errorOthersField ? "Field should not be empty" : ""}
                    value={others}
                    onChangeText={(value) => {
                      seterrorOthersField(false);
                      setOthers(value);
                    }}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{ ...styles.buttonContainer, marginBottom: height * 0.06 }}
          >
            <OutlinedButton
              onPress={handleDelete}
              ButtonStyle={{
                backgroundColor: "transparent",
                borderColor: "background: rgba(255, 96, 96, 1)",
                borderWidth: 1,
              }}
              LabelStyle={{ color: " rgba(255, 96, 96, 1)" }}
              title="delete account"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ProfileLayout>
  );
};

export default DeleteAccount;

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
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
