import { DropDownIcon } from "@utils";
import { useState } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { ScreenText } from "./Typography";

import { CountryPicker } from "react-native-country-codes-picker";

type Props = {
  onChangeText?: (text: String) => void;
  value?: string;
  onPressDropDown?: (value: GestureResponderEvent) => void;
  onChangeCountry: (value: string) => void;
  countryname: string;
};
const Dropdown = ({
  onChangeText,
  value,
  onPressDropDown,
  countryname,
  onChangeCountry,
}: Props) => {
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  // const [countryname, setCountyname] = useState<string>(
  //   countryCodes?.[0]?.name?.en
  // );
  const theme = useTheme();
  return (
    <>
      <Pressable onPress={() => setShowCountryModal(true)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 14,
            alignItems: "center",
          }}
        >
          <ScreenText label={countryname} />

          <DropDownIcon />

          {/* <Input
      CursonHidden={true}
      onChangeText={onChangeText}
      value={value}
      disabled={true}
      style={{ backgroundColor: "transparent", color: "#000" }}
      // error={error ? true : false}
      rightIcon={
        <TextInput.Icon
          icon={() => <DropDownIcon onPress={onPressDropDown} />}
        />
      }
    /> */}
        </View>

        {/* <CountryPicker withFilter visible={showCountryModal} /> */}
      </Pressable>

      <Divider
        bold
        style={{
          marginTop: 20,
          backgroundColor: theme?.colors?.divider,
        }}
      />

      <CountryPicker
        style={{
          flag: { display: "none" },
          modal: {
            height: "50%",
            backgroundColor: "white",
          },
        }}
        showOnly={["hello"]}
        show={showCountryModal}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          onChangeCountry(item?.name?.en);
          setShowCountryModal(false);
        }}
      />
    </>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  flag: { display: "none" },
  // Dial code styles [Text]
  dialCode: { display: "none" },
});
