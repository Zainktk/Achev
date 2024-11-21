import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Homeheader from "./../components/Homeheader";
import Carousel from "react-native-snap-carousel";
import CarousalComp from "./../components/CarousalComp";
import Articles from "./../components/Articles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
import { useNavigation } from "@react-navigation/native";
import EventsComp from "./../components/EventsComp";
import ArticleDetailComp from "./../components/ArticleDetailComp";
import HomedetailsHeader from "./../components/HomedetailsHeader";
import axios from "axios";

type CarouselItem = { item: { image: any; Day: string; Time: string } };
type FlatListitem = {
  item: { image: string; Article: string; imagelist?: string; time?: string };
};
type Eventtypes = { item: { image: any; title: string; Time: string } };
const NewsDetailScreen = () => {
  //useStatestartshere
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { image: string; Article: string; imagelist: string }[]
  >([]);
  const [searchiconPress, setsearchiconPress] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null);
  //useStatesEndhere

  //navigationStartshere
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();
  //navigationEndshere

  //variablesStarthere
  const { width: viewportWidth } = Dimensions.get("window");
  const carouselRef = useRef<Carousel<any>>(null);
  //variableEndshere

  //arrayStartshere

  //arrayEndshere

  //functionStartshere
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let allPosts: any[] = [];
        let page = 1;
        let totalPages = 1;
        while (page <= totalPages) {
          const response = await axios({
            method: "get",
            url: "https://achev.ca/wp-json/wp/v2/posts",
            params: {
              page: page,
              per_page: 100,
            },
          });

          if (totalPages === 1) {
            totalPages = response.headers["x-wp-totalpages"];
          }

          allPosts = [...allPosts, ...response.data];

          page++;
          console.log("response------------------>>>", response?.data);
        }

        const parsedData = allPosts.map((item) => ({
          id: item.id,
          title: item.title.rendered,
          date: item.date,
          image:
            item.yoast_head_json?.og_image?.[0]?.url || "default-image-url",
        }));

        setPosts(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const onPressPost = (eventId: any) => {
    setSelectedEventId(eventId);
    homeStack.navigate("PostScreen", {
      eventId: eventId,
    });
  };

  const onEventpress = () => {
    homeStack.navigate("eventDetail");
  };

  const onpressSearch = () => {
    setsearchiconPress(!searchiconPress);
    setSearchQuery("");
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    filterData(text);
  };

  const filterData = (query: string) => {
    const lowerCaseQuery =
      query && typeof query === "string" ? query.toLowerCase() : "";

    const filteredData = posts.filter((item) =>
      item?.title.toLowerCase().includes(lowerCaseQuery)
    );
    setSearchResults(filteredData);
  };

  const ItemSeparator = () => (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        height: 1,
        width: "80%",
        backgroundColor: "rgba(92, 184, 178, 1)",
        margin: 40,
      }}
    />
  );

  const onPressback = () => {
    homeStack.navigate("home");
    console.log("===>pressed");
  };
  //functionEndshere

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{
          alignSelf: "center",
          justifyContent: "center",
          flex: 1,
        }}
      />
    );
  }
  console.log("posts=====>", posts);
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 30 }}>
      <ScrollView style={{ flex: 1 }}>
        {searchQuery !== "" ? (
          <View style={{}}>
            <View style={{ marginTop: 5 }}>
              <HomedetailsHeader
                prop={"newsdetails"}
                onpressSearch={onpressSearch}
                searchiconPress={searchiconPress}
                onSearchChange={handleSearchChange}
                onPressback={onPressback}
                backgroundcolor={""}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={searchQuery !== "" ? searchResults : posts}
                renderItem={({ item }) => (
                  <ArticleDetailComp
                    title={item.title}
                    image={item.image}
                    Time={item.date}
                    Article={""}
                    onPress={() => onPressPost(item.id)}
                  />
                )}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <View style={{ marginTop: 5 }}>
                <HomedetailsHeader
                  prop={"newsdetails"}
                  onpressSearch={onpressSearch}
                  searchiconPress={searchiconPress}
                  onSearchChange={handleSearchChange}
                  onPressback={onPressback}
                />
              </View>
              <FlatList
                data={searchQuery !== "" ? searchResults : posts}
                renderItem={({ item }) => (
                  <ArticleDetailComp
                    title={item.title}
                    image={item.image}
                    Time={item.date}
                    Article={""}
                    onPress={() => onPressPost(item.id)}
                  />
                )}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({});
