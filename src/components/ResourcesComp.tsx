import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ResourceStackType } from "src/navigation/dashboard/ResourcesNavigation";
import { useNavigation } from "@react-navigation/native";

type ResourcesNametype = {
  item: string;
};

const ResourcesComp = ({ item }: ResourcesNametype) => {
  const theme = useTheme();

  const ResourceStack =
    useNavigation<NativeStackNavigationProp<ResourceStackType>>();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        ResourceStack.navigate("resourcesFiles", {
          item: item,
        })
      }
    >
      <Text
        style={[styles.text, { fontFamily: theme.fonts.labelLarge.fontFamily }]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default ResourcesComp;

const styles = StyleSheet.create({
  card: {
    height: 120,
    width: 140,
    backgroundColor: "#776E64",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
});
