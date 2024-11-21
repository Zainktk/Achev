import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
type Props = {
  image: any;
  Time: string;
  Day: string;
  onPress: () => void;
};
const NewsCarousalComp = ({ image, Time, Day, onPress }: Props) => {
  const theme = useTheme();
  console.log("time-->", Time);
  return (
    <TouchableOpacity style={{}} onPress={onPress}>
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
          borderColor: "rgba(247, 251, 250, 1)",
          padding: 10,
          width: "96%",
          borderWidth: 2,
          alignSelf: "center",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: "rgba(247, 251, 250, 1)",
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
            {new Date(Time).toLocaleString("default", { month: "long" })}&nbsp;
            {new Date(Time).getDate()}, {new Date(Time).getFullYear()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCarousalComp;

const styles = StyleSheet.create({});
