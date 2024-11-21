import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Backarrow } from "@utils";
import { useTheme } from "react-native-paper";
import { Buttonn, OutlinedButton } from "@atoms";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import emailjs, { EmailJSResponseStatus, send } from "emailjs-com";

const RemoveAccount = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();

  const theme = useTheme();
  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const onSubmit = async () => {
    profileStack.navigate("privacyPolicy");
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            gap: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 30,
              width: 30,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
          >
            <Backarrow />
          </TouchableOpacity>

          <Text style={styles.title}>Remove my Account</Text>
        </View>
        <Text
          style={[
            styles.description,
            {
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 16,
              fontWeight: "400",
              marginHorizontal: 10,
              marginTop: 30,
            },
          ]}
        >
          A request has been sent to remove your account. Please allow for up to
          7 business days for the request to be completed.
        </Text>
        <View
          style={{ justifyContent: "flex-end", flex: 1, alignItems: "center" }}
        >
          <OutlinedButton
            title={"Done"}
            ButtonStyle={{
              borderTopEndRadius: 30,
              borderBottomEndRadius: 30,
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              width: 300,
              borderWidth: 1,
            }}
            onPress={onSubmit}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  backButton: {
    top: 40,
    left: 20,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 50,
    height: 30,
    width: 30,

    shadowOpacity: 1,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: "left",
    color: "#777",
  },
  doneButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 100,
    alignSelf: "center",
    marginBottom: 30,
  },
  doneButtonText: {
    fontSize: 16,
    color: "#777",
  },
});

export default RemoveAccount;
