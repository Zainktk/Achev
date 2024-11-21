import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";
import { NextArrow } from "@utils";

const ProfileComp = () => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>Profile</Text>
        <TouchableOpacity>
          <NextArrow />
        </TouchableOpacity>
      </View>
      <Divider
        style={{
          backgroundColor: "#776E64",
          borderWidth: 0.4,
        }}
      />
    </View>
  );
};

export default ProfileComp;

const styles = StyleSheet.create({});
