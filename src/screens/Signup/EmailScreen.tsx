import { useReactiveVar } from "@apollo/client";
import axios from "axios";
import {
  Buttonn,
  ButtonText,
  DateOfbirthField,
  FirstNameField,
  HelperText,
  Input,
  OutlinedButton,
  PasswordInput,
  PhoneNumberField,
  PostalCodeField,
  ScreenSubText,
  ScreenText,
  ScreenTitle,
} from "@atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin, useSignup, useWatchFields } from "@hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthRoutes } from "@types";
import {
  Backarrow,
  CheckBoxFill,
  DobCalender,
  EmailSvg,
  IsForgotPasswordFlow,
  UserEmail,
  VerificationToken,
  enterEmail,
  globalErrorMessageVariable,
  globalSuccessMessageVariable,
  userData,
} from "@utils";
import {
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Linking,
  NativeMethods,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { Calendar } from "react-native-calendars";
import DatePicker from "react-native-date-picker";

interface FieldRefs {
  [key: string]: MutableRefObject<any>;
}
type FieldKey =
  | "email"
  | "firstName"
  | "lastName"
  | "phonenumber"
  | "dob"
  | "postalCode"
  | "password"
  | "confirmPassword";

type Props =
  | NativeStackScreenProps<AuthRoutes, "signup">
  | NativeStackScreenProps<AuthRoutes, "PasswordResetEmail">;

export default function EmailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const isForgotPassword = useReactiveVar(IsForgotPasswordFlow);
  const [loading, setLoading] = useState<boolean>(false);
  const [untick, setUnticked] = useState(false);
  const [unfilled, setUnfilled] = useState(false);
  const [unSelected, setunSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState(new Date());
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [firstErrorFieldKey, setFirstErrorFieldKey] = useState<string | null>(
    null
  );
  const { SendVerificationCode } = useSignup();
  const { SendResetCode } = useLogin();
  const box = untick ? styles.checkboxticked : styles.checkboxuntick;
  const secondbox = unfilled ? styles.checkboxticked : styles.checkboxuntick;
  const thirdbox = unSelected ? styles.checkboxticked : styles.checkboxuntick;

  const scrollViewRef = useRef<ScrollView | null>(null);

  // Scroll to error when it occurs

  const formatDateToLocal = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const fieldRefs: Record<FieldKey, MutableRefObject<any>> = {
    email: useRef(null),
    firstName: useRef(null),
    lastName: useRef(null),
    phonenumber: useRef(null),
    dob: useRef(null),
    postalCode: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      email: route.params?.email,
      firstName: "",
      lastName: "",
      dob: "",
      postalCode: "",
      phonenumber: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(enterEmail),
  });

  const isDisabled = useWatchFields(watch);

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Handle form submission
  const onSubmitLoginForm = async (data: {
    firstName: any;
    lastName: any;
    dob: string;
    email: any;
    postalCode: any;
    phonenumber: any;
    password: any;
  }) => {
    setLoading(true);
    const localDateString = formatDateToLocal(data.dob);
    const age = calculateAge(localDateString);
    console.log("age------>>>>>>>", age);

    if (Object.keys(errors).length > 0) {
      console.log("find errors==========");
      const firstErrorKey = Object.keys(errors)[0];
      setFirstErrorFieldKey(firstErrorKey);
      return;
    }

    const payload: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: localDateString,
      email: data.email,
      optionToEmail: untick ? "Yes" : "No",
      zip: data.postalCode,
      homePhone: data.phonenumber,
      optionToSMS: unSelected ? "Yes" : "No",
      contest: true,
      password: data.password,
    };
    await AsyncStorage.setItem("responseText", JSON.stringify(payload));
    userData(payload);
    console.log(
      "Sending payload to API:===========================>>>>>",
      payload
    );

    try {
      const token = await getToken();

      const response = await axios.post(
        "https://oneclientapi.achev.ca/api/user/register",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      globalSuccessMessageVariable(
        response.data.message || "Registration successful"
      );
      if (age < 14) {
        navigation.navigate("dobnote");
      } else {
        navigation.navigate("PasswordResetOTP", {
          email: data.email,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      globalErrorMessageVariable("Failed to register. Please try again.");
    } finally {
      setLoading(false);
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
      console.log("data---------->>>>>>>", data);
      const expirationTime = Date.now() + data.expiresIn * 10000; // Assuming `expiresIn` is in seconds

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

  const handlePress = () => {
    navigation.navigate("login");
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const fill = () => {
    setUnticked(!untick);
  };

  const tick = () => {
    setUnfilled(!unfilled);
  };
  const Select = () => {
    setunSelected(!unSelected);
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
    setValue("dob", formatDateToLocalDatepicker(selectedDate)); // Update dob field with formatted date
  };

  const openURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL: " + url);
    }
  };
  const scrollToError = (firstErrorFieldKey: string) => {
    const fieldRef = fieldRefs[firstErrorFieldKey as FieldKey];

    if (fieldRef.current && scrollViewRef.current) {
      fieldRef.current.measure(
        (
          x: any,
          y: any,
          width: any,
          height: any,
          pageX: any,
          pageY: number
        ) => {
          scrollViewRef.current.scrollTo({ y: pageY - 50, animated: true }); // Adjust -50 based on your header height
        }
      );
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorFieldKey = Object.keys(errors)[0] as FieldKey;
      scrollToError(firstErrorFieldKey);
    }
  }, [errors]);

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

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
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
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={() => navigation.goBack()}
          >
            <Backarrow />
          </TouchableOpacity>
          <ScreenTitle
            label={route.name}
            styles={{ textTransform: "capitalize" }}
          />
        </View>
        <ScreenSubText
          label={
            "We didn't find an account with that email address. Please complete this form to create your account."
          }
          styles={{ marginTop: 10 }}
        />
      </View>
      <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
        <View
          style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20, gap: 20 }}
        >
          <View ref={fieldRefs.email}>
            <ScreenText label="Email Address*" styles={{ marginBottom: 10 }} />
            <Controller
              control={control}
              name="email"
              render={({
                field: { value, onChange },
                formState: { errors },
              }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  error={errors?.email?.message}
                  multiline={false}
                />
              )}
            />
          </View>
          <View ref={fieldRefs.email}>
            <ScreenText label={"First Name*"} styles={{ marginBottom: 10 }} />
            <Controller
              control={control}
              name="firstName"
              render={({
                field: { value, onChange },
                formState: { errors },
              }) => (
                <FirstNameField
                  value={value}
                  onChangeText={onChange}
                  error={errors?.firstName?.message}
                  multiline={false}
                />
              )}
            />
            {errors?.firstName?.message && (
              <HelperText
                styles={{ marginTop: 3 }}
                label={errors?.firstName?.message}
              />
            )}
          </View>
          <View ref={fieldRefs.lastName}>
            <ScreenText label={"Last Name*"} styles={{ marginBottom: 10 }} />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange } }) => (
                <FirstNameField
                  value={value}
                  onChangeText={onChange}
                  error={errors?.lastName?.message}
                  multiline={false}
                />
              )}
            />
            {errors?.lastName?.message && (
              <HelperText
                styles={{ marginTop: 3 }}
                label={errors?.lastName?.message}
              />
            )}
          </View>
          <View ref={fieldRefs.phonenumber}>
            <ScreenText label={"Phone Number*"} styles={{ marginBottom: 10 }} />
            <Controller
              control={control}
              name="phonenumber"
              render={({ field: { value, onChange } }) => (
                <PhoneNumberField
                  value={value}
                  onChangeText={onChange}
                  error={errors?.phonenumber?.message}
                  multiline={false}
                />
              )}
            />
            {errors?.phonenumber?.message && (
              <HelperText
                styles={{ marginTop: 3 }}
                label={errors?.phonenumber?.message}
              />
            )}
          </View>
          <View ref={fieldRefs.dob}>
            <ScreenText
              label={"Date of Birth*"}
              styles={{ marginBottom: 10 }}
            />
            <Controller
              control={control}
              name="dob"
              render={({ field: { value, onChange } }) => (
                <DateOfbirthField
                  value={value}
                  onChangeText={onChange}
                  error={errors?.dob?.message}
                  multiline={false}
                  OpenCalender={onPressCalender}
                />
              )}
            />
            {errors?.dob?.message && (
              <HelperText
                styles={{ marginTop: 3 }}
                label={errors?.dob?.message}
              />
            )}
          </View>
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
          <View ref={fieldRefs.postalCode}>
            <ScreenText label={"Postal Code*"} styles={{ marginBottom: 10 }} />
            <Controller
              control={control}
              name="postalCode"
              render={({ field: { value, onChange } }) => (
                <PostalCodeField
                  value={value}
                  onChangeText={onChange}
                  error={errors?.postalCode?.message}
                  multiline={false}
                />
              )}
            />
            {errors?.postalCode?.message && (
              <>
                <Text
                  style={{
                    color: theme.colors?.error,
                    fontSize: theme?.fonts?.labelSmall.fontSize,
                    textTransform: "capitalize",
                  }}
                >
                  Please enter your Canadian postal code in the format
                </Text>
                <Text
                  style={{
                    color: theme.colors?.error,
                    fontSize: theme?.fonts?.labelSmall.fontSize,
                    textTransform: "uppercase",
                  }}
                >
                  A1A 1A1
                </Text>
              </>
            )}
          </View>
          <View ref={fieldRefs.password}>
            <ScreenText
              label="password*"
              styles={{ textTransform: "uppercase", marginBottom: 5 }}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <PasswordInput
                  value={value}
                  onChangeText={onChange}
                  multiline={false}
                />
              )}
            />
            {errors?.password?.message ? (
              <HelperText
                styles={{ marginTop: 3 }}
                label={errors?.password?.message}
              />
            ) : (
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: "#776E64",
                  fontWeight: "600",
                  fontSize: 16,
                  marginTop: 10,
                }}
              >
                Password must contain at least 1 capital letter, 1 number and 8
                characters.
              </Text>
            )}
          </View>
          <View ref={fieldRefs.confirmPassword}>
            <ScreenText
              label="confirm password*"
              styles={{ textTransform: "uppercase", marginBottom: 5 }}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <PasswordInput
                  value={value}
                  onChangeText={onChange}
                  multiline={false}
                />
              )}
            />
            {errors?.confirmPassword?.message && (
              <HelperText
                styles={{ marginTop: 3 }}
                label={errors?.confirmPassword?.message}
              />
            )}
          </View>
        </View>
        <View>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 30,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={box} onPress={fill}>
              {untick && <CheckBoxFill />}
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 13,
                marginHorizontal: 10,
                fontFamily: "Inter-Regular",
                fontWeight: "400",
              }}
            >
              Yes, I would like to receive marketing emails such as newsletters
              and event updates from Achēv. (Note: Currently only available in
              English.)
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 30,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={thirdbox} onPress={Select}>
              {unSelected && <CheckBoxFill />}
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 13,
                marginHorizontal: 10,
                fontFamily: "Inter-Regular",
                fontWeight: "400",
              }}
            >
              Yes, I would like to receive SMS messages such as event
              notifications and program updates from Achēv. (Note: Currently
              only available in English.)
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 30,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={secondbox} onPress={tick}>
              {unfilled && <CheckBoxFill />}
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 13,
                marginHorizontal: 10,
                fontFamily: "Inter-Regular",
                fontWeight: "400",
              }}
            >
              I agree with Achēv's{" "}
              <Text
                style={{ color: "red" }}
                onPress={() => openURL("https://achev.ca/terms-use/")}
              >
                Terms of Use
              </Text>{" "}
              and{" "}
              <Text
                style={{ color: "red" }}
                onPress={() =>
                  openURL("https://achev.ca/privacy-statement-canada/")
                }
              >
                Privacy Policies
              </Text>
            </Text>
          </View>
          {unfilled ? (
            <Buttonn
              title="Continue"
              ButtonStyle={{
                borderRadius: 10,
                marginTop: 30,
                marginHorizontal: 20,
              }}
              onPress={handleSubmit(onSubmitLoginForm, onError)}
              loading={loading} // Show loading indicator
            />
          ) : (
            <Buttonn
              title="Continue"
              ButtonStyle={{
                borderRadius: 10,
                marginTop: 30,
                marginHorizontal: 20,
              }}
              disabled={true}
            />
          )}
          <View style={{ marginTop: 20 }}>
            {unfilled ? null : (
              <Text
                style={{
                  marginTop: 5,
                  marginHorizontal: 40,
                  color: "#776E64",
                  fontSize: 16,
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "600",
                }}
              >
                * These fields are mandatory.
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 20,
              }}
            >
              <EmailSvg />

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "600",
                  color: "#776E64",
                  marginHorizontal: 10,
                  marginTop: 10,
                }}
              >
                You must agree to the Terms of Use & Privacy Policy in order to
                create an account.
              </Text>
            </View>
            {/* <OutlinedButton title={""}/> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emailField: {
    flex: 2,
  },
  loginButtonContainer: {
    justifyContent: "flex-end",
    flex: 1,
    marginBottom: 20,
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
  icon: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
