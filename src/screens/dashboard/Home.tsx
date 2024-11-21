import {
  ActivityIndicator,
  Button,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Homeheader from "../../components/Homeheader";
import Carousel from "react-native-snap-carousel";
import CarousalComp from "../../components/CarousalComp";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreenFlowType } from "src/navigation/dashboard/HomeNavigator";
import { useNavigation } from "@react-navigation/native";
import EventsComp from "../../components/EventsComp";
import axios from "axios";
import NewsCarousalComp from "../../components/NewsCarousalComp";
import HomedetailsHeader from "../../components/HomedetailsHeader";
import LottieView from "lottie-react-native";
import AchevLoader from "../../assets/AchevLoader.json";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReactiveVar } from "@apollo/client";
import { userData, userToken } from "../../utils/GlobalVariables";
import ChronoEventComp from "../../components/ChronoEventComp";
import { CrossSvg, InputBackArrow, MoreArrow, SearchIcon } from "@utils";
import { TextInput, useTheme } from "react-native-paper";
import { Buttonn } from "@atoms";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  //useStatestartshere
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    {
      type: string;
      data: {
        id: number;
        title: string;
        date: string;
        image: string;
        venue: string;
        end_date: string;
      };
    }[]
  >([]);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchiconPress, setsearchiconPress] = useState(false);
  const insets = useSafeAreaInsets();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const user = useReactiveVar(userData);

  const [query, setQuery] = useState<string>(""); // Search query
  const [results, setResults] = useState<any[]>([]); // Search results
  const [isloading, seIstLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const token = useReactiveVar(userToken);

  useEffect(() => {
    const hndle = async () => {
      const visited = await AsyncStorage.getItem("NotifiScreenVisited");
      console.log("visited======><", visited);
    };
    hndle();
  }, []);
  const theme = useTheme();
  //useStatesEndhere
  console.log("user---------------------->>>>>>>>>>>>", user?.dateOfBirth);
  //navigationStartshere
  const homeStack =
    useNavigation<NativeStackNavigationProp<HomeScreenFlowType>>();
  //navigationEndshere

  //variablesStarthere
  const { width: viewportWidth } = Dimensions.get("window");
  const carouselRef = useRef<Carousel<any>>(null);
  //variableEndshere

  //GETRequestStartsHere

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let allEvents: any[] = [];
        let page = 1;
        let totalPages = 1;
        while (page <= totalPages) {
          const response = await axios.get(
            "https://achev.ca/wp-json/tribe/events/v1/events",

            {
              params: { page, per_page: 100 },
            }
          );
          if (totalPages === 1) {
            totalPages = response.headers["x-wp-totalpages"];
          }
          allEvents = [...allEvents, ...response.data.events];
          page++;
        }

        const parsedData = allEvents.map((item) => ({
          id: item.id,
          title: item.title,
          date: item.start_date,
          end_date: item.end_date,
          image: item.image.url,
          description: item.website,
          venue: item.venue.venue,
        }));
        setEvents(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fetchResults = async (newPage: number) => {
    setError(null);

    try {
      let subtype;
      const response = await axios.get(
        "https://achev.ca/wp-json/wp/v2/search",

        {
          params: {
            search: query, // Search term
            per_page: 10, // Fetch 10 results at a time
            page: newPage, // Current page
            subtype: subtype,
          },
        }
      );

      // If the number of results returned is less than per_page, there are no more results to load
      if (response.data.length < 10) {
        setHasMore(false);
      }

      // Concatenate new results with the existing ones
      setResults((prevResults) => [...prevResults, ...response.data]);
    } catch (err) {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  const searchSite = () => {
    setResults([]); // Clear previous results

    setPage(1); // Reset page to 1
    setHasMore(true); // Reset hasMore
    fetchResults(1); // Fetch first page of results
  };

  const handleSearchInputChange = (text: string) => {
    setQuery(text);
    setResults([]);
    setPage(1);
    setHasMore(true);

    if (text) {
      fetchResults(1);
    } else {
      setHasMore(true);
    }
  };

  const loadMoreResults = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(nextPage);
  };

  //GETRequestEndsHere

  //functionStartshere
  const onEventpress = () => {
    homeStack.navigate("eventDetail");
  };

  const onpressSearch = (
    setstate: (value: React.SetStateAction<string>) => void
  ) => {
    setsearchiconPress(!searchiconPress);
    setSearchQuery("");
  };

  const onNewspress = () => {
    homeStack.navigate("newdetilscreen");
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    filterData(text);
  };

  const filterData = (query: string) => {
    const filteredPosts = posts
      .slice(6, 11)
      .filter((item) =>
        item?.title.toLowerCase().includes(query.toLowerCase())
      );
    const filteredEvents = events
      .slice(6, 11)
      .filter((item) =>
        item?.title.toLowerCase().includes(query.toLowerCase())
      );

    const combinedResults = [
      ...filteredPosts.map((item) => ({ type: "post", data: item })),
      ...filteredEvents.map((item) => ({ type: "event", data: item })),
    ];

    setSearchResults(combinedResults);
  };

  const onPressback = () => {
    homeStack.navigate("home");
    console.log("===>pressed");
  };
  const onPress = (eventId: any) => {
    setSelectedEventId(eventId);
    homeStack.navigate("downloadEvent", {
      eventId: eventId,
      param: "home",
    });
  };

  const onPressPost = (eventId: any) => {
    setSelectedEventId(eventId);
    homeStack.navigate("PostScreen", {
      eventId: eventId,
      param: "home",
    });
  };

  const handleClearText = () => {
    setQuery("");
  };

  const handleTextChange = (text: string) => {
    setInputValue(text);
  };

  console.log("USer------------->>>>>", user?.dateOfBirth);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowEvents = events.filter(
    (event) => new Date(event?.date) >= tomorrow
  );
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

  if (loading) {
    return (
      <LottieView
        source={AchevLoader}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
          justifyContent: "center",
          alignSelf: "center",
          flex: 1,
        }}
      />
    );
  }
  console.log("results--------->>>>====", results);
  const onpressSearchicon = () => {
    setShowSearch(true);
  };
  const onpressBackicon = () => {
    setShowSearch(false);
    setQuery("");
  };

  const uniqueResults = results
    .filter((item) => item.subtype === "tribe_events" || "post" || "page")
    .reduce((acc, current) => {
      // Check if the title already exists in the accumulated array
      const x = acc.find(
        (item: { title: any }) => item.title === current.title
      );
      if (!x) {
        acc.push(current);
      }
      return acc;
    }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 10,
          display: showMap ? "flex" : "none",
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {showSearch ? (
            <View style={styles.container}>
              <TextInput
                onChangeText={handleSearchInputChange}
                value={query}
                placeholder="You are looking for"
                placeholderTextColor={theme?.colors?.Neutral_6}
                activeUnderlineColor={"transparent"}
                selectionColor={theme.colors?.primary}
                style={{
                  backgroundColor: "white",
                  // borderBottomColor: theme.colors?.chatBoxBacground,
                  // borderBottomWidth: 1,
                  borderWidth: 0,
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontWeight: "700",
                  borderTopColor: theme.colors?.primary,
                  borderRightColor: theme.colors?.primary,
                  borderLeftColor: theme.colors?.primary,
                  borderBottomColor: theme.colors?.primary,
                  borderBottomWidth: 2,
                  borderRightWidth: 2,
                  borderLeftWidth: 2,
                  borderTopWidth: 2,
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                  borderBottomLeftRadius: 50,
                  borderBottomRightRadius: 50,
                }}
                outlineStyle={{}}
                // label={label}
                textColor={theme?.colors?.primary}
                error={error ? true : false}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <InputBackArrow
                        color={theme.fonts.labelLarge.fontFamily}
                      />
                    )}
                    onPress={onpressBackicon}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={() => <CrossSvg />}
                    onPress={handleClearText}
                  />
                }
              />

              {loading && <Text>Loading...</Text>}
              {error && <Text style={styles.error}>{error}</Text>}
              {query && (
                <FlatList
                  data={uniqueResults}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  renderItem={({ item }) =>
                    item.subtype === "post" ? (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() =>
                          homeStack.navigate("PostScreen", {
                            eventId: item.id,
                          })
                        }
                      >
                        <Text style={styles.title}>{item.title}</Text>

                        <Text style={styles.author}>
                          subtype: {item.subtype}
                        </Text>
                      </TouchableOpacity>
                    ) : item.subtype === "tribe_events" ? (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() =>
                          homeStack.navigate("homeDownload", {
                            eventIdhome: item.id,
                            paramhome: "home",
                          })
                        }
                      >
                        <Text style={styles.title}>{item.title}</Text>

                        <Text style={styles.author}>
                          subtype: {item.subtype}
                        </Text>
                      </TouchableOpacity>
                    ) : item.subtype === "page" ? (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => homeStack.navigate("resources")}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {/* <View
                                style={{
                                  height: 80,
                                  width: 120,
                                  backgroundColor: "#776E64",
                                  borderRadius: 10,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={[
                                    styles.text,
                                    { fontFamily: theme.fonts.labelLarge.fontFamily },
                                  ]}
                                >
                                  {item.title}
                                </Text>
                              </View> */}
                          <Text style={styles.title}>{item.title}</Text>
                        </View>

                        <Text style={styles.author}>
                          subtype: {item.subtype}
                        </Text>
                      </TouchableOpacity>
                    ) : null
                  }
                />
              )}

              {hasMore && !loading && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={loadMoreResults}
                >
                  <Text style={styles.loadMoreText}>Load More Results</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 20,
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                      fontSize: 22,
                      fontWeight: "800",
                    }}
                  >
                    Achēv Feeds
                  </Text>
                </View>
                <TouchableOpacity onPress={onpressSearchicon}>
                  <SearchIcon />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {query !== "" ? null : (
            <View
              style={{
                marginTop: 30,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  paddingHorizontal: 20,
                  color: theme.colors.secondary,
                  fontSize: 18,
                  fontWeight: "800",
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                }}
              >
                EVENTS & WORKSHOP
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 20,
                  gap: 5,
                }}
              >
                <TouchableOpacity
                  hitSlop={{ right: 10, top: 10, bottom: 10 }}
                  onPress={onEventpress}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: "#333333",
                      fontSize: 16,
                      fontWeight: "500",
                      fontFamily: theme.fonts.labelLarge.fontFamily,
                    }}
                  >
                    more
                  </Text>
                  <MoreArrow />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {query !== "" ? (
            <View style={{ flex: 1 }}>
              {searchResults.some((item) => item.type === "event") && (
                <>
                  <Homeheader
                    prop={"eventsquery"}
                    onEventpress={onEventpress}
                    onSearchChange={handleSearchChange}
                    searchQuery={searchQuery}
                  />
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.data.id.toString()}
                    contentContainerStyle={{ gap: 20, margin: 20 }}
                    renderItem={({ item }) => (
                      <ChronoEventComp
                        title={item?.data.title}
                        image={item?.data.image}
                        Time={item?.data.date}
                        end_date={item.data.end_date}
                        venue={item?.data.venue}
                        onPress={() => onPress(item?.data.id)}
                      />
                    )}
                  />
                  {/* <FlatList
                      data={results}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.resultItem}
                          onPress={() =>
                            homeStack.navigate("PostScreen", {
                              eventId: item.id,
                            })
                          }
                        >
                          <Text style={styles.title}>{item.title}</Text>
                          <Text style={styles.type}>{item.type}</Text>
                          <Text style={styles.author}>
                            Author: {item.author_name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    /> */}
                </>
              )}
              {searchResults.some((item) => item.type === "post") && (
                <>
                  <Homeheader
                    prop={"postssquery"}
                    onNewspress={onNewspress}
                    searchQuery={searchQuery}
                  />
                  <FlatList
                    data={searchResults.filter((item) => item.type === "post")}
                    keyExtractor={(item) => item.data.id.toString()}
                    contentContainerStyle={{ gap: 20, margin: 20 }}
                    renderItem={({ item }) => (
                      <EventsComp
                        title={item.data.title}
                        image={item.data.image}
                        Time={item.data.date}
                        venue={item?.data?.venue}
                      />
                    )}
                  />
                </>
              )}
            </View>
          ) : (
            <>
              <View style={{ marginTop: 20 }}>
                <Carousel
                  ref={carouselRef}
                  data={tomorrowEvents.slice(0, 5)}
                  renderItem={({ item }) => (
                    <CarousalComp
                      Day={item.title}
                      image={item.image}
                      Time={item.date}
                      end_date={item.end_date}
                      id={item?.id}
                    />
                  )}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth * 0.7}
                />
              </View>

              <View>
                <FlatList
                  data={events.slice(6, 11)}
                  renderItem={({ item }) => (
                    <ChronoEventComp
                      title={item.title}
                      image={item.image}
                      Time={item.date}
                      end_date={item.end_date}
                      venue={item?.venue}
                      onPress={() => onPress(item.id)}
                    />
                  )}
                  contentContainerStyle={{
                    marginHorizontal: 30,
                    gap: 20,
                    marginTop: 20,
                    paddingBottom: 40,
                  }}
                />
              </View>

              <View style={{ marginTop: -20 }}>
                <Homeheader prop={"middle"} onNewspress={onNewspress} />
              </View>

              <View style={{ marginTop: 20 }}>
                <Carousel
                  ref={carouselRef}
                  data={posts.slice(0, 5)}
                  renderItem={({ item }) => (
                    <NewsCarousalComp
                      Day={item.title}
                      image={item.image}
                      Time={item.date}
                      onPress={() => onPressPost(item.id)}
                    />
                  )}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth * 0.7}
                />
              </View>

              <View style={{ flex: 1 }}>
                <FlatList
                  data={posts.slice(6, 11)}
                  renderItem={({ item }) => (
                    <EventsComp
                      title={item.title}
                      image={item.image}
                      Time={item.date}
                      venue={item?.venue}
                      onPress={() => onPressPost(item.id)}
                    />
                  )}
                  contentContainerStyle={{
                    marginHorizontal: 30,
                    gap: 20,
                    marginTop: 20,
                    paddingBottom: 40,
                  }}
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>
      <WebView
        style={styles.webView}
        javaScriptEnabled={true}
        containerStyle={{
          position: "absolute",
          bottom: 70,
          right: showMap ? 20 : 0,
          width: showMap ? 80 : "100%",
          height: showMap ? 80 : "85%",
          zIndex: 9999,
          backgroundColor: "transparent",
        }}
        originWhitelist={["*"]}
        source={{
          html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
       body, html {
       margin: 0;
       padding: 0;
      background-color: transparent !important;
    overflow: visible !important;
  }
  #tidio-chat-iframe {
    transform: scale(1) !important; // Reset scale to original size
    transform-origin: bottom right !important;
    position: fixed !important;
    bottom: 0 !important;
    right: 0 !important;
  }
</style>
        </head>
        <body>
          <script>
            (function() {
              window.addEventListener("message", function(event) {
                if (event.data === "toggleMap") {
                  window.ReactNativeWebView.postMessage("toggleMap");
                }
              });

              document.addEventListener("DOMContentLoaded", function() {
                var tidioScript = document.createElement("script");
                tidioScript.src = "https://code.tidio.co/vndgds0tz32ubhsgosc8ne6tj68xut3m.js";
                tidioScript.async = true;
                tidioScript.onload = function() {
                  tidioChatApi.on("open", function() {
                    window.ReactNativeWebView.postMessage("chatOpened");
                  });
                  tidioChatApi.on("close", function() {
                    window.ReactNativeWebView.postMessage("chatClosed");
                  });
                  
                };
                document.body.appendChild(tidioScript);
              });
            })();
          </script>
        </body>
      </html>
    `,
        }}
        onMessage={(event) => {
          if (event.nativeEvent.data === "chatOpened") {
            setShowMap(false);
          } else if (event.nativeEvent.data === "chatClosed") {
            setShowMap(true);
          }
        }}
      />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  webView: {
    backgroundColor: "transparent",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
  },
  resultItem: {
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  type: {
    color: "#555",
  },
  error: {
    color: "red",
  },
  author: {
    fontSize: 12,
    color: "#333",
  },
  loadMoreButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loadMoreText: {
    color: "white",
    fontWeight: "bold",
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
});
