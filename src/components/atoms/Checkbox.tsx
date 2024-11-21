import { Tick } from "@utils";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

type Props = {
  tick: boolean;
  handlePress: (event) => void;
  borderRadius: number;
  height: number;
  width: number;
};
const Checkbox = ({
  tick,
  handlePress,
  borderRadius,
  height,
  width,
}: Props) => {
  const [checked, setischecked] = useState(false);
  const theme = useTheme();
  const box = tick ? styles.checkboxticked : styles.checkboxuntick;

  const initialRender = useRef(true); // useRef to track initial render

  useEffect(() => {
    // Check if it's not the initial render
    if (!initialRender.current) {
      handlePress(checked);
    } else {
      initialRender.current = false; // Update ref to false after first render
    }
  }, [checked]);
  return (
    <TouchableOpacity
      hitSlop={{
        left: 7, // To increase press area on the left side
        right: 7, // To increase press area on the right side
        bottom: 7,
        top: 7,
      }}
      style={{
        ...box,
        backgroundColor: tick
          ? theme?.colors?.outline
          : theme?.colors?.disabled,
        borderRadius: borderRadius ? borderRadius : 50,
        width: width ? width : 25,
        height: height ? height : 25,
      }}
      onPress={() => {
        setischecked(!checked);
      }}
    >
      {tick && <Tick />}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  checkboxuntick: {
    // borderColor: "#4C9AB4",
    borderColor: "transparent",
    borderWidth: 1,
    height: 25,
    width: 25,
  },
  checkboxticked: {
    borderColor: "transparent",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(67, 103, 255, 1)",
    height: 25,
    width: 25,
  },
});
