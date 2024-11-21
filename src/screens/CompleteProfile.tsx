import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buttonn, HelperText } from "@atoms";
import {
  Backarrow,
  ComppleteProfile,
  Designated,
  Employment,
  GenderValue,
  selectedDesignatedGroupsVar,
  selectedEmploymentStatusVar,
  selectedGenderVar,
  selectedStatusInCanadaVar,
  statusCanada,
  userToken,
} from "@utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import Snackbar from "react-native-snackbar";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { globalSuccessMessageVariable } from "@utils";

type Props = NativeStackScreenProps<AuthRoutes, "login">;

const CompleteProfile = ({ navigation, route }: Props) => {
  const [openCanada, setOpenCanada] = useState(false);
  const [openEmployment, setOpenEmployment] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);

  const [valueCanada, setValueCanada] = useState<number | null>(null);
  const [valueEmployment, setValueEmployment] = useState<number | null>(null);
  const [valueGender, setValueGender] = useState<number | null>(null);
  const [valueGroup, setValueGroup] = useState<number[] | null>(null);

  const [itemsCanada, setItemsCanada] = useState([]);
  const [itemsEmployment, setItemsEmployment] = useState([]);
  const [itemsGender, setItemsGender] = useState();
  const [itemsGroup, setItemsGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [name, setName] = useState("");
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      StatusCanada: "",
      EmploymentStatus: "",
      Gender: "",
      DesignatedGroup: "",
    },
    resolver: yupResolver(ComppleteProfile),
  });

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

      const genderOptions = data
        .filter((item: { field: string }) => item.field === "Gender")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const Desigatdgroup = data
        .filter((itam: { field: string }) => itam.field === "Designated Group")
        .map((itam: { name: any; id: any }) => ({
          label: itam.name,
          value: itam.id,
        }));

      console.log("genderOptions========>>======---------->", genderOptions);
      console.log("maritalStatusOptions========>>>", Desigatdgroup);

      const canadaiaStatus = data
        .filter((item: { field: string }) => item.field === "Canadian Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const employmentStatus = data
        .filter((item: { field: string }) => item.field === "Employment Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));

      setItemsCanada(canadaiaStatus);
      setItemsEmployment(employmentStatus);

      setItemsGender(genderOptions);

      setItemsGroup(Desigatdgroup);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching dropdown data:", error);
    }
  };

  const getSelectedLabels = async () => {
    const getLabelByValue = (items: any[], value: number | null) => {
      return items.find((item) => item.value === value)?.label || "";
    };
    const selectedCanadaLabel = getLabelByValue(itemsCanada, valueCanada);
    const selectedEmploymentLabel = getLabelByValue(
      itemsEmployment,
      valueEmployment
    );
    const selectedGenderLabel = getLabelByValue(itemsGender, valueGender);
    const selectedGroupLabels = getLabelByValue(itemsGroup, valueGroup);
    console.log("selectedEmploymentLabel:---->", selectedEmploymentLabel);

    try {
      await AsyncStorage.setItem("selectedCanadaLabel", selectedCanadaLabel);
      await AsyncStorage.setItem(
        "selectedEmploymentLabel",
        selectedEmploymentLabel
      );
      await AsyncStorage.setItem("selectedGenderLabel", selectedGenderLabel);
      await AsyncStorage.setItem("selectedGroupLabels", selectedGroupLabels);

      selectedStatusInCanadaVar(selectedCanadaLabel);
      selectedEmploymentStatusVar(selectedEmploymentLabel);
      selectedGenderVar(selectedGenderLabel);
      selectedDesignatedGroupsVar(selectedGroupLabels);

      console.log("Labels saved to AsyncStorage and state updated.");
    } catch (error) {
      console.log("Error saving labels to AsyncStorage:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const candaid = itemsCanada;

  const canadaIds = candaid.map((item) => item);
  console.log(
    "-------->>>>>",
    canadaIds.map((itam) => itam)
  );

  const onPress = async () => {
    const payload = {
      StatusInCanadaId: valueCanada,
      EmploymentStatusId: valueEmployment,
      GenderID: valueGender,
      DesignatedGroupsID: valueGroup
        ? Array.isArray(valueGroup)
          ? valueGroup
          : [valueGroup]
        : [],
    };
    console.log("payload======>>>>>>>>>>>>>>>>>", payload);
    setIsLoading(true);
    getSelectedLabels();
    try {
      const token = await getToken();
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/user/demographic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      console.log("response--->>>>", response.json);
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to submit demographic details");
      }

      // Navigate on successful response
      if (response) {
        setIsLoading(false);
        globalSuccessMessageVariable({
          message: "Activation successful",
        });
        await AsyncStorage.setItem("status", `${valueCanada}`);
        await AsyncStorage.setItem("designated", `${valueGroup}`);
        await AsyncStorage.setItem("Employment", `${valueEmployment}`);
        await AsyncStorage.setItem("Gender", `${valueGender}`);
        statusCanada(valueCanada);
        Designated(valueGroup);
        Employment(valueEmployment);
        GenderValue(valueGender);

        navigation.navigate("login");
      }
    } catch (error) {
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          {/* Header */}
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
                shadowOffset: { width: 0, height: 1 },
              }}
              onPress={() => navigation.goBack()}
            >
              <Backarrow />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "800",
                fontSize: 26,
                paddingHorizontal: 30,
                width: "80%",
              }}
            >
              Let us know more about you
            </Text>
          </View>

          <Text
            style={{
              marginHorizontal: 25,
              marginTop: 30,
              fontWeight: "600",
              fontSize: 16,
              fontFamily: theme.fonts.labelLarge.fontFamily,
            }}
          >
            We need to know a bit more about you in order to understand what
            programs and services you might be eligible for.
          </Text>
        </View>

        <View
          style={{ paddingLeft: 25, paddingRight: 20, paddingTop: 20, gap: 20 }}
        >
          {/* Canada Status Dropdown */}
          <View style={{ zIndex: openCanada ? 3000 : 1 }}>
            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500" }}>
              What is your status in Canada?
            </Text>
            <DropDownPicker
              open={openCanada}
              value={valueCanada}
              items={itemsCanada}
              setOpen={setOpenCanada}
              setValue={setValueCanada}
              setItems={setItemsCanada}
              placeholder="Choose a status"
              zIndex={3000} // Highest zIndex for this dropdown
              style={{
                borderColor: theme.colors.primary,
                borderRadius: 1,
                borderWidth: 2,
              }}
            />
            {!valueCanada && (
              <Text
                style={{
                  color: theme.colors?.error,
                  fontSize: theme?.fonts?.labelSmall.fontSize,
                  textTransform: "capitalize",
                }}
              >
                This field is mandatory
              </Text>
            )}
          </View>

          {/* Employment Status Dropdown */}
          <View style={{ zIndex: openEmployment ? 2000 : 1 }}>
            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500" }}>
              What is your employment status?
            </Text>
            <DropDownPicker
              open={openEmployment}
              value={valueEmployment}
              items={itemsEmployment}
              setOpen={setOpenEmployment}
              setValue={setValueEmployment}
              setItems={setItemsEmployment}
              placeholder="Choose employment status"
              zIndex={2000} // Lower zIndex for this dropdown
              style={{
                borderColor: theme.colors.primary,
                borderRadius: 1,
                borderWidth: 2,
              }}
            />
            {!valueEmployment && (
              <Text
                style={{
                  color: theme.colors?.error,
                  fontSize: theme?.fonts?.labelSmall.fontSize,
                  textTransform: "capitalize",
                }}
              >
                This field is mandatory
              </Text>
            )}
          </View>

          {/* Gender Dropdown */}
          <View style={{ zIndex: openGender ? 1000 : 1 }}>
            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500" }}>
              With what gender do you identify?
            </Text>
            <DropDownPicker
              open={openGender}
              value={valueGender}
              items={itemsGender}
              setOpen={setOpenGender}
              setValue={setValueGender}
              setItems={setItemsGender}
              placeholder="Choose gender"
              zIndex={1000} // Lower zIndex for this dropdown
              style={{
                borderColor: theme.colors.primary,
                borderRadius: 1,
                borderWidth: 2,
              }}
            />
            {!valueGender && (
              <Text
                style={{
                  color: theme.colors?.error,
                  fontSize: theme?.fonts?.labelSmall.fontSize,
                  textTransform: "capitalize",
                }}
              >
                This field is mandatory
              </Text>
            )}
          </View>

          {/* Group Dropdown */}
          <View style={{ zIndex: openGroup ? 500 : 1 }}>
            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500" }}>
              Do you identify with any of the following designated groups?
            </Text>
            <DropDownPicker
              open={openGroup}
              value={valueGroup}
              items={itemsGroup}
              setOpen={setOpenGroup}
              setValue={setValueGroup}
              dropDownDirection={"TOP"}
              setItems={setItemsGroup}
              multiple={true}
              placeholder="Choose a group"
              zIndex={500}
              style={{
                borderColor: theme.colors.primary,
                borderRadius: 1,
                borderWidth: 2,
              }}
            />
            {!valueGroup && (
              <Text
                style={{
                  color: theme.colors?.error,
                  fontSize: theme?.fonts?.labelSmall.fontSize,
                  textTransform: "capitalize",
                }}
              >
                This field is mandatory
              </Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View>
          {valueCanada && valueEmployment && valueGender && valueGroup ? (
            <Buttonn
              title="Submit"
              ButtonStyle={{
                borderRadius: 10,
                marginTop: 30,
                marginHorizontal: 20,
              }}
              onPress={onPress}
              loading={isloading}
            />
          ) : (
            <Buttonn
              title="Submit"
              ButtonStyle={{
                borderRadius: 10,
                marginTop: 30,
                marginHorizontal: 20,
              }}
              onPress={onPress}
              loading={isloading}
              disabled
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompleteProfile;
