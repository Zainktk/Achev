import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import cheerio, { AnyNode } from "cheerio";
import WebComp from "./WebComp";

function MyScreen() {
  const [content, setContent] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);

  const extractCoordinates = (
    htmlContent: string | AnyNode | AnyNode[] | Buffer
  ) => {
    const $ = cheerio.load(htmlContent);
    const lat = $("theme_search_map").attr("lat");
    const lng = $("theme_search_map").attr("lng");
    return { lat, lng };
  };
  useEffect(() => {
    const fetchEndpoints = async () => {
      const url = "https://achev.ca/wp-json/wp/v2/pages/25";
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Response Data:", data);

        const renderedContent = data.content.rendered;

        const { lat, lng } = extractCoordinates(renderedContent);
        setCoordinates({ lat, lng });

        setContent(renderedContent);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch endpoints:", error);
      }
    };

    fetchEndpoints();
  }, []);

  console.log("cords------>>>>", coordinates);
  return (
    <View style={styles.container}>
      <WebComp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default MyScreen;
