import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { useTheme } from "react-native-paper";
import axios from "axios";
import { Backarrow, userToken } from "@utils";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgramScreenFlowType } from "src/navigation/dashboard/ProgramNavigator";
import RenderHtml from "react-native-render-html";
import { Buttonn, OutlinedButton } from "@atoms";
import { useReactiveVar } from "@apollo/client";
import LottieView from "lottie-react-native";
import AchevLoader from ".././assets/AchevLoader.json";

const ProgramContent = () => {
  const [isloading, setIsLoading] = useState(true);
  const [responsedata, setResponseData] = useState({});
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const theme = useTheme();
  const token = useReactiveVar(userToken);
  console.log("Routess--->", route.params?.id);
  const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
  const viewHeight = windowHeight * 0.12;
  const viewWidth = windowWidth * 1;

  const ProgramStack =
    useNavigation<NativeStackNavigationProp<ProgramScreenFlowType>>();
  const fetchContent = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://oneclientapi.achev.ca/api/Programs/ProgramContent/${route.params?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response Data:=====================>>>>>>", response?.data);
      setResponseData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(
        "Error fetching services:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
  useEffect(() => {
    fetchContent();
  }, []);
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
          }), // replace with actual credentials
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
      }

      const data = await response.json();
      const token = data.token;
      console.log("data---------->>>>>>>", data);
      const expirationTime = Date.now() + data.expiresIn * 10000; // Assuming `expiresIn` is in seconds

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

  const customStyles = {
    body: {
      fontFamily: theme.fonts.labelLarge.fontFamily,
      fontSize: 16,
    },
  };

  console.log("status====>>>>>", route.params?.status);

  if (isloading) {
    return (
      <LottieView
        source={AchevLoader}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
          justifyContent: "center",
          alignSelf: "center",
          flex: 1,
        }}
      />
    );
  }

  return (
    <>
      <ScrollView style={{ paddingTop: insets.top + 10, flex: 1 }}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 50,
              width: 50,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={() => ProgramStack.goBack()}
          >
            <Backarrow />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontWeight: "800",
              fontSize: 26,
              paddingHorizontal: 30,
            }}
          >
            {responsedata?.name}
          </Text>
        </View>
        <View
          style={{ marginHorizontal: 20, marginTop: 20, marginBottom: "40%" }}
        >
          {responsedata?.content ? (
            <RenderHtml
              contentWidth={200}
              tagsStyles={customStyles}
              source={{ html: responsedata?.content }}
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <Text>No content available</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          shadowOpacity: 1,
          shadowColor: "rgba(0, 0, 0, 0.15)",
          flexDirection: "row",
          gap: 40,
          flex: 1,
          bottom: 1,
          position: "absolute",
          width: viewWidth,
          height: viewHeight,
        }}
      >
        <OutlinedButton
          title={"Cancel"}
          ButtonStyle={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            width: 150,
            borderColor: "rgba(119, 110, 100, 1)",
          }}
          onPress={() => ProgramStack.goBack()}
        />
        <Buttonn
          title={"Apply"}
          disabled={route.params?.status === "Pending" ? true : false}
          ButtonStyle={{ width: 150 }}
          onPress={() =>
            ProgramStack.navigate("eligibility", {
              id: route.params?.id,
              name: responsedata?.name,
            })
          }
        />
      </View>
    </>
  );
};

export default ProgramContent;

const styles = StyleSheet.create({});
