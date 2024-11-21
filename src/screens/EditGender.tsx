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
import { GenderValue, User, userData } from "../utils/GlobalVariables";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object().shape({
  Gender: yup.string().required("This field is mandatory"),
});

const EditGender = () => {
  const [itemsGender, setItemsGender] = useState([]);
  const [valueGender, setValueGender] = useState<number>();
  const [openGender, setOpenGender] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Buttonloading, setButtonLoading] = useState(false);
  const theme = useTheme();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      Gender: "",
    },
  });
  const firstNameValue = watch("Gender");

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

      const genderOptions = data
        .filter((item: { field: string }) => item.field === "Gender")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      console.log("genderOptions===>>", genderOptions);

      setItemsGender(genderOptions);

      const initialValue = genderOptions.find(
        (item: { label: any }) => item.label === route?.params?.name
      );
      if (initialValue) {
        setValueGender(initialValue.value);
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
    const selectedGenderLabel = getLabelByValue(itemsGender, valueGender);

    try {
      await AsyncStorage.setItem("selectedGenderLabel", selectedGenderLabel);

      selectedGenderVar(selectedGenderLabel);

      console.log("Labels saved to AsyncStorage and state updated.");
    } catch (error) {
      console.log("Error saving labels to AsyncStorage:", error);
    }
  };

  const onPress = async () => {
    const payload: Partial<User> = {
      ...userData(),
      genderID: valueGender,
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

        await AsyncStorage.setItem("Gender", `${valueGender}`);
        GenderValue(valueGender);

        Snackbar.show({
          text: "Gender Updated Successfully",
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

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }
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
            Edit Gender
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
        {/* Gender Selection */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500" }}>
            With what gender do you identify?
          </Text>

          <Controller
            control={control}
            name="Gender"
            render={({ field: { onChange, onBlur, value } }) => (
              <DropDownPicker
                open={openGender}
                value={valueGender}
                items={itemsGender}
                dropDownDirection={"BOTTOM"}
                setOpen={setOpenGender}
                setValue={(value) => {
                  onChange(value); // Pass the selected value to the form state
                  setValueGender(value); // Also update your local state
                }}
                setItems={setItemsGender}
                placeholder={"Choose gender"}
                style={{
                  borderColor: theme.colors.primary,
                  borderRadius: 1,
                  borderWidth: 2,
                }}
              />
            )}
          />

          {errors.Gender && (
            <Text style={{ color: theme.colors.error }}>
              {errors?.Gender?.message}
            </Text>
          )}
        </View>

        {/* Button Positioned at the Bottom */}
        <View style={{ marginBottom: 20 }}>
          <Buttonn
            title={"Update"}
            onPress={handleSubmit(onPress)}
            loading={Buttonloading}
            disabled={!valueGender || Buttonloading}
          />
        </View>
      </View>
    </View>
  );
};

export default EditGender;

const styles = StyleSheet.create({});
