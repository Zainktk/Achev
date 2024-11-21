import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
// import { Button as AppButton } from "react-native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";

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
};
const OutlinedButton = ({
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
          backgroundColor: ButtonStyle?.backgroundColor,
          padding: ButtonStyle?.padding ? ButtonStyle?.padding : 15,
          borderRadius: LabelStyle?.padding ? LabelStyle?.padding : 10,
        }}
      >
        {loading ? (
          <ActivityIndicator color={"white"} animating={true} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: LabelStyle?.color ? LabelStyle?.color : "#fff",
              textTransform: "capitalize",
              fontSize: LabelStyle?.fontSize ? LabelStyle?.fontSize : 18,
              fontFamily: theme?.fonts.labelMedium?.fontFamily,
            }}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default OutlinedButton;

const styles = StyleSheet.create({
  AppButton: {
    textTransform: "capitalize",
  },
});
