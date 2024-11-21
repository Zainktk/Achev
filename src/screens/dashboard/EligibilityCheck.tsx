import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import axios from "axios";
import { useReactiveVar } from "@apollo/client";
import {
  AppliedPrograms,
  NotifiAllowed,
  NotifiScreenVisited,
  userData,
  userToken,
} from "../../utils/GlobalVariables";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgramsHeader from "../../components/ProgramsHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgramScreenFlowType } from "src/navigation/dashboard/ProgramNavigator";
import { useTheme } from "react-native-paper";
import { Buttonn } from "@atoms";

const EligibilityCheck = () => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState({});
  const user = useReactiveVar(userData);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const token = useReactiveVar(userToken);
  const IsAllow = useReactiveVar(NotifiAllowed);
  const notifiVisit = useReactiveVar(NotifiScreenVisited);

  console.log("token===>------>>>", token);

  const ProgramStack =
    useNavigation<NativeStackNavigationProp<ProgramScreenFlowType>>();

  const route = useRoute();
  console.log("route?.params?.id---->>>>>>>", route?.params?.id);
  const fetchContent = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://oneclientapi.achev.ca/api/Programs/ProgramEligibilityCheck/${user?.id}/${route?.params?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Response Data:============---------=========>>>>>>",
        response?.data
      );
      setResponse(response?.data);
    } catch (error) {
      console.error(
        "Error fetching services:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const getToken = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      const expirationTime = await AsyncStorage.getItem("tokenExpirationTime");

      if (!token || !expirationTime || Date.now() >= Number(expirationTime)) {
        token = await login();
      }

      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  const login = async () => {
    try {
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/odoo/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "achev",
            password:
              "1TsraPAKp2fbV4x3vjtrhjtEa1QH0i9uBtwI45SKLZTY88MWEVdlI17epOM8pDBw8Cx5HJuOOUr4WOlXx8Nc6AZkBXyqauKc2IE20KIEEqii9zVRopgdCPZkVEfwoOQK",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
      }

      const data = await response.json();
      const token = data.token;
      const expirationTime = Date.now() + data.expiresIn * 1000;
      console.log("Token expiration time (in ms):", expirationTime);
      console.log(
        "Token expiration date:",
        new Date(expirationTime).toLocaleString()
      );

      if (token && expirationTime) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem(
          "tokenExpirationTime",
          expirationTime.toString()
        );
      }

      return token;
    } catch (error) {
      Snackbar.show({
        text: " sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
      console.error("Error logging in:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchContent();
    // AppliedPrograms((prev: string[] | null) => [
    //   ...(prev ?? []), // if prev is null, default to an empty array
    //   ...(Array.isArray(route?.params?.name)
    //     ? route?.params?.name
    //     : [route?.params?.name]), // handle both string and array types
    // ]);
  }, []);

  console.log("user-------------->", user?.dateOfBirth);
  console.log("statusInCanadaId-------------->", user?.statusInCanadaId);
  console.log("ID-------------->", userData()?.id);
  console.log("stateId-------------->", user?.stateId);
  console.log(
    "educationOutsideOfCanadaId-------------->",
    user?.educationOutsideOfCanadaId
  );
  return (
    <View style={{ paddingTop: insets.top + 10, flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <View>
            <ProgramsHeader
              prop={"eligibility"}
              Screen={"eligibility"}
              onBack={() => ProgramStack.navigate("program")}
            />
          </View>

          {response?.eligible === true &&
            response?.approved === true &&
            response?.languageAsessmentCenter === false && (
              <View style={{ marginTop: 50, gap: 20, marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  Thank you for registering for
                  <Text
                    style={{
                      color: "#E04F39",
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      fontSize: 16,
                      lineHeight: 25,
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    {route?.params?.name}
                  </Text>
                  . Your registration was successful!
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  A staff member from Achēv will reach out to you by email
                  within 1-5 business days.
                </Text>
              </View>
            )}

          {response?.eligible === true &&
            response?.approved === false &&
            response?.languageAsessmentCenter === false && (
              <View style={{ marginTop: 50, gap: 20, marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  Thank you for your interest in{" "}
                  <Text
                    style={{
                      color: "#E04F39",
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      fontSize: 16,
                      lineHeight: 25,
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    {route?.params?.name}
                  </Text>
                  . Your application to register has been received and will be
                  reviewed by a staff member.
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  If your registration is successful, a staff member will reach
                  out to you by email within 1-5 business days. If your
                  registration is not successful, you will receive notice by
                  email.You can also check your application status in your
                  profile under My Programs.
                </Text>
              </View>
            )}

          {response?.eligible === false &&
            response?.languageAsessmentCenter === false && (
              <View style={{ marginTop: 50, gap: 20, marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  Thank you for your interest in{" "}
                  <Text
                    style={{
                      color: "#E04F39",
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      fontSize: 16,
                      lineHeight: 25,
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    {route?.params?.name}
                  </Text>{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  Unfortunately you do not meet the eligibility requirements for
                  this program,
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  Take a look at our other programs.
                </Text>
              </View>
            )}

          {response?.eligible === true &&
            response?.inOntario === true &&
            response?.languageAsessmentCenter === true && (
              <View style={{ marginTop: 50, gap: 20 }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  Thank you for your interest in completing a language
                  assessment
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  Thank you for your interest in completing a language
                  assessment Achev Language Assessment Services provide free
                  English/French language assessments and class referrals to
                  eligible immigrants seeking language training in the Greater
                  Toronto Area. To book your language assessment, please
                  complete the Assessment Request Form for the area where you
                  would like to complete your assessment. YORK/SIMCOE/DURHAM
                  PEEL/HALTON/DUFFERIN If you are not located in the GTA, check
                  out other Assessment Centres in Ontario. Assessment Centres in
                  Ontario Done
                </Text>
              </View>
            )}
        </View>
        <View
          style={{
            justifyContent: "flex-end",

            marginHorizontal: 15,
            marginBottom: 70,
          }}
        >
          {response?.eligible === false &&
          response?.languageAsessmentCenter === false ? (
            <Buttonn
              title={"View other programs"}
              onPress={() => {
                ProgramStack.navigate("program");
              }}
            />
          ) : (
            <Buttonn
              title={"Done"}
              onPress={() => {
                if (notifiVisit === undefined) {
                  ProgramStack.navigate("allownotifi");
                } else {
                  ProgramStack.navigate("program");
                }
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EligibilityCheck;

const styles = StyleSheet.create({});
