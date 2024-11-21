import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { useTheme } from "react-native-paper";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const ProgramEligibilityFields = () => {
  const [isloading, setIsLoading] = useState(true);
  const [responsedata, setResponseData] = useState({});
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const route = useRoute();

  const fetchContent = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        `https://oneclientapi.achev.ca/api/Programs/ProgramEligibilityItems/${route.params?.id}`,
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

  return (
    <View style={{ paddingTop: insets.top + 10 }}>
      <Text>ProgramEligibilityFields</Text>
    </View>
  );
};

export default ProgramEligibilityFields;

const styles = StyleSheet.create({});
