import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Share,
  Platform,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HomedetailsHeader from "../../components/HomedetailsHeader";
import WebView from "react-native-webview";
import RenderHtml from "react-native-render-html";

const PostScreen = () => {
  const [getEvent, setGetEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();
  const [youtubeVideoId, setYoutubeVideoId] = useState(null); // Store YouTube video ID

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `https://achev.ca/wp-json/wp/v2/posts/${route?.params?.eventId}`
      );
      console.log("responseContent------->>", response?.data?.content);
      setGetEvent(response.data);
      const videoId = extractYouTubeVideoId(response.data?.content?.rendered); // Extract video ID from API response
      setYoutubeVideoId(videoId);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching events:",
        error?.response?.data || error?.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
        url: getEvent?.yoast_head_json?.og_image[0]?.url || undefined,
      });
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  // Extract YouTube video ID from HTML content
  const extractYouTubeVideoId = (htmlString) => {
    const match = htmlString?.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const youtubeCode = extractYouTubeVideoId(getEvent?.content?.rendered);

  const width = Dimensions.get("window").width;
  const source = {
    html: getEvent?.content?.rendered,
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

        {/* {getEvent.content &&
          getEvent.content.rendered.split(/<\/p>/).map((paragraph, index) => {
            const cleanParagraph = paragraph.replace(/<[^>]+>/g, "").trim();
            return (
              cleanParagraph.length > 0 && (
                <Text key={index} style={[styles.content, styles.paragraph]}>
                  {cleanParagraph}
                </Text>
              )
            );
          })} */}

        <RenderHtml
          contentWidth={width}
          source={source}
          style={styles.content}
        />

        {youtubeCode ? (
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${youtubeCode}` }}
            style={styles.youtube}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        ) : null}

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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  paragraph: {
    marginBottom: 16,
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
  youtube: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
});

export default PostScreen;
