import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { useReactiveVar } from "@apollo/client";
import { AppliedPrograms } from "@utils";
type EmploymentServicestype = {
  service: string;
  id: number;
  onPress: (id: number, status: string) => void;
  status: string;
};
const LanguageServices = ({
  service,
  onPress,
  id,
  status,
}: EmploymentServicestype) => {
  const theme = useTheme();
  const name = useReactiveVar(AppliedPrograms);
  return (
    <View>
      <TouchableOpacity style={{}} onPress={() => onPress(id, status)}>
        <View
          style={{
            backgroundColor:
              status === "Pending"
                ? "rgba(244, 245, 246, 1)"
                : "rgba(71, 93, 118, 1)",
            height: 40,
            borderRadius: 20,
            marginHorizontal: 20,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              marginTop: 10,
            }}
          >
            <Text
              style={{
                marginLeft: 15,
                color: "rgba(255, 255, 255, 1)",
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 14,
                fontWeight: "700",
                flexWrap: "wrap",
                textAlign: "left",
              }}
              numberOfLines={2} // Allows text to wrap to the next line if needed
              ellipsizeMode="tail"
            >
              {service}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageServices;

const styles = StyleSheet.create({});
