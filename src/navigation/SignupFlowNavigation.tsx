import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import {
  EmailScreen,
  MedicalSetbacks,
  MedicalSetbacksCatogaries,
  RPDonorPreferences,
  ReproductiveProcess,
  ReproductiveProcessOptions,
  UserInfo,
} from "@screens";
import { AuthRoutes } from "@types";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type Props = NativeStackScreenProps<AuthRoutes, "signupFlow">;
const SignupFlowNavigation = ({ route, navigation }: Props) => {
  const Stack = createNativeStackNavigator<AuthRoutes>();

  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator initialRouteName="signup">
      <Stack.Screen
        options={{ headerShown: false }}
        name="signup"
        component={EmailScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        initialParams={{ screenNumber: 1 }}
        name="userInfo"
        component={UserInfo}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        initialParams={{ screenNumber: 2 }}
        name="selectReproductiveProcess"
        component={ReproductiveProcess}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="selectReproductiveProcessFromList"
        component={ReproductiveProcessOptions}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="rpDonorPreferences"
        component={RPDonorPreferences}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        initialParams={{ screenNumber: 3 }}
        name="medicalSetBacks"
        component={MedicalSetbacks}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="medicalSetBacksCatogaries"
        component={MedicalSetbacksCatogaries}
      />
    </Stack.Navigator>
  );
};

export default SignupFlowNavigation;

const styles = StyleSheet.create({});
