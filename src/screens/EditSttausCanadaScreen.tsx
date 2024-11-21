import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { useTheme } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  selectedStatusInCanadaVar,
  selectedEmploymentStatusVar,
  selectedGenderVar,
  selectedDesignatedGroupsVar,
  statusCanada,
  Backarrow,
} from "@utils";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { Buttonn } from "@atoms";
import { User, userData } from "../utils/GlobalVariables";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object().shape({
  statusInCanadaId: yup.string().required("This field is mandatory"),
});

const EditSttausCanadaScreen = () => {
  const route = useRoute();
  const [itemsCanada, setItemsCanada] = useState([]);
  const [valueCanada, setValueCanada] = useState<number>();
  const [openCanada, setOpenCanada] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Buttonloading, setButtonLoading] = useState(false);
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      statusInCanadaId: "",
    },
  });

  const firstNameValue = watch("statusInCanadaId");

  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const fetchData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/Master/achev_meta_data",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dropdown data");
      }

      const data = await response.json();
      console.log("data-->", data);

      const canadaiaStatus = data
        .filter((item: { field: string }) => item.field === "Canadian Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      console.log("canadaiaStatus===>>", canadaiaStatus);

      setItemsCanada(canadaiaStatus);
      const initialValue = canadaiaStatus.find(
        (item: { label: any }) => item.label === route?.params?.name
      );
      if (initialValue) {
        setValueCanada(initialValue.value);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const getSelectedLabels = async () => {
    const getLabelByValue = (items: any[], value: number | null) => {
      return items.find((item) => item.value === value)?.label || "";
    };
    const selectedCanadaLabel = getLabelByValue(itemsCanada, valueCanada);

    try {
      await AsyncStorage.setItem("selectedCanadaLabel", selectedCanadaLabel);

      selectedStatusInCanadaVar(selectedCanadaLabel);

      console.log("Labels saved to AsyncStorage and state updated.");
    } catch (error) {
      console.log("Error saving labels to AsyncStorage:", error);
    }
  };

  const onPress = async () => {
    const payload: Partial<User> = {
      ...userData(),
      statusInCanadaId: valueCanada,
    };

    console.log("name--->", payload);

    try {
      setButtonLoading(true);
      getSelectedLabels();
      const token = await getToken();

      const response = await axios.put(
        "https://oneclientapi.achev.ca/api/user/updateprofile",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response.data====>>>", response.data);

      if (response.status !== 200) {
        setButtonLoading(false);
        throw new Error("Failed to submit profile details");
      }

      // Navigate on successful response
      if (response.data) {
        setButtonLoading(false);
        await AsyncStorage.setItem("status", `${valueCanada}`);
        statusCanada(valueCanada);
        userData({
          ...userData(),
          ...payload,
        });

        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            ...userData(),
            ...payload,
          })
        );
        Snackbar.show({
          text: "Status in Canada Updated Successfully",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
        profileStack.navigate("profile");
      }
    } catch (error) {
      setButtonLoading(false);
      console.error("Error submitting profile:", error);
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
      setLoading(false);
      Snackbar.show({
        text: " sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
      console.error("Error logging in:", error);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log("routeee===>", route?.params?.name);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  console.log("valueCanada================>>>", valueCanada);
  return (
    <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            shadowColor: "rgba(0, 0, 0, 0.25)",
            borderRadius: 50,
            height: 30,
            width: 30,
            shadowOpacity: 1,
            shadowRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 12,
            shadowOffset: {
              width: 0,
              height: 1,
            },
          }}
          onPress={() => profileStack.goBack()}
        >
          <Backarrow />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 22,
              fontWeight: "800",
            }}
          >
            Edit Status In Canada
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        {/* Top Content */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500" }}>
            What is your status in Canada?
          </Text>
          <Controller
            control={control}
            name="statusInCanadaId"
            render={({ field: { onChange, onBlur, value } }) => (
              <DropDownPicker
                open={openCanada}
                value={valueCanada}
                items={itemsCanada}
                dropDownDirection={"BOTTOM"}
                setOpen={setOpenCanada}
                setValue={(value) => {
                  setValueCanada(value);
                  onChange(value);
                }}
                setItems={setItemsCanada}
                placeholder={"Choose a status"}
                style={{
                  borderColor: theme.colors.primary,
                  borderRadius: 1,
                  borderWidth: 2,
                }}
                onBlur={onBlur} // Mark field as touched on blur
              />
            )}
          />

          {errors.statusInCanadaId && (
            <Text style={{ color: theme.colors.error }}>
              {errors?.statusInCanadaId?.message}
            </Text>
          )}
        </View>

        {/* Button Positioned at the Bottom */}
        <View style={{ marginBottom: 20 }}>
          <Buttonn
            title={"Update"}
            onPress={handleSubmit(onPress)}
            loading={Buttonloading}
            disabled={!firstNameValue || Buttonloading}
          />
        </View>
      </View>
    </View>
  );
};

export default EditSttausCanadaScreen;

const styles = StyleSheet.create({});
