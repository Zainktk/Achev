import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileManagement from "../../screens/dashboard/ProfileManagement";
import MyProfile from "../../screens/MyProfile";
import EditName from "../../screens/EditName";
import EditlastName from "../../screens/EditlastName";
import EditPhone from "../../screens/EditPhone";
import EditPostalCode from "../../screens/EditPostalCode";
import EditDateOfBirth from "../../screens/EditDateOfBirth";
import EditSttausCanadaScreen from "../../screens/EditSttausCanadaScreen";
import EditGender from "../../screens/EditGender";
import EditDesignatedGroup from "../../screens/EditDesignatedGroup";
import PrivacyPolicy from "../../screens/PrivacyPolicy";
import RequestScreen from "../../screens/RequestScreen";
import EditEmploymentStatus from "../../screens/EditEmploymentStatus";
import MyPrograms from "../../screens/MyPrograms";
import EditPassword from "../../screens/dashboard/EditPassword";
import ForgotConfirm from "../../screens/ForgotConfirm";
import ChangePasswordOtp from "../../screens/ChangePasswordOtp";
import NotifScreen from "../../screens/NotifScreen";
import RemoveAccount from "../../screens/RemoveAccount";

export type ProfileStackType = {
  MainProfile: undefined;
  profile: undefined;
  editName: { name: string | undefined };
  editlastName: { name: string | undefined };
  phoneEdit: { name: string | undefined | null };
  postalCodeEdit: { name: string | undefined | null };
  DateOfBirthEdit: { name: string | number | Date | undefined };
  StatusInCanada: { name: number | null };
  EditGender: { name: number | null };
  EditGroup: { name: number[] | null };
  editEmployment: { name: number | null };
  privacyPolicy: undefined;
  requesetToRemove: undefined;
  myPrograms: undefined;
  Password: undefined;
  ForgotConfirmScreen: { email: string | undefined };
  changePasswordotp: undefined;
  notifScreen: undefined;
  removeAccount: undefined;
};

const ProfileNavigation = () => {
  const profileStack = createNativeStackNavigator<ProfileStackType>();
  return (
    <profileStack.Navigator initialRouteName="MainProfile">
      <profileStack.Screen
        name="MainProfile"
        component={ProfileManagement}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="profile"
        component={MyProfile}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="editName"
        component={EditName}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="editlastName"
        component={EditlastName}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="phoneEdit"
        component={EditPhone}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="postalCodeEdit"
        component={EditPostalCode}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="DateOfBirthEdit"
        component={EditDateOfBirth}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="StatusInCanada"
        component={EditSttausCanadaScreen}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="EditGender"
        component={EditGender}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="EditGroup"
        component={EditDesignatedGroup}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="requesetToRemove"
        component={RequestScreen}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="editEmployment"
        component={EditEmploymentStatus}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="myPrograms"
        component={MyPrograms}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="Password"
        component={EditPassword}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="changePasswordotp"
        component={ChangePasswordOtp}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="notifScreen"
        component={NotifScreen}
        options={{ headerShown: false }}
      />
      <profileStack.Screen
        name="removeAccount"
        component={RemoveAccount}
        options={{ headerShown: false }}
      />
    </profileStack.Navigator>
  );
};

export default ProfileNavigation;

const styles = StyleSheet.create({});
