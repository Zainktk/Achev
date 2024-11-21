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
} from "@utils";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import ProfileLayoutSignupFlow from "../ProfileLayoutSignupFlow";

type Props = NativeStackScreenProps<AuthRoutes, "selectReproductiveProcess">;

const ReproductiveProcess = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { screenNumber } = route.params;
  const { UpdateProfile } = useProfile();
  const [checked, setChecked] = React.useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    if (checked === "yes") {
      RpStatus(true);
      navigation.navigate("selectReproductiveProcessFromList");
    } else if (checked === "no") {
      SelecteRpStatus({});
      RpStatus(false);
      try {
        setLoading(true);
        const variables: MutationUpdateProfileArgs = {
          profile: { reproductiveStatus: "", reproductivePreferences: null },
        };

        const res = await UpdateProfile(variables);
        if (res?.data?.updateProfile) {
          navigation.navigate("medicalSetBacks");
          globalSuccessMessageVariable({
            message: "Reproductive process updated successfully",
          });
          setLoading(false);
        }

        // navigation.navigate("ReproductiveProcessScreen");
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
            // backgroundColor: theme?.colors?.tertiary,
            borderColor: theme?.colors?.outline,
          }}
        >
          <ScreenText
            label="Are you currently undergoing a reproductive process?"
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
                    value ? setIsDisabled(false) : setIsDisabled(true);
                    setChecked("yes");
                  }}
                />
              ) : (
                <Checkbox
                  tick={checked === "yes"}
                  handlePress={() => {
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
                    value ? setIsDisabled(false) : setIsDisabled(true);

                    setChecked("no");
                  }}
                />
              ) : (
                <Checkbox
                  tick={checked === "no"}
                  handlePress={() => {
                    setChecked("no");
                    setIsDisabled(false);
                  }}
                />
              )}
            </View>
            <View style={styles.reproductiveProcessScreenButton}>
              <Button
                disabled={isDisabled}
                title="next"
                ButtonStyle={{ borderRadius: 10 }}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </View>
    </ProfileLayoutSignupFlow>
  );
};

export default ReproductiveProcess;

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
