import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ScreenSubText, ScreenTitle } from "@atoms";
import { Backarrow } from "@utils";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props =
  | NativeStackScreenProps<AuthRoutes, "signup">
  | NativeStackScreenProps<AuthRoutes, "PasswordResetEmail">;
const DobNote = ({ navigation, route }: Props) => {
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 50,
              width: 50,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={() => navigation.goBack()}
          >
            <Backarrow />
          </TouchableOpacity>
          <ScreenTitle
            label={"Sign up"}
            styles={{ textTransform: "capitalize" }}
          />
        </View>
        <View style={{ height: 50, marginTop: 65 }}>
          <Text
            style={[
              styles.note,
              {
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 14,
                lineHeight: 17.5,
              },
            ]}
          >
            <Text style={{ color: "#E25A45", fontWeight: "700" }}>ERROR:</Text>{" "}
            <Text style={{ fontWeight: "600" }}>
              You must be 14 years or older to create an account. To learn more
              about our available youth services, please visit: achev.ca
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DobNote;

const styles = StyleSheet.create({
  note: {
    color: "black",
    marginTop: 5,
    fontSize: 12,
    height: 100,
    width: "100%",
    backgroundColor: "#FAF3F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E25A45",
    padding: 20,
  },
});
