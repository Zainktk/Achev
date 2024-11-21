import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { Backarrow } from "@utils";

type FilterEventstypes = {
  onpressVenueListBack: () => void;
  setSelectedvenue: (venue: string) => void;
  selectvenue: string;
  filteredEvents: string[];
};

const SelectVenue = ({
  onpressVenueListBack,
  setSelectedvenue,
  selectvenue,
}: FilterEventstypes) => {
  const theme = useTheme();
  const venues = [
    "90 Burnhamthorpe Road West",
    "Achēv",
    "Achēv - Mississauga City Centre",
    "Achēv Brampton South",
    "Brampton East",
    "Brampton South",
    "Cooking Class",
    "Employment Ontario Services - Brampton South",
    "Employment Ontario Services - Malton",
    "Employment Ontario Services - Toronto",
    "Garden Square",
    "Gore Meadows Community Centre",
    "Heart Lake Conservation Park",
    "Jim Archdekin Community Centre",
    "Job Seeker, Brampton East",
    "Job Seeker, Brampton South",
    "Job Seeker, Don Mills",
    "Job Seeker, Malton",
    "Job Seeker, Mississauga",
    "Job Seeker, Toronto",
    "Malton",
    "Metropolitan Community Church of Toronto",
    "Mississauga - Malton",
    "Newcomer Information Centre - Brampton East",
    "Newcomer Information Centre - Brampton South",
    "Newcomer Information Centre - Malton",
    "Newcomer Information Centre - Mississauga",
    "Newcomer Information Centre - Oakville",
    "Online",
    "RBC Towers",
    "RISE Program - Mississauga",
    "Seniors Engagement & Empowerment Network - Brampton East",
    "Seniors Engagement & Empowerment Network - Brampton South",
    "Seniors Engagement & Empowerment Network - Malton",
    "Seniors Engagement & Empowerment Network - Mississauga",
    "Seniors Engagement & Empowerment Network - Oakville",
    "Seva Food Bank",
    "Sheridan College - Davis Campus",
    "Shops at Don Mills - Blue Office Tower Lobby",
    "STC Events",
    "The Honorable William G. Davis Centre for Families",
    "Toronto",
    "Wellness Response and Assistance Program (WRAP) - Mississauga",
  ];

  const toggleDaySelection = (venue: string) => {
    setSelectedvenue(venue === selectvenue ? "" : venue);
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
            borderColor: selectvenue === venue ? "black" : "gray",
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
              backgroundColor: selectvenue === venue ? "black" : "transparent",
            }}
          ></View>
        </TouchableOpacity>
      </View>
    ));
  };

  const handleReset = () => {
    setSelectedvenue("");
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
        <TouchableOpacity onPress={onpressVenueListBack}>
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

export default SelectVenue;
