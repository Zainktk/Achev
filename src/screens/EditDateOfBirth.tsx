import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Backarrow,
  editDateOfBirth,
  editLastName,
  editName,
  editPhone,
  editPostalCode,
  enterEmail,
  userData,
} from "@utils";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { useTheme } from "react-native-paper";
import {
  Buttonn,
  EditBobField,
  EditNameField,
  EditPhoneField,
  EditPostalCodeField,
  FirstNameField,
  HelperText,
  ScreenText,
} from "@atoms";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, userToken } from "../utils/GlobalVariables";
import { useReactiveVar } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import DatePicker from "react-native-date-picker";

const EditDateOfBirth = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useReactiveVar(userData);
  const token = useReactiveVar(userToken);
  const [isloading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const route = useRoute();
  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Dob: route.params?.name.toLocaleString().split("T")[0],
    },
    resolver: yupResolver(editDateOfBirth),
  });

  const firstNameValue = watch("Dob");

  const formatDateToLocal = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const onPress = async (data: { Dob: string }) => {
    const localDateString = formatDateToLocal(data.Dob);

    const payload: Partial<User> = {
      ...userData(),
      dateOfBirth: data?.Dob ? localDateString : userData()?.dateOfBirth,
    };

    console.log("payload--->", payload);

    userData({
      ...userData(),
      ...payload,
    });
    try {
      setIsLoading(true);
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
        setIsLoading(false);
        throw new Error("Failed to submit profile details");
      }

      // Navigate on successful response
      if (response.data) {
        setIsLoading(false);
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
          text: "Date Of Birth Updated Successfully",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
        profileStack.navigate("profile");
      }
    } catch (error) {
      setIsLoading(false);
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
      Snackbar.show({
        text: " sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const onPressCalender = () => {
    setOpen(!open);
    console.log("------------->>>>>>>>>>>>>>>>>");
  };
  const formatDateToLocalDatepicker = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setValue("Dob", formatDateToLocalDatepicker(selectedDate)); // Update dob field with formatted date
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
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
            Edit Date of Birth
          </Text>
        </View>
      </View>

      {/* Main Content and Button */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        {/* Date of Birth Input Section */}
        <View>
          <ScreenText
            label={"Edit Date of Birth"}
            styles={{ marginTop: 20, marginHorizontal: 10 }}
          />
          <Controller
            control={control}
            name="Dob"
            render={({ field: { value, onChange } }) => (
              <EditBobField
                value={value}
                onChangeText={onChange}
                error={errors?.Dob?.message}
                multiline={false}
                OpenCalender={onPressCalender}
              />
            )}
          />
          {errors?.Dob?.message && (
            <HelperText
              styles={{ marginTop: 3 }}
              label={errors?.Dob?.message}
            />
          )}

          {open && (
            <DatePicker
              modal
              open={open}
              date={date}
              mode="date"
              onConfirm={(selectedDate) => {
                setOpen(false);
                handleDateConfirm(selectedDate);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          )}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Buttonn
            title={"Update"}
            onPress={handleSubmit(onPress, onError)}
            disabled={!firstNameValue || isloading}
            loading={isloading}
          />
        </View>
      </View>
    </View>
  );
};

export default EditDateOfBirth;

const styles = StyleSheet.create({});
