import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { Buttonn } from "@atoms";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
import { useReactiveVar } from "@apollo/client";
import { NotifiAllowed, NotifiScreenVisited } from "@utils";

const Registered = () => {
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();

  const onpress = () => {
    homeStack.navigate("eventDetail");
  };
  const theme = useTheme();

  const route = useRoute();

  const startDate = new Date(route?.params?.event?.start_date);
  const hours = String(startDate.getHours()).padStart(2, "0");
  const minutes = String(startDate.getMinutes()).padStart(2, "0");

  const endDate = new Date(route?.params?.event?.end_date);
  const endhours = String(endDate.getHours()).padStart(2, "0");
  const endminutes = String(endDate.getMinutes()).padStart(2, "0");
  const IsAllow = useReactiveVar(NotifiAllowed);
  const notifiVisit = useReactiveVar(NotifiScreenVisited);

  return (
    <SafeAreaView>
      <View>
        <Text
          style={{
            marginLeft: 20,
            marginTop: 20,
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 14,
            fontWeight: "800",
          }}
        >
          Registered for event:
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <Image
          source={{
            uri: route?.params?.img,
          }}
          style={{ height: 80, width: 80, marginLeft: 20, marginTop: 20 }}
        />

        <View style={{ flex: 2 }}>
          <Text
            style={{
              flexWrap: "wrap",
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "700",
              fontSize: 16,
              color: theme.colors.secondary,

              width: "100%",
              marginTop: 20,
            }}
          >
            {route?.params?.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "400", color: "#555" }}>
              {new Date(route?.params?.event?.start_date).toLocaleString(
                "default",
                {
                  month: "long",
                }
              )}{" "}
              {new Date(route?.params?.event?.start_date).getDate()}{" "}
              {new Date(route?.params?.event?.start_date).getFullYear()} {hours}
              :{minutes} - {endhours}:{endminutes}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <View
          style={{
            width: "80%",
            height: 2,
            alignSelf: "center",
            backgroundColor: "rgba(204, 204, 204, 1)",
          }}
        ></View>
      </View>
      <View style={{ marginTop: 50, paddingHorizontal: 60 }}>
        <Text
          style={{
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontWeight: "400",
            fontSize: 22,
            color: "rgba(0, 0, 0, 1)",
          }}
        >
          Thank you for registering. Look out for further details and updates
          via email.
        </Text>
      </View>
      <View style={{ alignSelf: "center", marginTop: 80 }}>
        <Buttonn
          title={"Done"}
          ButtonStyle={{ marginHorizontal: 80, width: "50%" }}
          LabelStyle={{
            fontSize: 16,
            fontWeight: "700",
            fontFamily: theme.fonts.labelLarge.fontFamily,
          }}
          onPress={() => {
            if (notifiVisit === undefined) {
              homeStack.navigate("Allowhome");
            } else {
              homeStack.navigate("eventDetail");
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Registered;

const styles = StyleSheet.create({});
