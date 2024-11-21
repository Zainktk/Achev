import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { Backarrow } from "@utils";

type FilterEventstypes = {
  onpressDayListBack: () => void;
  setSelectedDays: (venue: string) => void;
  selectedDays: string;
  filteredEvents: string[];
};

const SelectServices = ({
  onpressDayListBack,
  setSelectedDays,
  selectedDays,
}: FilterEventstypes) => {
  const theme = useTheme();
  const venues = [
    "Youth Services",
    "Language Services",
    "Employment Services - Job Seeker",
    "Employment Services - Employer",
    "Newcomer Services",
    "General",
  ];

  const toggleDaySelection = (venue: string) => {
    setSelectedDays(venue === selectedDays ? "" : venue);
  };

  const renderVenues = () => {
    return venues.map((venue, index) => (
      <View
        key={venue}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          marginVertical: 10,
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
            borderColor: selectedDays === venue ? "black" : "gray",
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
              backgroundColor: selectedDays === venue ? "black" : "transparent",
            }}
          ></View>
        </TouchableOpacity>
      </View>
    ));
  };

  const handleReset = () => {
    setSelectedDays("");
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
        <TouchableOpacity onPress={onpressDayListBack}>
          <Backarrow />
        </TouchableOpacity>
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
        <TouchableOpacity onPress={handleReset}>
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
      <View style={{ marginTop: 20 }}>{renderVenues()}</View>
    </View>
  );
};

export default SelectServices;
