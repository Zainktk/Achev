import { useReactiveVar } from "@apollo/client";
import { Buttonn, Checkbox, ScreenText } from "@atoms";
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
  setLocalStorageItem,
} from "@utils";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import ProfileLayoutSignupFlow from "../ProfileLayoutSignupFlow";

type Props = NativeStackScreenProps<AuthRoutes, "medicalSetBacks">;

const MedicalSetbacks = ({ navigation, route }: Props) => {
  const { screenNumber } = route.params;
  const theme = useTheme();
  const [checked, setChecked] = React.useState("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const userPassword = useReactiveVar(UserPassword);
  const userEmail = useReactiveVar(UserEmail);
  const { LoginUser } = useLogin();
  const [loading, setLoading] = useState<boolean>(false);
  const { UpdateProfile } = useProfile();
  const handleNext = async () => {
    if (checked === "yes") {
      navigation.navigate("medicalSetBacksCatogaries");
    } else if (checked === "no") {
      const variables: MutationLoginArgs = {
        user: { email: userEmail, password: userPassword },
      };
      try {
        setLoading(true);
        const variables: MutationUpdateProfileArgs = {
          profile: { medicalSetbacks: [] },
        };

        const res = await UpdateProfile(variables);
        if (res?.data?.updateProfile) {
          setLoading(false);
        }

        // navigation.navigate("ReproductiveProcessScreen");
      } catch (err) {}
      try {
        const res = await LoginUser(variables);
        if (res.data?.login.user.id) {
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
  };
  return (
    <ProfileLayoutSignupFlow
      screenNumber={screenNumber}
      navigation={navigation}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View
          style={{
            ...styles.reproductiveProcessBackground,
            borderColor: theme?.colors?.outline,
          }}
        >
          <ScreenText
            label="Have you experienced any medical setbacks?"
            styles={{
              fontSize: theme?.fonts?.labelMedium?.fontSize,
              marginBottom: 10,
            }}
          />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ScreenText
                label="yes"
                styles={{ textTransform: "capitalize" }}
              />
              {Platform.OS === "ios" ? (
                <CheckBox
                  animationDuration={0.1}
                  boxType="circle"
                  value={checked === "yes"}
                  style={styles.boxCheck}
                  onCheckColor={"white"}
                  onTintColor={theme.colors.disabled}
                  onFillColor={theme.colors.outline}
                  onValueChange={(value: boolean) => {
                    setChecked("yes");
                    value ? setIsDisabled(false) : setIsDisabled(true);
                  }}
                />
              ) : (
                <Checkbox
                  tick={checked === "yes"}
                  handlePress={(value) => {
                    setChecked("yes");
                    setIsDisabled(false);
                  }}
                />
              )}
            </View>
            <Divider
              bold
              style={{
                marginVertical: 15,
                backgroundColor: theme?.colors?.divider,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ScreenText label="no" styles={{ textTransform: "capitalize" }} />
              {/* <RadioButton
                value="second"
                status={checked === "second" ? "checked" : "unchecked"}
                onPress={() => setChecked("second")}
              /> */}
              {Platform.OS === "ios" ? (
                <CheckBox
                  animationDuration={0.1}
                  boxType="circle"
                  value={checked === "no"}
                  style={styles.boxCheck}
                  onCheckColor={"white"}
                  onTintColor={theme.colors.disabled}
                  onFillColor={theme.colors.outline}
                  onValueChange={(value: boolean) => {
                    setChecked("no");
                    value ? setIsDisabled(false) : setIsDisabled(true);
                  }}
                />
              ) : (
                <Checkbox
                  tick={checked === "no"}
                  handlePress={(value) => {
                    setChecked("no");
                    setIsDisabled(false);
                  }}
                />
              )}
            </View>
            <View style={styles.reproductiveProcessScreenButton}>
              <Buttonn
                disabled={isDisabled}
                title="next"
                ButtonStyle={{ borderRadius: 10 }}
                onPress={handleNext}
              />
            </View>
          </View>
        </View>
      </View>
    </ProfileLayoutSignupFlow>
  );
};

export default MedicalSetbacks;

const styles = StyleSheet.create({
  reproductiveProcessBackground: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 40,
    borderWidth: 1,
  },
  reproductiveProcessScreenButton: {
    padding: 15,
    marginTop: 20,
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  boxCheck: {
    // marginTop: Platform.OS === "ios" ? hp(0.4) : hp(0),
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    // marginRight: 40,
  },
});
