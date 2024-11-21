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
const WomenServices = ({
  service,
  onPress,
  id,
  status,
}: EmploymentServicestype) => {
  const theme = useTheme();
  const name = useReactiveVar(AppliedPrograms);
  return (
    <View>
      <TouchableOpacity
        style={{}}
        onPress={() => onPress(id, status)}
        disabled={status === "Pending" ? true : false}
      >
        <View
          style={{
            backgroundColor:
              status === "Pending"
                ? "rgba(239, 232, 238, 1)"
                : "rgba(96, 25, 84, 1)",
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

export default WomenServices;

const styles = StyleSheet.create({});
