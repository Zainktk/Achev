import { ApolloError } from "@apollo/client";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
// import { Button as AppButton } from "react-native";
import { ActivityIndicator } from "react-native";
import { useTheme, Button } from "react-native-paper";

type Props = {
  title: string;
  ButtonStyle?: ViewStyle;
  LabelStyle?: TextStyle;
  disabled?: boolean;
  touchSoundDisabled?: boolean;
  color?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  loading?: boolean;
  error?: ApolloError;
  styles?: any;
  labelStyle?: StyleProp<TextStyle>;
};
export const Buttonn = ({
  title,
  onPress,
  LabelStyle,
  ButtonStyle,
  mode,
  color,
  disabled,
  loading,
}: Props) => {
  const theme = useTheme();
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View
        style={{
          ...ButtonStyle,
          backgroundColor: disabled ? "#CFCDCB" : theme?.colors?.primary,
          padding: ButtonStyle?.padding ? ButtonStyle?.padding : 15,
          borderRadius: LabelStyle?.padding ? LabelStyle?.padding : 30,
        }}
      >
        {loading ? (
          <ActivityIndicator color={"white"} animating={true} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: LabelStyle?.color
                ? LabelStyle?.color
                : "rgba(255, 255, 255, 1)",
              textTransform: "capitalize",
              fontSize: LabelStyle?.fontSize ? LabelStyle?.fontSize : 22,
              fontFamily: theme?.fonts.labelMedium?.fontFamily,
              fontWeight: "700",
            }}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export const OutlinedButton = ({
  title,
  onPress,
  LabelStyle,
  ButtonStyle,
  mode,
  color,
  disabled,
  loading,
}: Props) => {
  const theme = useTheme();
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View
        style={{
          ...ButtonStyle,
          padding: ButtonStyle?.padding ? ButtonStyle?.padding : 15,
          borderRadius: LabelStyle?.padding ? LabelStyle?.padding : 10,
          borderWidth: ButtonStyle?.borderWidth
            ? ButtonStyle?.borderWidth
            : 0.5,
          borderTopWidth: 2,
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderBottomWidth: 2,
        }}
      >
        {loading ? (
          <ActivityIndicator color={"white"} animating={true} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: LabelStyle?.color
                ? LabelStyle?.color
                : "rgba(119, 110, 100, 1)",
              textTransform: "capitalize",
              fontSize: LabelStyle?.fontSize ? LabelStyle?.fontSize : 18,
              fontFamily: LabelStyle?.fontSize
                ? LabelStyle?.fontSize
                : theme?.fonts.labelMedium?.fontFamily,
            }}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export const TextLinkButton = ({ title, onPress, labelStyle }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button]}>
      <Text style={[styles.label, labelStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  AppButton: {
    textTransform: "capitalize",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  label: {
    color: "#776E64",
    fontSize: 16,
    fontWeight: "700",
  },
});

export function SecondaryButton({
  title,
  onPress,
  labelStyle,
  styles,
  loading,
  disabled,
  error,
}: Props) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      labelStyle={labelStyle}
      loading={loading ? true : false}
      style={[
        {
          borderRadius: 20,
          backgroundColor: disabled
            ? "rgba(119, 110, 100, 1)"
            : "rgba(119, 110, 100, 1)",
        },
        styles,
      ]}
    >
      {title}
    </Button>
  );
}
