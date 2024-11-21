import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import axios from "axios";
import { useReactiveVar } from "@apollo/client";
import { Backarrow, userToken } from "@utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";
import { ResourceStackType } from "src/navigation/dashboard/ResourcesNavigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";

const NewScreen = () => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const token = useReactiveVar(userToken);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();

  const ResourceStack =
    useNavigation<NativeStackNavigationProp<ResourceStackType>>();

  const fetchContent = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://oneclientapi.achev.ca/api/Resources/SharedDocumentsFile/${route?.params?.item}/${route?.params?.filename}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setApiResponse(response); // Set the entire response object to state
      } else {
        setErrorMessage("Failed to fetch the content. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while fetching content."
      );
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
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
  }, []);

  if (loading) {
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

  if (errorMessage) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text style={{}}>Error: {errorMessage}</Text>
      </View>
    );
  }

  const handleOpenLink = () => {
    if (apiResponse?.request?.responseURL) {
      Linking.openURL(apiResponse.request.responseURL);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 10,

        backgroundColor: "white",
      }}
    >
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            marginRight: 30,
            backgroundColor: "white",
            shadowColor: "rgba(0, 0, 0, 0.25)",
            borderRadius: 50,
            height: 40,
            width: 40,

            shadowOpacity: 1,
            shadowRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            shadowOffset: {
              width: 0,
              height: 1,
            },
          }}
          onPress={() => ResourceStack.goBack()}
        >
          <Backarrow />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: theme.fonts.labelLarge.fontFamily,
            fontSize: 26,
            fontWeight: "800",
            marginLeft: 70,
          }}
        >
          File
        </Text>
      </View>
      <View
        style={{ justifyContent: "center", alignItems: "center", flex: 0.5 }}
      >
        <Text style={{ color: "black" }}>Document URL:</Text>
        <TouchableOpacity onPress={handleOpenLink}>
          <Text style={styles.link}>
            {apiResponse?.request?.responseURL || "No URL available"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
