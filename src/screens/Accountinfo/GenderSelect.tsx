import { Button, ScreenText } from "@atoms";
import { useProfile } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  DisabledFemale,
  DisabledMale,
  Female,
  Gender,
  Male,
  MutationUpdateProfileArgs,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
} from "@utils";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from "react-native-paper";
import ProfileLayoutSignupFlow from "../ProfileLayoutSignupFlow";

type Props = NativeStackScreenProps<AuthRoutes, "selectGender">;
const GenderSelect = ({ navigation, route }: Props) => {
  const { UpdateProfile } = useProfile();
  const { screenNumber } = route.params;
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] = useState<Gender>();
  const widthScreen = Dimensions.get("window").width;

  const handleGenderPress = (value: Gender) => {
    setSelectedGender(value);
  };
  const onSubmit = async () => {
    try {
      setLoading(true);
      const variables: MutationUpdateProfileArgs = {
        profile: { gender: selectedGender },
      };

      const res = await UpdateProfile(variables);
      if (res?.data?.updateProfile) {
        globalSuccessMessageVariable({
          message: "Gender Updated",
        });
        globalErrorMessageVariable({ message: null });

        setLoading(false);
        navigation.navigate("selectReproductiveProcess", { screenNumber: 3 });
      }
    } catch (err) {}
  };

  return (
    <ProfileLayoutSignupFlow
      routeName="selectGender"
      screenNumber={screenNumber}
      navigation={navigation}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.selectGenderContainer}>
          <ScreenText
            label="Hello, what is your gender"
            styles={{ fontSize: 20 }}
          />

          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => handleGenderPress(Gender.Male)}>
              <View
                style={{
                  ...styles.iconBackground,
                  width: widthScreen / 2 - 30,
                  height: widthScreen / 2 - 40,
                  // backgroundColor: theme?.colors?.tertiary,
                  borderWidth: selectedGender === Gender.Male ? 2 : 2,
                  borderColor:
                    selectedGender === Gender.Male
                      ? theme?.colors?.outline
                      : theme?.colors?.disabled,
                }}
              >
                {selectedGender === Gender.Male ? <Male /> : <DisabledMale />}
                <ScreenText
                  label="male"
                  color={
                    selectedGender === Gender.Male
                      ? theme?.colors?.outline
                      : theme?.colors?.disabled
                  }
                  styles={{ fontSize: 18, textTransform: "capitalize" }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGenderPress(Gender.Female)}>
              <View
                style={{
                  ...styles.iconBackground,
                  width: widthScreen / 2 - 30,
                  height: widthScreen / 2 - 40,
                  // backgroundColor: theme?.colors?.surface,
                  borderWidth: selectedGender === Gender.Female ? 2 : 2,
                  borderColor:
                    selectedGender === Gender.Female
                      ? theme?.colors?.outline
                      : theme?.colors?.disabled,
                }}
              >
                {selectedGender === Gender.Female ? (
                  <Female />
                ) : (
                  <DisabledFemale />
                )}
                <ScreenText
                  color={
                    selectedGender === Gender.Female
                      ? theme?.colors?.outline
                      : theme?.colors?.disabled
                  }
                  label="female"
                  styles={{ fontSize: 18, textTransform: "capitalize" }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ConfirmButtonContainer}>
          <Button
            disabled={
              !(
                selectedGender === Gender.Male ||
                selectedGender === Gender.Female
              )
            }
            loading={loading}
            title="next"
            ButtonStyle={{ borderRadius: 10 }}
            onPress={onSubmit}
          />
        </View>
      </View>
    </ProfileLayoutSignupFlow>
  );
};

export default GenderSelect;

const styles = StyleSheet.create({
  selectGenderContainer: {
    flex: 7,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconBackground: {
    gap: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    // borderColor:theme?.
  },
  ConfirmButtonContainer: {
    marginBottom: 20,
    flex: 1,
    justifyContent: "flex-end",
  },
  ConfirmButton: {
    padding: 20,
  },
});
