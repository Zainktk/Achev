import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";
type Programstype = {
  date: Date;
  status: string;
  name: string;
};
const MyProgramsComp = ({ date, status, name }: Programstype) => {
  return (
    <View style={{ marginHorizontal: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
        <Text style={{ color: "#E04F39" }}>{status}</Text>
      </View>
      <View>
        <Text>{name}</Text>
      </View>
      <Divider
        style={{
          backgroundColor: "#776E64",
          borderWidth: 0.4,
          marginTop: 10,
        }}
      />
    </View>
  );
};

export default MyProgramsComp;

const styles = StyleSheet.create({});
