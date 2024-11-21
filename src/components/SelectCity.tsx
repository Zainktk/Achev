import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { Backarrow, ForwardArrow } from "@utils";
import { Buttonn } from "./atoms/AppButtons";

type FilterEventstypes = {
  onpressCityListBack: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onPressApplyfilter: () => void;
};

const SelectCity = ({
  onpressCityListBack,
  selectedCity,
  setSelectedCity,
  onPressApplyfilter,
}: FilterEventstypes) => {
  const theme = useTheme();
  const [selectedVenueIndex, setSelectedVenueIndex] = useState(-1);
  const venues = ["Brampton", "Mississauga", "Oakville", "Toronto"];

  const toggleDaySelection = (city: string) => {
    setSelectedCity(city === selectedCity ? "" : city);
  };

  const renderDays = () => {
    return venues.map((venue, index) => (
      <View
        key={venue}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          columnGap: 60,
        }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontWeight: "500",
            fontSize: 16,
            width: 200,
          }}
        >
          {venue}
        </Text>
        <TouchableOpacity
          style={{
            height: 25,
            width: 25,
            borderWidth: 2,
            borderRadius: 30,
            backgroundColor: selectedCity === venue ? "" : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => toggleDaySelection(venue)}
        >
          <View
            style={{
              height: 15,
              width: 15,
              borderRadius: 30,
              backgroundColor: selectedCity === venue ? "black" : "transparent",
            }}
          ></View>
        </TouchableOpacity>
      </View>
    ));
  };

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
        <TouchableOpacity onPress={onpressCityListBack}>
          <Backarrow />
        </TouchableOpacity>
        <TouchableOpacity>
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
        </TouchableOpacity>
        <TouchableOpacity>
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
      <View style={{ gap: 25, marginTop: 20 }}>{renderDays()}</View>
      <View style={{}}>
        <Buttonn
          title={"Apply Filter"}
          ButtonStyle={{ marginTop: 60, height: 60, marginHorizontal: 20 }}
          onPress={onPressApplyfilter}
        />
      </View>
    </View>
  );
};

export default SelectCity;
