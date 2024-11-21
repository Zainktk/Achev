import { Dimensions, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { OutlinedButton } from "./AppButtons";

type Props = {
  onHandleCamera: () => void;
  onHandleUploadFromGallery: () => void;
  uplaodedImage: { [uri: string]: "" };
  onDeletePorfileImage: () => void;
};
const ImagePickerModal = ({
  onHandleCamera,
  onHandleUploadFromGallery,
  uplaodedImage,
  onDeletePorfileImage,
}: Props) => {
  const width = Dimensions.get("screen").width;
  const theme = useTheme();
  return (
    <View
      style={{
        ...styles.modalContainer,
        width: width * 0.9,
        height: width * 0.7,
      }}
    >
      <View style={styles.ButtonsmodalContainer}>
        {uplaodedImage?.uri ? (
          <View style={styles.ButtonsmodalInnerContainer}>
            <OutlinedButton
              onPress={onHandleUploadFromGallery}
              ButtonStyle={{
                borderColor: theme?.colors?.primary,
                backgroundColor: "transaprent",
              }}
              LabelStyle={{
                color: theme?.colors?.primary,
                fontFamily: theme?.fonts?.headlineMedium?.fontFamily,
              }}
              title={"Choose Image"}
            />
            <OutlinedButton
              onPress={onHandleCamera}
              ButtonStyle={{
                borderColor: theme?.colors?.primary,
                backgroundColor: "transaprent",
              }}
              LabelStyle={{
                color: theme?.colors?.primary,
                fontFamily: theme?.fonts?.headlineMedium?.fontFamily,
              }}
              title={"Take a selfie"}
            />
            <OutlinedButton
              onPress={onDeletePorfileImage}
              ButtonStyle={{
                borderColor: theme?.colors?.primary,
                backgroundColor: "transaprent",
              }}
              LabelStyle={{
                color: theme?.colors?.primary,
                fontFamily: theme?.fonts?.headlineMedium?.fontFamily,
              }}
              title="Remove Image"
            />
          </View>
        ) : (
          <View style={styles.ButtonsmodalInnerContainer}>
            <OutlinedButton
              onPress={onHandleCamera}
              ButtonStyle={{
                borderColor: theme?.colors?.primary,
                backgroundColor: "transaprent",
              }}
              LabelStyle={{
                color: theme?.colors?.primary,
                fontFamily: theme?.fonts?.headlineMedium?.fontFamily,
              }}
              title={"Take a selfie"}
            />
            <OutlinedButton
              onPress={onHandleUploadFromGallery}
              ButtonStyle={{
                borderColor: theme?.colors?.primary,
                backgroundColor: "transaprent",
              }}
              LabelStyle={{
                color: theme?.colors?.primary,
                fontFamily: theme?.fonts?.headlineMedium?.fontFamily,
              }}
              title="Choose Image"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 40,
    backgroundColor: "#fff",
  },
  ButtonsmodalInnerContainer: {
    width: "70%",
    gap: 10,
  },
  ButtonsmodalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
