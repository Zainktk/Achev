import { Buttonn } from "@atoms";
import { Backarrow, ForwardArrow } from "@utils";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";

type FilterEventstypes = {
  onPressBack: () => void;
  onpressVenue: () => void;
  onPressApplyfilter: () => void;
  onpressDay: () => void;
  onpressCity: () => void;
  selectedDays: string;
  selectvenue: string;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  Resetfilter: () => void;
};

const filterlists = [];

const FilterLocations = ({
  onPressBack,
  onpressVenue,
  onPressApplyfilter,
  onpressDay,
  onpressCity,
  selectedDays,
  selectvenue,
  Resetfilter,
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
        <TouchableOpacity>
          <Text
            style={{
              fontFamily: theme.fonts.labelMedium.fontFamily,
              fontWeight: "500",
              fontSize: 16,
              color: "rgba(119, 110, 100, 1)",
            }}
            onPress={Resetfilter}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
          onPress={onpressVenue}
        >
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            Location
          </Text>
          <TouchableOpacity onPress={onpressVenue}>
            <ForwardArrow />
          </TouchableOpacity>
        </TouchableOpacity>
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
            Services
          </Text>
          <TouchableOpacity onPress={onpressDay}>
            <ForwardArrow />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={{ marginTop: -15, marginHorizontal: 20 }}>
          {selectedDays}
        </Text>

        <View style={{}}>
          <Buttonn
            title={"Apply Filter"}
            ButtonStyle={{ marginTop: 60, height: 60, marginHorizontal: 20 }}
            onPress={onPressApplyfilter}
          />
        </View>
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

export default FilterLocations;
