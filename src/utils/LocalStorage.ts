import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageKeysData } from "@types";

export const getLocalStorageItem = async (key: any) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return processGetData(value);
    }
    return "";
  } catch (err) {
    console.error("error in get store Data");
  }
};
const processGetData = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {}
};

export const processSetData = (value: any) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  return value.toString();
};

export const setLocalStorageItem = async (data: LocalStorageKeysData) => {
  const { user, token, profile } = data;

  try {
    if (token && !user && !profile) {
      await AsyncStorage.setItem("token", token);
      // await AsyncStorage.setItem("user", JSON.stringify(user));
      // await AsyncStorage.setItem("profile", JSON.stringify(user));
    } else if (user && token && profile) {
      await AsyncStorage.setItem("user", processSetData(user));
      await AsyncStorage.setItem("profile", processSetData(profile));
      await AsyncStorage.setItem("token", token);
    }
  } catch (error) {
    // Error saving data
  }
};
