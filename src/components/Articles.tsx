import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

type ArticleProps = {
  Article: string;
  image: string;
  imagelist?: string;
  isFirstItem?: boolean;
  isSecondItem?: boolean;
  articleData: { image: any; Article: string };
  time?: string;
  title: string;
  Time: any;
};

const Articles = ({
  Article,
  image,
  isFirstItem,
  articleData,
  imagelist,
  isSecondItem,
  time,
}: ArticleProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, isFirstItem && styles.firstItemContainer]}>
      <View style={styles.content}>
        <View style={styles.normalItemContent}>
          <Image source={{ uri: image }} style={styles.imagecontainer} />
          <Text
            style={{
              flexWrap: "wrap",
              fontFamily: theme.fonts.labelLarge.fontFamily,
              color: theme.colors.secondary,
              fontSize: 16,
              fontWeight: "700",
              marginLeft: 20,
              width: "70%",
            }}
          >
            {Article}
          </Text>
        </View>
      </View>
    </View>
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

export default Articles;
