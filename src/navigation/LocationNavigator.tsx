import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import { Notification } from "@screens";
import VenueLocationScreen from "../screens/dashboard/VenueLocationScreen";
import VenueDetailScreen from "../screens/dashboard/VenueDetailScreen";

export type LocationScreenFlowType = {
  VenuesLocation: undefined;
  VenueDetails: {
    id: number;
  };
};

const LocationStack = createNativeStackNavigator<LocationScreenFlowType>();
function LocationNavigation() {
  return (
    <LocationStack.Navigator
      initialRouteName="VenuesLocation"
      screenOptions={{ headerShown: true }}
    >
      <LocationStack.Screen
        name="VenuesLocation"
        component={VenueLocationScreen}
        options={{ headerShown: false }}
      />
      <LocationStack.Screen
        name="VenueDetails"
        component={VenueDetailScreen}
        options={{ headerShown: false }}
      />
      {/* <onBoardingStack.Screen
        name="authStack"
        component={AuthNavigator}
        options={{headerShown: false}}
      /> */}
    </LocationStack.Navigator>
  );
}

export default LocationNavigation;
