import { Buttonn } from "@atoms";
import { Backarrow, ForwardArrow } from "@utils";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";

type FilterEventstypes = {
  Resetfilter: () => void;
  onPressBack: () => void;
  onpressVenue: () => void;
  onPressApplyfilter: () => void;
  onpressDay: () => void;
  onpressCity: () => void;
  selectedDays: string;
  selectvenue: string;
  selectedcity: string;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const filterlists = [];

const FilterEvents = ({
  onPressBack,
  onpressVenue,
  onPressApplyfilter,
  onpressDay,
  onpressCity,
  selectedDays,
  selectvenue,
  Resetfilter,
  selectedcity,
}: FilterEventstypes) => {
  const theme = useTheme();

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              fontFamily: theme.fonts.labelMedium.fontFamily,
              color: "rgba(0, 0, 0, 1)",
            }}
          >
            Filter
          </Text>
        </View>
        <TouchableOpacity onPress={Resetfilter}>
          <Text
            style={{
              fontFamily: theme.fonts.labelMedium.fontFamily,
              fontWeight: "500",
              fontSize: 16,
              color: "rgba(119, 110, 100, 1)",
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 20 }}>
        <Text style={{ marginTop: -15, marginHorizontal: 20 }}>
          {selectvenue}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
          onPress={onpressDay}
        >
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            Day
          </Text>
          <TouchableOpacity onPress={onpressDay}>
            <ForwardArrow />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={{ marginTop: -15, marginHorizontal: 20 }}>
          {selectedDays}
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
          onPress={onpressCity}
        >
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            City
          </Text>
          <TouchableOpacity onPress={onpressCity}>
            <ForwardArrow />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={{ marginTop: -15, marginHorizontal: 20 }}>
          {selectedcity}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  container: {},
  buttonText: {
    fontSize: 20,
  },
};

export default FilterEvents;
