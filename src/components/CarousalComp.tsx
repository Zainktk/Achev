import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
type Props = {
  image: any;
  Time: string;
  Day: string;
  end_date: string;
  id: string;
};
const CarousalComp = ({ image, Time, Day, end_date, id }: Props) => {
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();
  const theme = useTheme();
  console.log("time-->", Time);

  const formatTime = (date: string | number | Date) => {
    const hours = new Date(date).getHours();
    const minutes = String(new Date(date).getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0"); // Convert to 12-hour format and handle 12 PM/AM

    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <TouchableOpacity
      style={{}}
      onPress={() =>
        homeStack.navigate("downloadEvent", {
          eventId: id,
        })
      }
    >
      <Image
        source={{ uri: `${image}` }}
        style={{
          height: 100,
          width: "95%",
          alignSelf: "center",
          marginTop: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          marginRight: 80,
        }}
      />

      <View
        style={{
          borderColor: "rgba(250, 243, 240, 1)",
          height: 100,
          width: "95%",
          borderWidth: 2,
          alignSelf: "center",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: "rgba(250, 243, 240, 1)",
          marginRight: 80,
        }}
      >
        <View>
          <Text
            style={{
              marginHorizontal: 15,
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "700",
              fontSize: 12,
              color: theme.colors.secondary,
              marginTop: 15,
            }}
          >
            {Day}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              color: theme.colors.primary,
              fontSize: 12,
              marginTop: 10,
              marginHorizontal: 15,
            }}
          >
            {new Date(Time).toLocaleString("default", { month: "long" })}{" "}
            {new Date(Time).getDate()} @ {formatTime(Time)} -{" "}
            {formatTime(end_date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CarousalComp;

const styles = StyleSheet.create({});
