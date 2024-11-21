import { StyleSheet } from "react-native";
import AuthNavigation from "./AuthNavigation";
import { useReactiveVar } from "@apollo/client";
import { LoggedInUser, newUser, onBoarding, userToken } from "@utils";
import { Demo, SplashScreen } from "@screens";
import AppTabNaviagtor from "./dashboard/AppTabNaviagtor";
import OnBoardingNavigation from "./OnBoardingNavigation";
import SignupFlowNavigation from "./ResetPasswordNavigation";
import { useNavigation } from "@react-navigation/native";
const RootNavigation = () => {
  const user = useReactiveVar(userToken);
  const boarding = useReactiveVar(onBoarding);
  const loggedInProfileVar = useReactiveVar(LoggedInUser);
  const newuser = useReactiveVar(newUser);

  // if (loggedInProfileVar === undefined) return <SplashScreen></SplashScreen>;
  // if (loggedInProfileVar === null) return <AuthNavigation />;
  if (user === undefined) {
    return <SplashScreen />;
  }
  if (user === null) {
    if (boarding === null) {
      return <OnBoardingNavigation />;
    } else {
      return <AuthNavigation />;
    }

    // if (isShowOnborading===) {x
    //   return <OnBoardingNavigation />;
    // } else {
    //   <AuthNavigator />;
    // }
  }

  return <AppTabNaviagtor />;
};
export default RootNavigation;

const styles = StyleSheet.create({});
