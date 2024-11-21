import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgramsHeader from "../../components/ProgramsHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgramScreenFlowType } from "src/navigation/dashboard/ProgramNavigator";
import { useTheme } from "react-native-paper";
import {
  ArrivalField,
  BenchmarkField,
  BenchmarkReading,
  BenchmarkSpeaking,
  BenchmarkWriting,
  Buttonn,
  DateOfbirthField,
  HelperText,
  ITExperianceField,
  ScreenText,
  WorkPermitField,
} from "@atoms";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckBoxFill, generateSchema, userData } from "@utils";
import DropDownPicker from "react-native-dropdown-picker";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useReactiveVar } from "@apollo/client";
import {
  Designated,
  Employment,
  GenderValue,
  User,
  selectedDesignatedGroupsVar,
  selectedEmploymentStatusVar,
  selectedGenderVar,
  selectedStatusInCanadaVar,
  statusCanada,
  userToken,
} from "../../utils/GlobalVariables";
import DatePicker from "react-native-date-picker";

type DropDownItem = {
  label: string;
  value: number;
};

const EligibilityForm = () => {
  const [openGender, setOpenGender] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [itemsEducation, setItemsEducation] = useState([]);
  const [valueEducation, setValueEducation] = useState<number | null>(null);
  const [openPreferredlang, setOpenPreferredlang] = useState(false);
  const [itemsPreferredlang, setItemsPreferredlang] = useState([]);
  const [valuePreferredlang, setValuePreferredlang] = useState<number | null>(
    null
  );
  const [openOutsideCanada, setopenOutsideCanada] = useState(false);
  const [itemsOutsideCanada, setitemsOutsideCanada] = useState<DropDownItem[]>(
    []
  );
  const [valueOutsideCanada, setValueOutsideCanada] = useState<number | null>(
    null
  );
  const [openEnglish, setOpenEnglish] = useState(false);
  const [itemsEnglish, setItemsEnglish] = useState([]);
  const [valueEnglish, setValueEnglish] = useState<number | null>(null);
  const [valueGender, setValueGender] = useState<number | null>(null);
  const [itemsGender, setItemsGender] = useState([]);
  const [itemsCanada, setItemsCanada] = useState([]);
  const [openCanada, setOpenCanada] = useState(false);
  const [valueCanada, setValueCanada] = useState<number | null>(null);
  const [openGroup, setOpenGroup] = useState(false);
  const [valueGroup, setValueGroup] = useState<number[] | null | undefined>([]);
  const [itemsGroup, setItemsGroup] = useState([]);
  const [itemsIncome, setItemsIncome] = useState([]);
  const [valueIncome, setValueIncome] = useState<number | undefined>(undefined);
  const [openEmployment, setOpenEmployment] = useState(false);
  const [valueEmployment, setValueEmployment] = useState<
    number | undefined | null
  >(null);
  const [itemsEmployment, setItemsEmployment] = useState([]);

  const [openEducationstatus, setOpenEducationstatus] = useState(false);
  const [itemsEducationstatus, setItemsEducationStatus] = useState([]);
  const [valueEducationstatus, setValueEducationstatus] = useState<
    number | null
  >(null);

  const [valueStat, setValueStat] = useState<number | null>(null);
  const [openState, setOpenStat] = useState(false);
  const [itemsState, setItemsStat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isloading, setIsLoading] = useState(true);
  const [responsedata, setResponseData] = useState({});
  const [response, setResponse] = useState({});
  const user = useReactiveVar(userData);
  const token = useReactiveVar(userToken);
  const [date, setDate] = useState(new Date());
  const [Arrivaldate, setArrivalDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openArrival, setOpenArrival] = useState(false);
  const CanadaStatus = useReactiveVar(statusCanada);
  const Designat = useReactiveVar(Designated);
  const EmploymentstatusGlobal = useReactiveVar(Employment);
  const GenderValueGlobal = useReactiveVar(GenderValue);
  const [showNote, setShowNote] = useState<boolean>(true);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [openWorkPermit, setOpenWorkPermit] = useState(false);
  const [unfilled, setUnfilled] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const route = useRoute();

  const secondbox = unfilled ? styles.checkboxticked : styles.checkboxuntick;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      Dob: user?.dateOfBirth.toLocaleString().split("T")[0] || "",
      arrivalDate: "",
      benchmark_speaking: "",
      benchmark_writing: "",
      benchmark_reading: "",
      benchmark_listening: "",
      statusInCanada: "",
      gender: "",
      someFinanceITExperienceOrTraining: "",
      hasWorkPermit: "",
      employmentStatus: "",
      DesignatedGroup: "",
      sourceOfIncomeId: "",
      stateId: "",
      educationOutsideOfCanadaId: "",
      educationStatus: "",
      preferredLang: "",
      UnderstandEnglish: "",
      highestEducation: "",
    },
    resolver: yupResolver(generateSchema(responsedata)),
  });
  const formValues = watch();
  console.log("formValues--", formValues);

  const ProgramStack =
    useNavigation<NativeStackNavigationProp<ProgramScreenFlowType>>();

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

      console.log(
        "Response Data:============---------=========>>>>>>",
        response?.data
      );
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

      const canadaiaStatus = data
        .filter((item: { field: string }) => item.field === "Canadian Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));

      const incomeOptions = data
        .filter((item: { field: string }) => item.field === "Income Source")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const EducationOptions = data
        .filter((item: { field: string }) => item.field === "Education Level")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const EnglishOptions = data
        .filter((item: { field: string }) => item.field === "Language Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const preferredLang = data
        .filter(
          (item: { field: string }) => item.field === "Preferred Language"
        )
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const educationStatus = data
        .filter((item: { field: string }) => item.field === "Education Status")
        .map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      const educationOutsideCanada = data
        .filter((item: { field: string }) => item.field === "Education Type")
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

      const Desigatdgroup = data
        .filter((itam: { field: string }) => itam.field === "Designated Group")
        .map((itam: { name: any; id: any }) => ({
          label: itam.name,
          value: itam.id,
        }));
      setItemsGroup(Desigatdgroup);
      setItemsEmployment(employmentStatus);
      setitemsOutsideCanada(educationOutsideCanada);
      setItemsEducationStatus(educationStatus);
      setItemsPreferredlang(preferredLang);
      setItemsEnglish(EnglishOptions);
      setItemsEducation(EducationOptions);
      setItemsIncome(incomeOptions);
      setItemsCanada(canadaiaStatus);

      setItemsGender(genderOptions);

      const initialValues = Desigatdgroup.filter((item: { value: number }) =>
        Designat?.includes(item.value)
      ).map((item: { label: any }) => item.label);

      console.log("Initial Values:========>>>", initialValues);
      console.log("Updated Desigatdgroup:", Desigatdgroup);
      console.log("Updated Designat:", Designat);

      if (initialValues.length) {
        setValueGroup(user?.designatedGroupsID);
        setValue("DesignatedGroup", `${user?.designatedGroupsID}`);
      }
      const GendersavedStatus = await AsyncStorage.getItem("Gender");
      if (GenderValueGlobal) {
        setValueGender(GenderValueGlobal);
        setValue("gender", JSON.stringify(GenderValueGlobal));
      }

      const savedStatus = await AsyncStorage.getItem("status");
      console.log("savedStatus--->>", savedStatus);
      if (CanadaStatus) {
        setValueCanada(CanadaStatus);
        setValue("statusInCanada", JSON.stringify(CanadaStatus));
      }

      const savedEmployment = await AsyncStorage.getItem("Employment");
      console.log("savedStatus--->>", savedEmployment);
      if (EmploymentstatusGlobal) {
        setValueEmployment(EmploymentstatusGlobal);
        setValue("employmentStatus", JSON.stringify(EmploymentstatusGlobal));
      }

      setLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching dropdown data:", error);
    }
  };

  const formatDateToLocal = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };
  console.log("route.params?.id------>>>>", route.params?.name);
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

  const getDesignatedSelectedLabels = async () => {
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

  const getEmploymentSelectedLabels = async () => {
    const getLabelByValue = (items: any[], value: number | null) => {
      return items.find((item) => item.value === value)?.label || "";
    };
    const selectedEmploymentLabel = getLabelByValue(
      itemsEmployment,
      valueEmployment
    );

    try {
      await AsyncStorage.setItem(
        "selectedEmploymentLabel",
        selectedEmploymentLabel
      );

      selectedEmploymentStatusVar(selectedEmploymentLabel);

      console.log("Labels saved to AsyncStorage and state updated.");
    } catch (error) {
      console.log("Error saving labels to AsyncStorage:", error);
    }
  };

  const getGenderSelectedLabels = async () => {
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

  const tick = () => {
    setUnfilled(!unfilled);
  };

  const onPress = async (data: {
    Dob: Date;
    arrivalDate: string;
    benchmark_listening: string;
    benchmark_writing: string;
    benchmark_speaking: string;
    benchmark_reading: string;
    hasWorkPermit: string;
    someFinanceITExperienceOrTraining: string;
    valueIncome: string;
    employmentStatus: string;
    statusInCanada: string;
    stateId: string;
    educationOutsideOfCanadaId: string;
  }) => {
    const localDateString = formatDateToLocal(data.Dob);
    console.log("localDateString=>", localDateString);

    const localDateStringArrival = formatDateToLocal(data.arrivalDate);

    const payload: Partial<User> = {
      ...userData(),
      statusInCanadaId: valueCanada
        ? valueCanada
        : userData()?.statusInCanadaId,
      educationOutsideOfCanadaId: valueOutsideCanada
        ? valueOutsideCanada
        : userData()?.educationOutsideOfCanadaId,
      genderID: valueGender ? valueGender : userData()?.genderID,
      designatedGroupsID: valueGroup
        ? Array.isArray(valueGroup)
          ? valueGroup
          : [valueGroup]
        : userData()?.designatedGroupsID,
      stateId: valueStat ? valueStat : userData()?.stateId,
      understandsEnglishId: valueEnglish
        ? valueEnglish
        : userData()?.understandsEnglishId,
      employmentStatusId: valueEmployment
        ? valueEmployment
        : userData()?.employmentStatusId,
      educationStatusId: valueEducation
        ? valueEducation
        : userData()?.educationStatusId,
      highestEducationLevelId: userData()?.highestEducationLevelId,
      dateOfBirth: data?.Dob ? localDateString : userData()?.dateOfBirth,
      canadaArrivalDate: data.arrivalDate
        ? localDateStringArrival
        : userData()?.canadaArrivalDate,
      benchmarkListening: data.benchmark_listening
        ? data.benchmark_listening
        : userData()?.benchmarkListening,
      benchmarkWriting: data.benchmark_writing
        ? data.benchmark_writing
        : userData()?.benchmarkWriting,
      benchmarkReading: data.benchmark_reading
        ? data.benchmark_reading
        : userData()?.benchmarkReading,
      benchmarkSpeaking: data.benchmark_speaking
        ? data.benchmark_speaking
        : userData()?.benchmarkSpeaking,
      hasWorkPermit: data.hasWorkPermit
        ? data.hasWorkPermit
        : userData()?.hasWorkPermit,
      someFinanceITExperienceOrTraining: unfilled ? true : false,
      sourceOfIncomeId: userData()?.sourceOfIncomeId,
    };

    console.log("payload======----------->>>", payload?.dateOfBirth);
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

    console.log(
      "Updated userData:------------>>>>>>>>>>>>",
      userData()?.dateOfBirth
    );

    setIsLoading(true);

    try {
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

      setResponse(response.data);
      console.log("response.data--------------------====>>>", response.data);

      if (response.status !== 200) {
        setIsLoading(false);
        throw new Error("Failed to submit profile details");
      }

      // Navigate on successful response
      if (response) {
        ProgramStack.navigate("eligibilitycheck", {
          id: route.params?.id,
          name: route.params?.name,
        });
        setIsLoading(false);
        getSelectedLabels();
        getDesignatedSelectedLabels();
        getEmploymentSelectedLabels();
        getGenderSelectedLabels();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting profile:", error);
    }
  };

  const fetchState = async () => {
    try {
      const response = await fetch(
        "https://oneclientapi.achev.ca/api/Master/res_country_state",
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

      const states = data
        .filter((item: { countryID: string }) => item.countryID === "38")
        .map((item: { name: string; id: number }) => ({
          label: item.name,
          value: item.id,
        }));

      setItemsStat(states);
      setLoading(false);
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
      setIsLoading(false);
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
      console.log("token-------->>>>", token);

      if (token && expirationTime) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem(
          "tokenExpirationTime",
          expirationTime.toString()
        );
      }

      return token;
    } catch (error) {
      setIsLoading(false);
      Snackbar.show({
        text: " sorry, too many clients already",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: theme?.colors?.error,
      });
      console.error("Error logging in:", error);
      throw error;
    }
  };

  console.log("valueCanada===>>>", valueCanada);
  console.log("valueStat===>>>", valueStat);

  useEffect(() => {
    fetchData();
    fetchContent();
    fetchState();
  }, []);

  console.log("valueEmployment---==", valueEmployment);

  const formatDateToLocalDatepicker = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const formatarrivalDateToLocalDatepicker = (
    dateString: string | number | Date
  ) => {
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

  const handleArrivalDateConfirm = (selectedDate: Date) => {
    setArrivalDate(selectedDate);
    setValue("arrivalDate", formatarrivalDateToLocalDatepicker(selectedDate)); // Update dob field with formatted date
  };
  const onPressCalender = () => {
    setOpen(!open);
    console.log("------------->>>>>>>>>>>>>>>>>");
  };
  const onPressArrivalCalender = () => {
    setOpenArrival(!openArrival);
  };

  const availableFields = Object.keys(control._defaultValues);

  const onError = (errors: {}) => {
    if (scrollViewRef.current) {
      const firstError = Object.keys(errors)[0]; // Get the first error key
      // Here you can implement logic to scroll to the position of the first error field
      scrollViewRef.current.scrollTo({
        y: 0, // Or calculate the position of the specific field
        animated: true,
      });
    }
  };
  console.log("userrr--->>>>", userData()?.designatedGroupsID);
  console.log("isValid===>>>", isValid);
  return (
    <View style={{ paddingTop: insets.top + 10, flex: 1 }}>
      <View>
        <ProgramsHeader
          prop={"eligibility"}
          Screen={"eligibility"}
          onBack={() => ProgramStack.goBack()}
        />
      </View>
      <ScrollView style={{ flex: 2 }}>
        <View style={{ marginTop: 40, marginLeft: 25, gap: 20 }}>
          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 24,
              fontWeight: "400",
              color: "#000000",
            }}
          >
            Hi {user?.firstName}
          </Text>

          <Text
            style={{
              fontFamily: theme.fonts.labelLarge.fontFamily,
              fontSize: 16,
              fontWeight: "400",
              color: "#71727A",
              marginRight: 10,
              width: "90%",
            }}
          >
            We need to collect some more information from you to know if you are
            eligible to apply to register for this program.
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 60,
            gap: 20,
            marginBottom: 60,
          }}
        >
          {responsedata?.date_of_birth === true ? (
            <View>
              <ScreenText
                label={"Date of Birth"}
                styles={{ marginBottom: 10 }}
              />
              <Controller
                control={control}
                name="Dob"
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => (
                  <DateOfbirthField
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
                  onConfirm={(selectedDate: Date) => {
                    setOpen(false);
                    handleDateConfirm(selectedDate);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              )}
            </View>
          ) : null}
          <View>
            {(responsedata?.benchmark_listening ||
              responsedata?.benchmark_reading ||
              responsedata?.benchmark_speaking ||
              responsedata?.benchmark_writing) && (
              <View>
                <Text
                  style={{
                    textAlign: "left",
                    fontFamily: theme.fonts.titleMedium.fontFamily,
                    fontWeight: "500",
                    color: "black",
                    fontSize: 16,
                    marginTop: 30,
                  }}
                >
                  Canadian Language Board (CLB) Benchmark Scores:
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontFamily: theme.fonts.titleMedium.fontFamily,
                    marginTop: 8,
                    fontSize: 16,
                  }}
                >
                  To be eligible for this program, you must have completed a
                  Canadian Language Benchmark test and provide your scores.
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 20,
              }}
            >
              {responsedata?.benchmark_listening === true ? (
                <View>
                  <ScreenText
                    label={"Listening"}
                    styles={{ marginBottom: 10 }}
                  />
                  <Controller
                    control={control}
                    name="benchmark_listening"
                    render={({ field: { value, onChange } }) => (
                      <BenchmarkField
                        value={value}
                        onChangeText={onChange}
                        error={errors?.benchmark_listening?.message}
                        multiline={false}
                      />
                    )}
                  />
                  {errors?.benchmark_listening?.message && (
                    <HelperText
                      styles={{ marginTop: 3 }}
                      label={errors?.benchmark_listening?.message}
                    />
                  )}
                </View>
              ) : null}
              {responsedata?.benchmark_reading === true ? (
                <View>
                  <ScreenText label={"Reading"} styles={{ marginBottom: 10 }} />
                  <Controller
                    control={control}
                    name="benchmark_reading"
                    render={({ field: { value, onChange } }) => (
                      <BenchmarkReading
                        value={value}
                        onChangeText={onChange}
                        error={errors?.benchmark_reading?.message}
                        multiline={false}
                      />
                    )}
                  />
                  {errors?.benchmark_reading?.message && (
                    <HelperText
                      styles={{ marginTop: 3 }}
                      label={errors?.benchmark_reading?.message}
                    />
                  )}
                </View>
              ) : null}
              {responsedata?.benchmark_speaking === true ? (
                <View>
                  <ScreenText
                    label={"Speaking"}
                    styles={{ marginBottom: 10 }}
                  />
                  <Controller
                    control={control}
                    name="benchmark_speaking"
                    render={({ field: { value, onChange } }) => (
                      <BenchmarkSpeaking
                        value={value}
                        onChangeText={onChange}
                        error={errors?.benchmark_speaking?.message}
                        multiline={false}
                      />
                    )}
                  />
                  {errors?.benchmark_speaking?.message && (
                    <HelperText
                      styles={{ marginTop: 3 }}
                      label={errors?.benchmark_speaking?.message}
                    />
                  )}
                </View>
              ) : null}
              {responsedata?.benchmark_writing === true ? (
                <View>
                  <ScreenText label={"Writing"} styles={{ marginBottom: 10 }} />
                  <Controller
                    control={control}
                    name="benchmark_writing"
                    render={({ field: { value, onChange } }) => (
                      <BenchmarkWriting
                        value={value}
                        onChangeText={onChange}
                        error={errors?.benchmark_writing?.message}
                        multiline={false}
                      />
                    )}
                  />
                  {errors?.benchmark_writing?.message && (
                    <HelperText
                      styles={{ marginTop: 3 }}
                      label={errors?.benchmark_writing?.message}
                    />
                  )}
                </View>
              ) : null}
            </View>
          </View>

          {responsedata?.years_in_canada === true && (
            <View>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Arrival Date</Text> -
                Arrival date in Canada - to be eligible for this program, you
                must have immigrated to Canada from another country.
              </Text>

              <Controller
                control={control}
                name="arrivalDate"
                rules={{
                  required:
                    responsedata?.years_in_canada === true ? true : false,
                }}
                render={({ field: { value, onChange } }) => (
                  <ArrivalField
                    value={value}
                    onChangeText={onChange}
                    error={errors?.arrivalDate?.message}
                    multiline={false}
                    OpenCalender={onPressArrivalCalender}
                  />
                )}
              />
              {errors?.arrivalDate?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.arrivalDate?.message}
                />
              )}
              {openArrival && (
                <DatePicker
                  modal
                  open={openArrival}
                  date={Arrivaldate}
                  mode="date"
                  onConfirm={(selectedDate: Date) => {
                    setOpenArrival(false);
                    handleArrivalDateConfirm(selectedDate);
                  }}
                  onCancel={() => {
                    setOpenArrival(false);
                  }}
                />
              )}
            </View>
          )}

          {responsedata?.gender_id === true ? (
            <View style={{ zIndex: openGender ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Gender</Text> - What gender
                do you identify with?
              </Text>

              <Controller
                control={control}
                name="gender"
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    open={openGender}
                    value={valueGender}
                    items={itemsGender}
                    setOpen={setOpenGender}
                    setValue={(value) => {
                      setValueGender(value);
                      onChange(value);
                    }}
                    setItems={setItemsGender}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  />
                )}
              />
              {errors?.gender?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.gender?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.status_in_canada_id === true ? (
            <View style={{ zIndex: openCanada ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Status in Canada</Text> -
                What is your status in Canada?
              </Text>

              <Controller
                control={control}
                name="statusInCanada"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openCanada}
                    value={valueCanada}
                    items={itemsCanada}
                    setOpen={setOpenCanada}
                    setValue={(value) => {
                      setValueCanada(value);
                      onChange(value);
                    }}
                    setItems={setItemsCanada}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors?.statusInCanada?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.statusInCanada?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.state_id === true ? (
            <View style={{ zIndex: openState ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Province</Text> - What
                province do you live in?
              </Text>
              <Controller
                control={control}
                name="stateId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openState}
                    value={valueStat}
                    items={itemsState}
                    searchable={true}
                    searchPlaceholder="Search..."
                    setOpen={setOpenStat}
                    setValue={(value) => {
                      setValueStat(value);
                      onChange(value);
                    }}
                    setItems={setItemsStat}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                    scrollViewProps={{ nestedScrollEnabled: true }}
                    listMode="SCROLLVIEW"
                    dropDownContainerStyle={{
                      position: "relative",
                      top: 0,
                    }}
                  />
                )}
              />
              {errors?.stateId?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.stateId?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.designated_groups_ids === true ? (
            <View style={{ zIndex: openGroup ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Designated Groups</Text> -
                Do you identify with any of the following designated groups?
              </Text>

              <Controller
                control={control}
                name="DesignatedGroup"
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    open={openGroup}
                    value={valueGroup}
                    items={itemsGroup}
                    setOpen={setOpenGroup}
                    setValue={(val) => {
                      onChange(val);
                      setValueGroup(val);
                    }}
                    multiple={true}
                    setItems={setItemsGroup}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  />
                )}
              />
              {errors?.DesignatedGroup?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.DesignatedGroup?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.source_of_income_id === true ? (
            <View style={{ zIndex: openIncome ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Income Source</Text> - What
                are your income source(s)?
              </Text>

              <Controller
                control={control}
                name="sourceOfIncomeId"
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    open={openIncome}
                    value={valueIncome}
                    items={itemsIncome}
                    setOpen={setOpenIncome}
                    setValue={(value) => {
                      setValueIncome(value);
                      onChange(value);
                    }}
                    setItems={setItemsIncome}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  />
                )}
              />
              {errors?.sourceOfIncomeId?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.sourceOfIncomeId?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.highest_education_level_id === true ? (
            <View style={{ zIndex: openEducation ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Highest Education Level
                </Text>{" "}
                - What is your highest level of education completed?
              </Text>

              <Controller
                control={control}
                name="highestEducation"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openEducation}
                    value={valueEducation}
                    items={itemsEducation}
                    setOpen={setOpenEducation}
                    setValue={(value) => {
                      setValueEducation(value);
                      onChange(value);
                    }}
                    setItems={setItemsEducation}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  />
                )}
              />
              {errors?.highestEducation?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.highestEducation?.message}
                />
              )}
            </View>
          ) : null}

          {responsedata?.education_status_id === true ? (
            <View style={{ zIndex: openEducationstatus ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Education Status</Text> -
                What is your education status?
              </Text>

              <Controller
                control={control}
                name="educationStatus"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openEducationstatus}
                    value={valueEducationstatus}
                    items={itemsEducationstatus}
                    dropDownDirection={"TOP"}
                    setOpen={setOpenEducationstatus}
                    setValue={(value) => {
                      setValueEducationstatus(value);
                      onChange(value);
                    }}
                    setItems={setItemsEducationStatus}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  />
                )}
              />
              {errors?.educationStatus?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.educationStatus?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.education_outside_of_canada_id === true ? (
            <View style={{ zIndex: openOutsideCanada ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Education Outside of Canada
                </Text>{" "}
                - What education did you complete outside of Canada (if any)?
              </Text>

              <Controller
                control={control}
                name="educationOutsideOfCanadaId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openOutsideCanada}
                    value={valueOutsideCanada}
                    items={itemsOutsideCanada}
                    setOpen={setopenOutsideCanada}
                    setValue={(value) => {
                      setValueOutsideCanada(value);
                      onChange(value);
                    }}
                    setItems={setitemsOutsideCanada}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  />
                )}
              />
              {errors?.educationOutside?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.educationOutside?.message}
                />
              )}
            </View>
          ) : null}

          {responsedata?.employment_status_id === true ? (
            <View style={{ zIndex: openEmployment ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Employment Status</Text> -
                What is your status in Canada?
              </Text>

              <Controller
                control={control}
                name="employmentStatus"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openEmployment}
                    value={valueEmployment}
                    items={itemsEmployment}
                    setOpen={setOpenEmployment}
                    setValue={(value) => {
                      setValueEmployment(value);
                      onChange(value);
                    }}
                    setItems={setItemsEmployment}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  />
                )}
              />
              {errors?.employmentStatus?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.employmentStatus?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.understands_english_id === true ? (
            <View style={{ zIndex: openEnglish ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Understand English</Text> -
                Do you understand English?
              </Text>

              <Controller
                control={control}
                name="UnderstandEnglish"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openEnglish}
                    value={valueEnglish}
                    items={itemsEnglish}
                    setOpen={setOpenEnglish}
                    placeholder={""}
                    setValue={(value) => {
                      setValueEnglish(value);
                      onChange(value);
                    }}
                    setItems={setItemsEnglish}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                      width: "40%",
                    }}
                    dropDownContainerStyle={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                      width: "40%",
                      borderEndEndRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                    listItemLabelStyle={{
                      fontSize: 13,
                    }}
                    textStyle={{
                      fontSize: 13,
                    }}
                  />
                )}
              />
              {errors?.UnderstandEnglish?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.UnderstandEnglish?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.has_work_permit === true ? (
            <View style={{ zIndex: openWorkPermit ? 900 : 1 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Work Permit</Text> - Do you
                have a work permit?
              </Text>

              <Controller
                control={control}
                name="hasWorkPermit"
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    open={openWorkPermit}
                    value={value}
                    items={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    setOpen={setOpenWorkPermit}
                    setValue={(callback) => {
                      onChange(callback(value));
                    }}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                      width: "40%",
                    }}
                    dropDownContainerStyle={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                      width: "40%",
                      borderBottomRightRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                    listItemLabelStyle={{
                      fontSize: 13,
                    }}
                    textStyle={{
                      fontSize: 13,
                    }}
                  />
                )}
              />
              {errors?.hasWorkPermit?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.hasWorkPermit?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.first_language_id === true ? (
            <View style={{ zIndex: openPreferredlang ? 900 : 1 }}>
              <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
                Is your{" "}
                <Text style={{ fontWeight: "bold" }}>first language</Text> NOT
                English?
              </Text>

              <Controller
                control={control}
                name="preferredLang"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDownPicker
                    open={openPreferredlang}
                    value={valuePreferredlang}
                    items={itemsPreferredlang}
                    setOpen={setOpenPreferredlang}
                    setValue={(value) => {
                      setValuePreferredlang(value);
                      onChange(value);
                    }}
                    setItems={setItemsPreferredlang}
                    placeholder={""}
                    style={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                      width: "40%",
                    }}
                    dropDownContainerStyle={{
                      borderColor: theme.colors.primary,
                      borderRadius: 1,
                      borderWidth: 2,
                      width: "40%",
                      borderBottomRightRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                    listItemLabelStyle={{
                      fontSize: 13,
                    }}
                    textStyle={{
                      fontSize: 13, // Font size for placeholder
                    }}
                  />
                )}
              />
              {errors?.preferredLang?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.preferredLang?.message}
                />
              )}
            </View>
          ) : null}
          {responsedata?.some_finance_it_experience_or_training === true ? (
            <View>
              <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
                I have{" "}
                <Text style={{ fontWeight: "bold" }}>
                  1-5 years of experience in Finance, IT or a related training
                  completed outside of Canada
                </Text>
                .
              </Text>

              <Controller
                control={control}
                name="someFinanceITExperienceOrTraining"
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity style={secondbox} onPress={tick}>
                    {unfilled && <CheckBoxFill />}
                  </TouchableOpacity>
                )}
              />
              {errors?.someFinanceITExperienceOrTraining?.message && (
                <HelperText
                  styles={{ marginTop: 3 }}
                  label={errors?.someFinanceITExperienceOrTraining?.message}
                />
              )}
            </View>
          ) : null}

          <View style={{ height: 50, marginTop: 20 }}>
            {availableFields && (
              <Text
                style={[
                  styles.note,
                  {
                    fontFamily: theme.fonts.labelLarge.fontFamily,
                    fontSize: 14,
                    lineHeight: 17.5,
                  },
                ]}
              >
                <Text style={{ color: "#5CB8B2", fontWeight: "700" }}>
                  Note:
                </Text>{" "}
                <Text style={{ fontWeight: "600" }}>
                  Choosing “prefer not to answer” on any of the above questions
                  will affect your ability to register for this program.
                </Text>
              </Text>
            )}
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}></View>
          <Buttonn
            title="Submit"
            ButtonStyle={{
              borderRadius: 10,
              marginTop: 70,
              marginHorizontal: 20,
              marginBottom: 70,
              zIndex: 1,
            }}
            onPress={handleSubmit(onPress, onError)}
            loading={isloading}
            disabled={!isValid}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EligibilityForm;

const styles = StyleSheet.create({
  note: {
    color: "black",
    marginTop: 5,
    fontSize: 12,
    height: 100,
    width: "100%",
    backgroundColor: "#F7FBFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5CB8B2",
    padding: 20,
  },
  checkboxuntick: {
    borderColor: "rgba(120, 112, 105, 1)",
    borderWidth: 1,
    height: 25,
    width: 25,
  },
  checkboxticked: {
    borderColor: "rgba(120, 112, 105, 1)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(120, 112, 105, 1)",
    height: 25,
    width: 25,
  },
});
