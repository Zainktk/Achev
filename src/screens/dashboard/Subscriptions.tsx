import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";

import ProfileLayout from "../ProfileLayout";
import { ScreenText } from "@atoms";
import { useTheme } from "react-native-paper";
import { SubscriptionCard } from "@components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import Carousel from "react-native-snap-carousel";
type Props = NativeStackScreenProps<AuthRoutes, "subscribePlan">;
type CarouselItem = { item: { id: string; subscriptionCatogary: string } };
const Subscriptions = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const DATA = [
    { id: "1", subscriptionCatogary: "gold" },
    { id: "2", subscriptionCatogary: "diamond" },
    // Add more data as needed
  ];
  const { width: viewportWidth } = Dimensions.get("window");

  return (
    <ProfileLayout navigation={navigation} routeName={route.name}>
      <View style={{ flex: 1 }}>
        <View style={{ gap: 5, marginBottom: 15 }}>
          <ScreenText
            styles={{ fontFamily: theme?.fonts?.headlineMedium?.fontFamily }}
            label={"Get started with a free trial"}
          />
          <ScreenText
            styles={{
              fontSize: 14,
              fontFamily: theme?.fonts?.displayMedium?.fontFamily,
            }}
            label={
              "Billing Starts on March 9, 2024. You can cancel at any time."
            }
          />
          <ScreenText
            styles={{
              fontSize: 14,
              fontFamily: theme?.fonts?.displayMedium?.fontFamily,
            }}
            label={"Auto renewal is set for xx date"}
          />
        </View>
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <Carousel
            //   ref={(c) => {
            //     this._carousel = c;
            //   }}
            data={DATA}
            renderItem={({ item }: CarouselItem) => (
              <SubscriptionCard
                subscriptionCatogary={item.subscriptionCatogary}
              />
            )}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth * 0.8}
          />
        </View>

        {/* <SubscriptionCard subscriptionCatogary="gold" /> */}
      </View>
    </ProfileLayout>
  );
};

export default Subscriptions;

const styles = StyleSheet.create({});
