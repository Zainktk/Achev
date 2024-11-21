import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

type ArticleProps = {
  Article: string;
  image: string;
  imagelist?: string;
  isFirstItem?: boolean;
  isSecondItem?: boolean;

  time?: string;
  title: string;
  Time: any;
  onPress: () => void;
};

const ArticleDetailComp = ({
  Article,
  image,
  isFirstItem,

  imagelist,
  isSecondItem,
  time,
  title,
  Time,
  onPress,
}: ArticleProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, isFirstItem && styles.firstItemContainer]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.normalItemContent}>
          <Image source={{ uri: image }} style={styles.imagecontainer} />
          <View
            style={{
              flexWrap: "wrap",
              gap: 5,
              marginLeft: 20,
              width: "70%",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  color: theme.colors.secondary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {title}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: "rgba(119, 110, 100, 1)",
                  fontWeight: "500",
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontSize: 13,
                }}
              >
                {new Date(Time).getDate()}- {new Date(Time).getMonth()}-
                {new Date(Time).getFullYear()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  content: {
    paddingHorizontal: 40,
    alignItems: "center",
  },
  firstItemContent: {
    alignItems: "center",
  },
  normalItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  firstItemContainer: {},
  firstImage: {
    height: 150,
    width: 360,
    alignSelf: "center",
    marginTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  imagecontainer: {
    width: 100,
    height: 80,
  },
});

export default ArticleDetailComp;
