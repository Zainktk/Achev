import {
  ChangeEye,
  ChangeEyeOff,
  CrossSvg,
  DobCalender,
  Eye,
  EyeOff,
  InputBackArrow,
  SearchIcon,
  SignupCalender,
} from "@utils";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { HelperText } from "./Typography";

type Props = {
  secureTextEntry?: boolean;
  label?: string;
  style?: TextStyle | ViewStyle;
  value?: string;
  variant?: "flat" | "outlined";
  onChangeText?: (text: string) => void;
  error?: string;
  rightIcon?: React.ReactNode;
  CursonHidden?: boolean;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  multiline: boolean;
  onpressSearch: () => void;
  newsdetails?: string;
  homesearch?: string;
  EventDeatils?: string;
  onBlur: () => void;
  onFocus: () => void;
  OpenCalender: () => void;
};

export const Input = ({
  style,
  label,
  secureTextEntry,
  onChangeText,
  value,
  error,
  rightIcon,
  CursonHidden,
  disabled,
  multiline,
  keyboardType,
  placeholder,
  onBlur,
  onFocus,
}: Props) => {
  const theme = useTheme();
  const handleTextChange = (text: string) => {
    const lowercaseText = text.toLowerCase();
    if (onChangeText) {
      onChangeText(lowercaseText);
    }
  };

  return (
    <>
      <TextInput
        multiline={multiline ? multiline : false}
        activeUnderlineColor={"transparent"}
        // numberOfLines={5}
        placeholder={placeholder}
        keyboardAppearance="light"
        selectionColor="#000"
        disabled={disabled}
        caretHidden={CursonHidden}
        onChangeText={handleTextChange}
        cursorColor={"black"}
        onBlur={onBlur}
        autoCapitalize="none"
        onFocus={onFocus}
        value={value}
        mode="flat"
        keyboardType={keyboardType ? keyboardType : "ascii-capable"}
        style={{
          backgroundColor: "transparent",
          borderTopColor: theme.colors?.primary,
          borderRightColor: theme.colors?.primary,
          borderLeftColor: theme.colors?.primary,
          borderBottomColor: theme.colors?.primary,
          borderBottomWidth:
            style?.borderBottomWidth >= 0 ? style.borderBottomWidth : 2,
          borderRightWidth: 2,
          borderLeftWidth: 2,
          borderTopWidth: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        textColor={theme?.colors?.secondary}
        // onContentSizeChange={(e) =>
        //   handleContentSizeChange(
        //     e.nativeEvent.contentSize.width,
        //     e.nativeEvent.contentSize.height
        //   )
        // }
        // label={label}
        // error={error ? true : false}
        secureTextEntry={false}
        right={rightIcon}
      />
      {error && <HelperText styles={{ marginTop: 3 }} label={error} />}
    </>
  );
};

export const PasswordInput = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const [hidePassword, sethidePassword] = useState<boolean>(true);
  const theme = useTheme();

  return (
    <>
      <TextInput
        onChangeText={onChangeText}
        activeUnderlineColor={"transparent"}
        activeOutlineColor={theme.colors?.primary}
        // outlineColor={theme.colors?.primary}
        selectionColor="#000"
        value={value}
        mode={"outlined"}
        style={{
          backgroundColor: "transparent",
          // borderTopColor: theme.colors?.primary,
          // borderRightColor: theme.colors?.primary,
          // borderLeftColor: theme.colors?.primary,
          // borderBottomColor: theme.colors?.primary,
          borderColor: theme.colors?.primary,
          borderWidth: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        outlineStyle={{
          borderRadius: 1,
          borderWidth: 1,
        }}
        // label={label}
        textColor={theme?.colors?.secondary}
        cursorColor={"black"}
        secureTextEntry={hidePassword}
        error={error ? true : false}
        right={
          <TextInput.Icon
            icon={() => (!hidePassword ? <Eye /> : <EyeOff />)}
            onPress={() => {
              sethidePassword(!hidePassword);
              return false;
            }}
          />
        }
      />

      {/* {error && (
        <>
          <HelperText
            styles={{ width: 250, backgroundColor: "red", display: "flex" }}
            label={error}
          />
        </>
      )} */}
    </>
  );
};

export const ChangePasswordInput = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const [hidePassword, sethidePassword] = useState<boolean>(true);
  const theme = useTheme();

  return (
    <>
      <TextInput
        onChangeText={onChangeText}
        activeUnderlineColor={"transparent"}
        activeOutlineColor={theme.colors?.primary}
        // outlineColor={theme.colors?.primary}
        selectionColor="#000"
        value={value}
        mode={"flat"}
        style={{
          marginHorizontal: 20,
          borderBottomColor: "#776E64", // Set the underline color
          borderBottomWidth: 1, // Set underline width
          paddingVertical: 8, // Add some padding for better appearance
        }}
        outlineStyle={{
          borderRadius: 1,
          borderWidth: 1,
        }}
        // label={label}
        textColor={theme?.colors?.secondary}
        cursorColor={"black"}
        secureTextEntry={hidePassword}
        error={error ? true : false}
        right={
          <TextInput.Icon
            icon={() => (!hidePassword ? <ChangeEye /> : <ChangeEyeOff />)}
            onPress={() => {
              sethidePassword(!hidePassword);
              return false;
            }}
          />
        }
      />

      {/* {error && (
        <>
          <HelperText
            styles={{ width: 250, backgroundColor: "red", display: "flex" }}
            label={error}
          />
        </>
      )} */}
    </>
  );
};

export const SearchBox = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const [hidePassword, sethidePassword] = useState<boolean>(true);
  const theme = useTheme();

  return (
    <>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        placeholder="You are looking for"
        placeholderTextColor={theme?.colors?.Neutral_6}
        activeUnderlineColor={"transparent"}
        selectionColor={theme.colors?.primary}
        style={{
          backgroundColor: "white",
          // borderBottomColor: theme.colors?.chatBoxBacground,
          // borderBottomWidth: 1,
          borderWidth: 0,
          color: theme.colors.primary,
          fontFamily: theme.fonts.labelLarge.fontFamily,
          fontWeight: "700",
          borderTopColor: theme.colors?.primary,
          borderRightColor: theme.colors?.primary,
          borderLeftColor: theme.colors?.primary,
          borderBottomColor: theme.colors?.primary,
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderLeftWidth: 2,
          borderTopWidth: 2,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
        outlineStyle={{}}
        // label={label}
        textColor={theme?.colors?.primary}
        error={error ? true : false}
        left={
          <TextInput.Icon
            icon={() => (
              <SearchIcon color={theme.fonts.labelLarge.fontFamily} />
            )}
          />
        }
        right={<TextInput.Icon icon={() => <CrossSvg />} />}
      />
      {/* {error && (
        <>
          <HelperText
            styles={{ width: 250, backgroundColor: "red", display: "flex" }}
            label={error}
          />
        </>
      )} */}
    </>
  );
};

export const NewsSearchBox = ({
  label,
  onChangeText,
  value,
  variant,
  error,
  onpressSearch,
  EventDeatils,
  homesearch,
  newsdetails,
}: Props) => {
  const [hidePassword, sethidePassword] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>(value || "");
  const theme = useTheme();
  const handleClearText = () => {
    setInputValue("");
    onChangeText?.("");
  };

  const handleTextChange = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  return (
    <>
      <TextInput
        onChangeText={handleTextChange}
        value={inputValue}
        placeholder={
          newsdetails
            ? "Search for news & articles"
            : homesearch
            ? "Search for events & news"
            : EventDeatils
            ? "Search for events&worshop"
            : "search"
        }
        placeholderTextColor={theme?.colors?.Neutral_6}
        activeUnderlineColor={"transparent"}
        selectionColor={theme.colors?.primary}
        style={{
          backgroundColor: "white",
          // borderBottomColor: theme.colors?.chatBoxBacground,
          // borderBottomWidth: 1,
          borderWidth: 0,
          color: theme.colors.primary,
          fontFamily: theme.fonts.labelLarge.fontFamily,
          fontWeight: "700",
          borderTopColor: theme.colors?.primary,
          borderRightColor: theme.colors?.primary,
          borderLeftColor: theme.colors?.primary,
          borderBottomColor: theme.colors?.primary,
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderLeftWidth: 2,
          borderTopWidth: 2,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          height: 45,
        }}
        outlineStyle={{}}
        // label={label}
        textColor={theme?.colors?.primary}
        error={error ? true : false}
        left={
          <TextInput.Icon
            icon={() => (
              <InputBackArrow color={theme.fonts.labelLarge.fontFamily} />
            )}
            onPress={onpressSearch}
          />
        }
        right={
          <TextInput.Icon icon={() => <CrossSvg />} onPress={handleClearText} />
        }
      />
      {/* {error && (
        <>
          <HelperText
            styles={{ width: 250, backgroundColor: "red", display: "flex" }}
            label={error}
          />
        </>
      )} */}
    </>
  );
};

export const FirstNameField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      cursorColor={"black"}
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    />
  );
};

export const EditNameField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      selectionColor="#000"
      cursorColor="black"
      style={{
        backgroundColor: "transparent",
        borderBottomColor: "#776E64", // Set the underline color
        borderBottomWidth: 1, // Set underline width
        paddingVertical: 8, // Add some padding for better appearance
        marginHorizontal: 20,
      }}
    />
  );
};

export const EditLastNameField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      outlineColor="none"
      mode="flat"
      underlineStyle={{
        borderColor: "#776E64",
      }}
      selectionColor="#000"
      cursorColor={"black"}
      style={{
        backgroundColor: "transparent",
        borderBottomColor: "#776E64",
        borderBottomWidth: 1,
        paddingVertical: 8,
        marginHorizontal: 20,
      }}
    />
  );
};

export const EditPhoneField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");

    let formattedText = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formattedText = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formattedText = `${cleaned.slice(0, 3)}-${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6, 10)}`;
    }

    return formattedText;
  };

  const handleTextChange = (text: any) => {
    const formattedText = formatPhoneNumber(text);
    if (onChangeText) {
      onChangeText(formattedText);
    }
  };
  return (
    <TextInput
      onChangeText={handleTextChange}
      value={value}
      outlineColor="none"
      mode="flat"
      underlineStyle={{
        borderColor: "#776E64",
      }}
      selectionColor="#000"
      cursorColor={"black"}
      style={{
        backgroundColor: "transparent",
        borderBottomColor: "#776E64",
        borderBottomWidth: 1,
        paddingVertical: 8,
        marginHorizontal: 20,
      }}
    />
  );
};
export const EditPostalCodeField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();

  const handleTextChange = (text: string) => {
    let formattedText = text.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Only letters and numbers
    if (formattedText.length > 3) {
      formattedText = `${formattedText.slice(0, 3)} ${formattedText.slice(3)}`; // Add space after the third character
    }
    onChangeText?.(formattedText); // Use optional chaining to call onChangeText only if it is defined
  };
  return (
    <TextInput
      onChangeText={handleTextChange}
      value={value}
      outlineColor="none"
      mode="flat"
      underlineStyle={{
        borderColor: "#776E64",
      }}
      selectionColor="#000"
      cursorColor={"black"}
      style={{
        backgroundColor: "transparent",
        borderBottomColor: "#776E64",
        borderBottomWidth: 1,
        paddingVertical: 8,
        marginHorizontal: 20,
      }}
    />
  );
};
export const EditBobField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
  OpenCalender,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      outlineColor="none"
      mode="flat"
      underlineStyle={{
        borderColor: "#776E64",
      }}
      selectionColor="#000"
      cursorColor={"black"}
      editable={false}
      textColor="black"
      style={{
        backgroundColor: "transparent",
        borderBottomColor: "#776E64",
        borderBottomWidth: 1,
        paddingVertical: 8,
        marginHorizontal: 20,
      }}
      right={
        <TextInput.Icon icon={() => <DobCalender />} onPress={OpenCalender} />
      }
    />
  );
};
export const PostalCodeField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();

  const handleTextChange = (text: string) => {
    let formattedText = text.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Only letters and numbers
    if (formattedText.length > 3) {
      formattedText = `${formattedText.slice(0, 3)} ${formattedText.slice(3)}`; // Add space after the third character
    }
    onChangeText?.(formattedText); // Use optional chaining to call onChangeText only if it is defined
  };
  return (
    <TextInput
      onChangeText={handleTextChange}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      placeholder={"A1A 1A1"}
      autoCapitalize="characters"
      cursorColor={"black"}
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        textTransform: "uppercase",
      }}
    />
  );
};

export const DateOfbirthField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
  rightIcon,
  OpenCalender,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      cursorColor={"black"}
      editable={false}
      textColor="black"
      right={
        <TextInput.Icon icon={() => <DobCalender />} onPress={OpenCalender} />
      }
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    />
  );
};

export const BenchmarkField = ({
  label,
  onChangeText = () => {},
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();

  const handleChangeText = (text: string) => {
    if (text.length <= 1 && /^[0-8]*$/.test(text)) {
      onChangeText(text);
    }
  };
  return (
    <TextInput
      onChangeText={handleChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        width: 50,
        height: 40,
      }}
    />
  );
};
export const BenchmarkReading = ({
  label,
  onChangeText = () => {},
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();

  const handleChangeText = (text: string) => {
    if (text.length <= 1 && /^[0-8]*$/.test(text)) {
      onChangeText(text);
    }
  };
  return (
    <TextInput
      onChangeText={handleChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        width: 50,
        height: 40,
      }}
    />
  );
};
export const BenchmarkSpeaking = ({
  label,
  onChangeText = () => {},
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  const handleChangeText = (text: string) => {
    if (text.length <= 1 && /^[0-8]*$/.test(text)) {
      onChangeText(text);
    }
  };
  return (
    <TextInput
      onChangeText={handleChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        width: 50,
        height: 40,
      }}
    />
  );
};

export const BenchmarkWriting = ({
  label,
  onChangeText = () => {},
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  const handleChangeText = (text: string) => {
    if (text.length <= 1 && /^[0-8]*$/.test(text)) {
      onChangeText(text);
    }
  };

  return (
    <TextInput
      onChangeText={handleChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        width: 50,
        height: 40,
      }}
    />
  );
};

export const WorkPermitField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    />
  );
};
export const ITExperianceField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    />
  );
};
export const ArrivalField = ({
  label,
  onChangeText,
  OpenCalender,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
      right={
        <TextInput.Icon icon={() => <DobCalender />} onPress={OpenCalender} />
      }
    />
  );
};

export const PhoneNumberField = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");

    let formattedText = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formattedText = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formattedText = `${cleaned.slice(0, 3)}-${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6, 10)}`;
    }

    return formattedText;
  };

  const handleTextChange = (text: any) => {
    const formattedText = formatPhoneNumber(text);
    if (onChangeText) {
      onChangeText(formattedText);
    }
  };

  return (
    <TextInput
      onChangeText={handleTextChange}
      value={value}
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      placeholder={"416-555-5555"}
      cursorColor={"black"}
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    />
  );
};

export const DateOfbirth = ({
  label,
  onChangeText,
  value,
  variant,
  error,
}: Props) => {
  const theme = useTheme();
  return (
    <TextInput
      activeUnderlineColor={"transparent"}
      selectionColor="#000"
      style={{
        backgroundColor: "transparent",
        borderTopColor: theme.colors?.primary,
        borderRightColor: theme.colors?.primary,
        borderLeftColor: theme.colors?.primary,
        borderBottomColor: theme.colors?.primary,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    />
  );
};

const styles = StyleSheet.create({});
