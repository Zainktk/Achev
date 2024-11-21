import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Backarrow,
  Designated,
  ForwardArrow,
  selectedDesignatedGroupsVar,
  selectedEmploymentStatusVar,
  selectedGenderVar,
  selectedStatusInCanadaVar,
  userData,
  userToken,
} from "@utils";
import { useNavigation } from "@react-navigation/native";
import { ProfileStackType } from "src/navigation/dashboard/ProfileNavigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider, useTheme } from "react-native-paper";
import { useReactiveVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";

const MyProfile = () => {
  const profileStack =
    useNavigation<NativeStackNavigationProp<ProfileStackType>>();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const token = useReactiveVar(userToken);
  const user = useReactiveVar(userData);
  const statusCanada = useReactiveVar(selectedStatusInCanadaVar);
  const Gender = useReactiveVar(selectedGenderVar);
  const Group = useReactiveVar(selectedDesignatedGroupsVar);
  const Employ = useReactiveVar(selectedEmploymentStatusVar);
  const insets = useSafeAreaInsets();
  const [foundGender, setFoundGender] = useState(null);
  const [foundDesigatdgroup, setFoundDesigatdgroup] = useState([]);
  const [foundcanadaianStatus, setFoundcanadaianStatus] = useState(null);
  const [foundemploymentStatus, setFoundemploymentStatus] = useState(null);
  const group = useReactiveVar(Designated);

  const fetchData = async () => {
    try {
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
      const genderLabels = genderOptions.map(
        (item: { label: any }) => item.label
      );
      console.log("genderLabels", genderLabels);

      const foundGender = genderOptions.find(
        (item: { value: number | undefined }) => item.value === user?.genderID
      );
      console.log("foundItem", foundGender.label);
      setFoundGender(foundGender.label);
      const Desigatdgroup = data
        .filter((itam: { field: string }) => itam.field === "Designated Group")
        .map((itam: { name: any; id: any }) => ({
          label: itam.name,
          value: itam.id,
        }));

      const initialValues = Desigatdgroup.filter((item) =>
        user?.designatedGroupsID?.map(Number).includes(item.value)
      );

      setFoundDesigatdgroup(initialValues);
      console.log("foundDesigatdgroup", foundDesigatdgroup);

      console.log(
        "Desigatdgroup========>>======------------------------------>",
        Desigatdgroup.map((item: { value: number }) => item)
      );
      console.log("maritalStatusOptions========>>>", Desigatdgroup);

      const canadaiaStatus = data
        .filter((item: { field: string }) => item.field === "Canadian Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const foundcanadaianStatus = canadaiaStatus.find(
        (item: { value: number | undefined }) =>
          item.value === user?.statusInCanadaId
      );
      console.log("foundcanadaianStatus--->", foundcanadaianStatus.label);
      setFoundcanadaianStatus(foundcanadaianStatus.label);

      const employmentStatus = data
        .filter((item: { field: string }) => item.field === "Employment Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const foundemploymentStatus = employmentStatus.find(
        (item: { value: number | undefined }) =>
          item.value === user?.employmentStatusId
      );
      console.log("foundemploymentStatus--->", foundemploymentStatus.label);
      setFoundemploymentStatus(foundemploymentStatus.label);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
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

      console.log("Login response data:", data);
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
    const loadUserData = async () => {
      const storedUserData = await AsyncStorage.getItem("userData");
      const storedCanada = await AsyncStorage.getItem("selectedCanadaLabel");
      const storedGender = await AsyncStorage.getItem("selectedGenderLabel");
      const stroredGrouplabel = await AsyncStorage.getItem(
        "selectedGroupLabels"
      );
      const storedEmploymentStatus = await AsyncStorage.getItem(
        "selectedEmploymentLabel"
      );
      if (storedUserData) {
        userData(JSON.parse(storedUserData));
      }

      userData();
      if (storedCanada) {
        selectedStatusInCanadaVar(storedCanada);
      }
      if (storedGender) {
        selectedGenderVar(storedGender);
      }
      if (stroredGrouplabel) {
        selectedDesignatedGroupsVar(stroredGrouplabel);
      }
      if (storedEmploymentStatus) {
        selectedEmploymentStatusVar(storedEmploymentStatus);
      }
    };
    fetchData();
    // loadUserData();
  }, []);
  console.log("USer------------------->", user?.dateOfBirth);

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
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
            My Profile
          </Text>
        </View>
      </View>
      <ScrollView
        style={{
          marginLeft: 30,
          marginTop: 30,
          flex: 2,
        }}
      >
        <View style={{ gap: 20 }}>
          <View>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                color: "#000000",
                fontWeight: "500",
                fontSize: 14,
              }}
            >
              Email address
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.labelLarge.fontFamily,
                color: "#000000",
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              {user?.email}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                To update your email address, please{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://achev.ca/contact-us/#wpcf7-f6-p25-o1"
                  );
                }}
              >
                <Text
                  style={{
                    color: "rgba(119, 110, 100, 1)",
                    textDecorationLine: "underline",
                    fontWeight: "600",
                  }}
                >
                  contact us
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() =>
              profileStack.navigate("editName", {
                name: user?.firstName,
              })
            }
          >
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "500",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                First Name
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {user?.firstName}
              </Text>
            </View>
            <View style={{ marginRight: 20 }}>
              <ForwardArrow />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() =>
              profileStack.navigate("editlastName", {
                name: user?.lastName,
              })
            }
          >
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "500",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                Last Name
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {user?.lastName}
              </Text>
            </View>
            <View style={{ marginRight: 20 }}>
              <ForwardArrow />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() =>
              profileStack.navigate("phoneEdit", {
                name: user?.homePhone,
              })
            }
          >
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "500",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                Phone Number
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {user?.homePhone}
              </Text>
            </View>
            <View style={{ marginRight: 20 }}>
              <ForwardArrow />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() =>
              profileStack.navigate("DateOfBirthEdit", {
                name: user?.dateOfBirth,
              })
            }
          >
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "500",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                date of birth
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {user?.dateOfBirth.toLocaleString().split("T")[0]}
              </Text>
            </View>
            <View style={{ marginRight: 20 }}>
              <ForwardArrow />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() =>
              profileStack.navigate("postalCodeEdit", {
                name: user?.zip,
              })
            }
          >
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "500",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                Postal Code
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#000000",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {user?.zip}
              </Text>
            </View>
            <View style={{ marginRight: 20 }}>
              <ForwardArrow />
            </View>
          </TouchableOpacity>
          <Divider
            style={{
              backgroundColor: "#776E64",
              borderWidth: 0.4,
              marginTop: 10,

              marginRight: 20,
            }}
          />
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() =>
                profileStack.navigate("StatusInCanada", {
                  name: statusCanada ? statusCanada : foundcanadaianStatus,
                })
              }
            >
              <View>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    color: "#000000",
                    fontWeight: "500",
                    fontSize: 14,
                    textTransform: "uppercase",
                  }}
                >
                  STATUS IN CANADA
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    color: "#000000",
                    fontWeight: "600",
                    fontSize: 18,
                  }}
                >
                  {statusCanada ? statusCanada : foundcanadaianStatus}
                </Text>
              </View>
              <View style={{ marginRight: 20 }}>
                <ForwardArrow />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() =>
                profileStack.navigate("EditGender", {
                  name: Gender ? Gender : foundGender,
                })
              }
            >
              <View>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    color: "#000000",
                    fontWeight: "500",
                    fontSize: 14,
                    textTransform: "uppercase",
                  }}
                >
                  With what gender do you identify?
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    color: "#000000",
                    fontWeight: "600",
                    fontSize: 18,
                  }}
                >
                  {Gender ? Gender : foundGender}
                </Text>
              </View>
              <View style={{ marginRight: 20 }}>
                <ForwardArrow />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() =>
                profileStack.navigate("EditGroup", {
                  name: Group
                    ? Group
                    : foundDesigatdgroup.map((item) => item?.label),
                })
              }
            >
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    color: "#000000",
                    fontWeight: "500",
                    fontSize: 14,
                    width: 300,
                    textTransform: "uppercase",
                  }}
                >
                  Do you identify with any of the following designated groups?
                </Text>

                {Group ? (
                  <Text
                    style={{
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: 18,
                    }}
                  >
                    {Group}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: 18,
                    }}
                  >
                    {foundDesigatdgroup?.length > 0 ? (
                      foundDesigatdgroup.map(
                        (group: { label: string }, index: number) => (
                          <Text key={index} style={{ fontWeight: "600" }}>
                            {group.label}
                            {index < foundDesigatdgroup.length - 1 && ", "}
                          </Text>
                        )
                      )
                    ) : (
                      <Text style={{ color: "grey" }}>
                        No designated groups available
                      </Text>
                    )}
                  </Text>
                )}
              </View>
              <View style={{ marginRight: 20 }}>
                <ForwardArrow />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
              onPress={() =>
                profileStack.navigate("editEmployment", {
                  name: Employ ? Employ : foundemploymentStatus,
                })
              }
            >
              <View>
                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    color: "#000000",
                    fontWeight: "500",
                    fontSize: 14,
                    textTransform: "uppercase",
                  }}
                >
                  What is your employment Status?
                </Text>

                <Text
                  style={{
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    color: "#000000",
                    fontWeight: "600",
                    fontSize: 18,
                  }}
                >
                  {Employ ? Employ : foundemploymentStatus}
                </Text>
              </View>
              <View style={{ marginRight: 20 }}>
                <ForwardArrow />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({});
