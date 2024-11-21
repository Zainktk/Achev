import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PdfSvg } from "../utils/Assets";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import axios from "axios";

type ResourcesNametype = {
  item: string;
  onpress: (item: string) => void;
  folder: string;
};

const ResourceFilesComp = ({ item, onpress, folder }: ResourcesNametype) => {
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(
        `https://oneclientapi.achev.ca/api/Resources/SharedDocumentsFile/${folder}/${item}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setApiResponse(response);
        setLoading(false); // Set the entire response object to state
      } else {
        setErrorMessage("Failed to fetch the content. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while fetching content."
      );
      setLoading(false);
      console.error("Error fetching content:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

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

  const handleOpenLink = () => {
    if (apiResponse?.request?.responseURL) {
      Linking.openURL(apiResponse.request.responseURL);
    }
  };

  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <PdfSvg style={styles.pdfIcon} />
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={{ flexWrap: "wrap" }} onPress={handleOpenLink}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <View style={{}}>
          <PdfSvg />
        </View>
        <View>
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              color: "#776E64",
              fontSize: 16,
              fontWeight: "700",
              width: "65%",
            }}
          >
            {item}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ResourceFilesComp;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    flexDirection: "row",
  },
  pdfIcon: {
    marginRight: 20, // Space between the icon and the loader
  },
});
