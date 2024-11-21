import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";

const onBoardingStack = createNativeStackNavigator();
function OnBoardingNavigation() {
  return (
    <onBoardingStack.Navigator
      initialRouteName="onboarding"
      screenOptions={{ headerShown: true }}
    >
      <onBoardingStack.Screen
        name="onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      {/* <onBoardingStack.Screen
        name="authStack"
        component={AuthNavigator}
        options={{headerShown: false}}
      /> */}
    </onBoardingStack.Navigator>
  );
}

export default OnBoardingNavigation;
