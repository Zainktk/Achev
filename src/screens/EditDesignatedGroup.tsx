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
import { NativeStackNavigationProp } from "react-navigation/native-stack";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { Buttonn } from "@atoms";
import { Designated, User, userData } from "../utils/GlobalVariables";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useReactiveVar } from "@apollo/client";

const validationSchema = yup.object().shape({
  designated: yup.array().min(1, "This field is mandatory"),
});

const EditDesignatedGroup = () => {
  const [itemsGroup, setItemsGroup] = useState([]);
  const [valueGroup, setValueGroup] = useState<number[]>([]);
  const [openGroup, setOpenGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Buttonloading, setButtonLoading] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const groupsvalues = useReactiveVar(Designated);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      designated: [],
    },
  });

  const designatedValues = watch("designated");
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

      const Desigatdgroup = data
        .filter((item: { field: string }) => item.field === "Designated Group")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));

      setItemsGroup(Desigatdgroup);

      const initialValues = Desigatdgroup.filter((item: { label: any }) =>
        route?.params?.name.includes(item.label)
      ).map((item: { value: any }) => item.value);

      if (initialValues.length) {
        setValueGroup(initialValues);
      } else {
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const getSelectedLabels = async () => {
    const selectedGroupLabels = valueGroup
      .map(
        (groupId) => itemsGroup.find((item) => item.value === groupId)?.label
      )
      .filter(Boolean)
      .join(", ");

    try {
      await AsyncStorage.setItem("selectedGroupLabels", selectedGroupLabels);
      selectedDesignatedGroupsVar(selectedGroupLabels);
      console.log("Labels saved to AsyncStorage and state updated.");
    } catch (error) {
      console.log("Error saving labels to AsyncStorage:", error);
    }
  };

  const onPress = async () => {
    const payload: Partial<User> = {
      ...userData(),
      designatedGroupsID: valueGroup ? valueGroup : [],
    };

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

      if (response.status !== 200) {
        setButtonLoading(false);
        throw new Error("Failed to submit profile details");
      }

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

        await AsyncStorage.setItem("designated", `${valueGroup}`);
        Designated(valueGroup);

        Snackbar.show({
          text: "Designated Group Updated Successfully",
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
        text: "Sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
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
            marginHorizontal: 12,
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
            Edit Designated Groups
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500" }}>
            Do you identify with any of the following designated groups?
          </Text>
          <Controller
            control={control}
            name="designated"
            render={({ field: { onChange, onBlur, value } }) => (
              <DropDownPicker
                open={openGroup}
                multiple={true}
                value={valueGroup}
                items={itemsGroup}
                setOpen={setOpenGroup}
                setValue={setValueGroup}
                setItems={setItemsGroup}
                placeholder="Select designated groups"
                onBlur={onBlur}
                onChangeValue={(val) => {
                  setValueGroup(val);
                  onChange(val);
                }}
              />
            )}
          />
          {errors.designated && (
            <Text style={{ color: "red" }}>{errors.designated.message}</Text>
          )}
        </View>
        <View style={{ marginBottom: 20 }}>
          <Buttonn
            title={"Update"}
            onPress={handleSubmit(onPress)}
            loading={Buttonloading}
          />
        </View>
      </View>
    </View>
  );
};

export default EditDesignatedGroup;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
