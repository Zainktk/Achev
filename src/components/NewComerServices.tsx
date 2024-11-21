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
const NewComerServices = ({
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
                ? "rgba(246, 229, 235, 1)"
                : "rgba(165, 0, 52, 1)",
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
                marginLeft: 25,
                color: "rgba(255, 255, 255, 1)",
                fontFamily: theme.fonts.labelLarge.fontFamily,
                fontSize: 14,
                fontWeight: "700",
                flexWrap: "wrap",
                textAlign: "left",
              }}
              numberOfLines={2}
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

export default NewComerServices;

const styles = StyleSheet.create({});
