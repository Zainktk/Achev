import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ResourceFilesComp from "../../components/ResourceFilesComp";
import ResourcesComp from "../../components/ResourcesComp";
import { Backarrow } from "@utils";
import { useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ResourceStackType } from "src/navigation/dashboard/ResourcesNavigation";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";

const ResourcesFiles = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const theme = useTheme();
  const [response, setResponse] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://oneclientapi.achev.ca/api/Resources/SharedDocumentsFolderFiles/${route.params?.item}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("res----->>>", response?.data);
      setResponse(response?.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching services:",
        error.response?.data || error.message
      );
      setLoading(false);
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

  const ResourceStack =
    useNavigation<NativeStackNavigationProp<ResourceStackType>>();

  console.log("==========>>>>>>>>", route.params?.item);

  const onPress = (item: string) => {
    ResourceStack.navigate("New", {
      filename: item,
      item: route.params?.item,
    });
  };
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

  const { width } = Dimensions.get("window");

  const responsiveFontSize = width * 0.07;
  console.log("item---->>>", route?.params?.item);
  return (
    <View style={{ paddingTop: insets.top + 10, flex: 1 }}>
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
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
        <View style={{ marginHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 22,
              fontWeight: "800",
            }}
          >
            {route?.params?.item}
          </Text>
        </View>
      </View>
      <View style={{ flex: 2, paddingTop: 20 }}>
        <FlatList
          data={response}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ResourceFilesComp
              item={item}
              onpress={onPress}
              folder={route?.params?.item}
            />
          )}
          contentContainerStyle={{ gap: 20, marginLeft: 20 }}
        />
      </View>
    </View>
  );
};

export default ResourcesFiles;

const styles = StyleSheet.create({});
