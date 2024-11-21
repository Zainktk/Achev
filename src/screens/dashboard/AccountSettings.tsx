import {
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";

import { RightArrow, RightArrowDark } from "@utils";
import { Divider, useTheme } from "react-native-paper";
import { ScreenText } from "@atoms";
import ProfileLayout from "../ProfileLayout";

type accountSettingsType = {
  name: string;
  path: string;
};

const accountSettings: accountSettingsType[] = [
  {
    name: "Change Email",
    path: "changeEmailFlow",
  },
  {
    name: "Change Password",
    path: "changePassword",
  },
  {
    name: "Edit Personal Information",
    path: "editBio",
  },
];
type Props = NativeStackScreenProps<AuthRoutes, "accountSettings">;
const AccountSettings = ({ navigation, route }: Props) => {
  const theme = useTheme();
  let isDarkMode = useColorScheme() === "dark";

  const handleNaviagtion = (value: GestureResponderEvent, path: string) => {
    if (path === "editBio")
      navigation.navigate(path, {
        isEdit: true,
      });
    else navigation.navigate(path);
  };
  return (
    <ProfileLayout navigation={navigation} routeName={route.name}>
      <View style={styles.accountSettingsContainer}>
        <FlatList
          data={accountSettings}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20, gap: 25 }}>
              <Pressable
                onPress={(value) => handleNaviagtion(value, item.path)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                  }}
                >
                  <ScreenText
                    styles={{
                      textTransform: "capitalize",
                      fontSize: theme?.fonts?.displayMedium.fontSize,
                      fontFamily: theme?.fonts?.displayMedium.fontFamily,
                    }}
                    label={item.name}
                  />

                  <TouchableOpacity
                    onPress={(value) => handleNaviagtion(value, item.path)}
                  >
                    {<RightArrow />}
                  </TouchableOpacity>
                </View>
              </Pressable>

              <Divider
                bold
                style={{
                  backgroundColor: theme?.colors?.divider,
                }}
              />
            </View>
          )}
        />
      </View>
    </ProfileLayout>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  accountSettingsContainer: {
    gap: 10,
    flex: 2,
  },
});
