import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HomedetailsHeader from "../../components/HomedetailsHeader";

const PostScreen = () => {
  const [getEvent, setGetEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const route = useRoute();

  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `https://achev.ca/wp-json/wp/v2/posts/${route?.params?.eventId}`
      );

      console.log("responseContent------->>", response.data);
      setGetEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sharePost = async () => {
    try {
      const message = `
        Check out this article: ${getEvent?.title?.rendered}
        ${
          getEvent?.content?.rendered
            ? getEvent.content.rendered.replace(/<[^>]+>/g, "").trim()
            : ""
        }
        
        Author: ${getEvent.yoast_head_json?.author || "N/A"}
        Published on: ${new Date(getEvent.date).toLocaleDateString()}
      `;

      await Share.share({
        title: getEvent.title.rendered,
        message,
        url: getEvent?.yoast_head_json?.og_image[0]?.url || undefined, // Optional image URL
      });
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {getEvent.title && (
          <Text style={styles.title}>{getEvent.title.rendered}</Text>
        )}

        {getEvent.featured_media && (
          <Image
            source={{ uri: getEvent.yoast_head_json.og_image[0].url }}
            style={styles.featuredImage}
          />
        )}
        <HomedetailsHeader
          onPressback={() => homeStack.goBack()}
          prop={""}
          backgroundcolor={""}
          shareArticle={sharePost}
        />

        {getEvent.content &&
          getEvent.content.rendered.split(/<\/p>/).map((paragraph, index) => {
            const cleanParagraph = paragraph.replace(/<[^>]+>/g, "").trim();
            return (
              cleanParagraph.length > 0 && (
                <Text key={index} style={[styles.content, styles.paragraph]}>
                  {cleanParagraph}
                </Text>
              )
            );
          })}

        {getEvent.author && (
          <Text style={styles.author}>
            Author: {getEvent.yoast_head_json.author}
          </Text>
        )}

        {getEvent.date && (
          <Text style={styles.date}>
            Published on: {new Date(getEvent.date).toLocaleDateString()}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  paragraph: {
    marginBottom: 16, // Adjust this value as needed for spacing
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  featuredImage: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  author: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
});
