import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
type Eventcomptype = {
  image: any;
  title: string;
  Time: string;
  end_date: string;
  onPress: () => void;
  venue: string;
};
const EventsComp = ({
  image,
  title,
  Time,
  end_date,
  onPress,
  venue,
}: Eventcomptype) => {
  const theme = useTheme();

  const startDate = new Date(Time);
  const hours = String(startDate.getHours()).padStart(2, "0");
  const minutes = String(startDate.getMinutes()).padStart(2, "0");

  const endDate = new Date();
  const endhours = String(endDate.getHours()).padStart(2, "0");
  const endminutes = String(endDate.getMinutes()).padStart(2, "0");

  console.log("venue-------------==-=-=-=->>>>>>", venue);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}
      >
        <Image source={{ uri: `${image}` }} style={{ height: 70, width: 90 }} />

        {venue === "Online" ? (
          <View
            style={{
              position: "absolute",
              borderRadius: 5,
              backgroundColor: "#E04F39",
              width: 45,
              alignItems: "center",
              height: 20,
              left: 50,
              top: 48,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontFamily: theme.fonts.labelMedium.fontFamily,
                fontSize: 11,
                fontWeight: "800",
              }}
            >
              online
            </Text>
          </View>
        ) : null}

        <View style={{ flex: 2 }}>
          <Text
            style={{
              flexWrap: "wrap",
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "700",
              fontSize: 16,
              color: theme.colors.secondary,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "500",
              fontSize: 13,
              color: theme.colors.primary,
            }}
          >
            {new Date(Time).toLocaleString("default", { month: "long" })}&nbsp;
            {new Date(Time).getDate()}, {new Date(Time).getFullYear()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventsComp;

const styles = StyleSheet.create({});
