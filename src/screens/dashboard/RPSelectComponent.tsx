import { ScreenText } from "@atoms";
import { ReproductivePreferences } from "@types";
import { RightArrow } from "@utils";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
type Props = {
  name: string;
  icon: React.ReactElement;
  path: string;
  navigation: any;
  options: ReproductivePreferences;
  selectedOptions: string | string[];
  multiSelect: boolean;
  donorPreferences: ReproductivePreferences;
};

const RPSelectComponent = ({
  name,
  icon,
  path,
  navigation,
  options,
  selectedOptions,
  multiSelect,
}: Props) => {
  const theme = useTheme();

  const handleNavigation = () => {
    if (path === "medicalSetBacks") {
      navigation.navigate("medicalSetBacks");
      return;
    }
    navigation.navigate("updatedRpStatusFlow", {
      screen: path,
      params: { rpOptions: options, multiSelect },
    });
  };
  return (
    <View style={{ marginVertical: 8 }}>
      <Pressable onPress={handleNavigation}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <View
              style={{
                ...styles.heartIcon,
                backgroundColor: theme?.colors?.primary,
              }}
            >
              {icon}
            </View>
            <View style={{ flex: 1 }}>
              <ScreenText styles={{ fontSize: 15.5 }} label={name} />
              <View>
                <ScreenText
                  styles={{ fontSize: 15.5 }}
                  color={theme?.colors?.primary}
                  label={selectedOptions}
                />
              </View>
            </View>
          </View>

          <RightArrow />
        </View>
      </Pressable>
    </View>
  );
};

export default RPSelectComponent;

const styles = StyleSheet.create({
  heartIcon: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  preferences: {
    // width: "90%",
    // flex: 2,
  },
});
