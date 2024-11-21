import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
  styles?: TextStyle | ViewStyle;
  label: string | string[];
  color?: string;
};

export const ScreenTitle = ({ styles, label, color }: Props) => {
  const theme: any = useTheme();
  return (
    <Text
      style={{
        ...styles,
        fontSize: 26,
        fontWeight: "800",
        color: color ? color : theme?.colors?.Secondary,
        fontFamily: theme?.fonts?.labelLarge.fontFamily,
      }}
    >
      {label}
    </Text>
  );
};
export const ScreenText = ({ styles, label, color }: Props) => {
  const theme = useTheme();

  return (
    <Text
      style={{
        ...styles,
        fontSize: styles?.fontSize ?? theme?.fonts?.labelMedium?.fontSize,
        fontWeight: styles?.fontWeight ?? theme?.fonts?.labelSmall?.fontWeight,
        color: color ? color : theme?.colors?.secondary,
        fontFamily: styles?.fontFamily ?? theme?.fonts?.labelSmall.fontFamily,
      }}
    >
      {label}
    </Text>
  );
};
export const ButtonText = ({ styles, label, color }: Props) => {
  const theme = useTheme();
  return (
    <Text
      style={{
        ...styles,
        fontSize: styles?.fontSize ?? theme?.fonts?.labelSmall?.fontSize,
        fontWeight: styles?.fontWeight ?? theme?.fonts?.labelMedium?.fontWeight,
        color: theme?.colors?.tertiary,
        fontFamily: theme?.fonts?.labelMedium.fontFamily,
      }}
    >
      {label}
    </Text>
  );
};

export const HelperText = ({ label, styles, color }: Props) => {
  const theme = useTheme();
  return (
    <Text
      style={{
        ...styles,
        color: color ?? theme.colors?.error,
        fontSize: theme?.fonts?.labelSmall.fontSize,
        textTransform: "capitalize",
      }}
    >
      {label}
    </Text>
  );
};

export const ScreenSubText = ({ styles, label, color }: Props) => {
  const theme = useTheme();
  return (
    <Text
      style={{
        ...styles,
        fontFamily: theme.fonts.labelLarge.fontFamily,
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 15,
        color: theme.colors.secondary,
      }}
    >
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({});
