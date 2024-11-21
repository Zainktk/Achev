import { useReactiveVar } from "@apollo/client";
import { ScreenText } from "@atoms";
import { AuthRoutes, ReproductivePreferences } from "@types";
import {
  HeartDonation,
  HeartMedicalSetbacks,
  HeartPlus,
  LoggedInUser,
  RpJourneyIcon,
  Star,
  initialMedicalSetbacksForUpdate,
  initialRpStatusForUpdate,
} from "@utils";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import ProfileLayout from "../ProfileLayout";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import RPSelectComponent from "./RPSelectComponent";

type Props = NativeStackScreenProps<AuthRoutes, "rpJourney">;

const RPJourney = ({ navigation, route }: Props) => {
  const height = Dimensions.get("window").height;
  const theme = useTheme();

  const getLoggedInUser = useReactiveVar(LoggedInUser);
  // console.log("===>", getLoggedInUser);
  const [selectedRpStatus, setSelectedRpStatus] =
    useState<ReproductivePreferences>(initialRpStatusForUpdate);

  return (
    <ProfileLayout navigation={navigation} routeName={route.name}>
      <View
        style={{
          ...styles.RPJourneycontainer,
        }}
      >
        <View
          style={{
            ...styles.RPJourneyInnercontainer,
            borderColor: theme?.colors?.outline,
            marginTop: height * 0.1,
          }}
        >
          <View>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  backgroundColor: theme?.colors?.secondary_90,
                }}
              >
                <RpJourneyIcon />
              </View>
            </View>
            <View
              style={{
                ...styles.badge,
                backgroundColor: theme?.colors?.profileBadge,
                marginBottom: 8,
              }}
            >
              <Star />
              <ScreenText
                styles={{ fontSize: theme?.fonts?.labelSmall.fontSize }}
                label="Undergoing reproductive process"
              />
            </View>
          </View>

          <View>
            <RPSelectComponent
              name="Reproductive Process Options"
              options={{}}
              icon={<HeartPlus />}
              path="updatedRpStatus"
              navigation={navigation}
              selectedOptions={
                getLoggedInUser?.profile?.reproductiveStatus
                  ? getLoggedInUser?.profile?.reproductiveStatus
                  : initialRpStatusForUpdate["Not Undergoing"]?.value || ""
              }
              multiSelect={
                selectedRpStatus[
                  getLoggedInUser?.profile?.reproductiveStatus || ""
                ]?.multiSelect || false
              }
            />
            <Divider style={{ backgroundColor: theme.colors.divider }} />
            {getLoggedInUser?.profile?.reproductivePreferences?.[0] && (
              <RPSelectComponent
                name="Sperm Donation Preferences"
                icon={<HeartDonation />}
                options={{}}
                multiSelect={
                  selectedRpStatus[
                    getLoggedInUser?.profile?.reproductiveStatus || ""
                  ]?.multiSelect || false
                }
                path="donorPreferences"
                navigation={navigation}
                selectedOptions={
                  getLoggedInUser?.profile?.reproductivePreferences?.join(
                    ","
                  ) || []
                }
              />
            )}
            <Divider style={{ backgroundColor: theme.colors.divider }} />
            <RPSelectComponent
              name="Medical Set Backs"
              icon={<HeartMedicalSetbacks />}
              options={{}}
              path="medicalSetBacks"
              navigation={navigation}
              selectedOptions={
                getLoggedInUser?.profile?.medicalSetbacks?.length
                  ? getLoggedInUser?.profile?.medicalSetbacks?.join(",")
                  : initialMedicalSetbacksForUpdate["No Medical Setbacks"]
                      ?.value
              }
            />
          </View>
        </View>
      </View>
    </ProfileLayout>
  );
};

export default RPJourney;

const styles = StyleSheet.create({
  RPJourneycontainer: {
    flex: 1,
  },
  RPJourneyInnercontainer: {
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    flex: 0.8,
    justifyContent: "center",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 40,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
