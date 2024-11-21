import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Backarrow } from "@utils";
import { useTheme } from "react-native-paper";

type ProgramsHeaderType = {
  prop: string;
  onBack: () => void;
  Screen: string;
};

const ProgramsHeader = ({ prop, onBack, Screen }: ProgramsHeaderType) => {
  const theme = useTheme();
  return (
    <View style={{}}>
      {prop == "initialScreen" ? (
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 26,
                fontWeight: "800",
              }}
            >
              Services & Programs
            </Text>
          </View>
        </View>
      ) : prop == "Select" ? (
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 40,
              width: 40,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={onBack}
          >
            <Backarrow />
          </TouchableOpacity>
          <View style={{ marginHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 26,
                fontWeight: "800",
              }}
            >
              {Screen === "program" ? "netWORKS" : "Select Programs"}
            </Text>
          </View>
        </View>
      ) : prop == "eligibility" ? (
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 40,
              width: 40,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={onBack}
          >
            <Backarrow />
          </TouchableOpacity>
          <View style={{ marginHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 26,
                fontWeight: "800",
              }}
            >
              {Screen === "eligibility"
                ? "Program Eligibility"
                : "Select Programs"}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default ProgramsHeader;
const styles = StyleSheet.create({});
