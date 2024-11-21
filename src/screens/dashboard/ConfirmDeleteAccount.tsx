import { OutlinedButton, ScreenText } from "@atoms";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import { useProfile } from "@hooks";
import { LoggedInUser, clearData, globalSuccessMessageVariable } from "@utils";
import ProfileLayout from "../ProfileLayout";

type Props = NativeStackScreenProps<AuthRoutes, "confirmDeleteAccount">;

const ConfirmDeleteAccount = ({ navigation, route }: Props) => {
  const theme = useTheme();

  const { reason } = route.params;
  const { DeleteUser } = useProfile();
  console.log(reason);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await DeleteUser({ reason });
      if (res) {
        globalSuccessMessageVariable({
          message: "Account Deletion Successfull",
        });
        try {
          await clearData();
          LoggedInUser(null);
        } catch (err) {
          console.log(err);
        }

        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <ProfileLayout routeName={"deleteAccount"} navigation={navigation}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View
          style={{
            ...styles.ConfirmDeleteAccountBackground,
            // backgroundColor: theme?.colors?.tertiary,
            borderColor: theme?.colors?.outline,
          }}
        >
          <ScreenText
            label="Are you you sure you want 
            to delete your account?"
            styles={{
              textAlign: "center",
              fontSize: theme?.fonts?.labelMedium?.fontSize,
              marginBottom: 10,
            }}
          />
          <ScreenText
            label="If you delete your account, we will permanently erase all your information from our database. This cannot be undone!"
            styles={{
              textAlign: "center",
              fontSize: theme?.fonts?.labelMedium?.fontSize,
              fontFamily: theme?.fonts?.displaySmall.fontFamily,
              marginBottom: 10,
            }}
          />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></View>

            <View style={styles.ConfirmDeleteAccountScreenButton}>
              <OutlinedButton
                onPress={handleSubmit}
                ButtonStyle={{
                  backgroundColor: "transparent",
                  borderColor: "background: rgba(255, 96, 96, 1)",
                  borderWidth: 1,
                }}
                LabelStyle={{ color: " rgba(255, 96, 96, 1)" }}
                title="Confirm Deletion"
              />
            </View>
          </View>
        </View>
      </View>
    </ProfileLayout>
  );
};

export default ConfirmDeleteAccount;

const styles = StyleSheet.create({
  ConfirmDeleteAccountBackground: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 40,
    borderWidth: 1,
  },
  ConfirmDeleteAccountScreenButton: {
    padding: 15,
    marginTop: 20,

    marginLeft: "auto",
    marginRight: "auto",
  },
  boxCheck: {
    // marginTop: Platform.OS === "ios" ? hp(0.4) : hp(0),
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    // marginRight: 40,
  },
});
