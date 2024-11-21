import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  Backarrow,
  Locationmarker,
  MoreArrow,
  SearchIcon,
  Shareicon,
} from "@utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Marker } from "react-native-svg";
import { useTheme } from "react-native-paper";
import { NewsSearchBox, SearchBox } from "./atoms/Input";

type Homedetailstype = {
  onPressback: () => void;
  prop: string;
  dimColor?: boolean;
  backgroundcolor: string;
  onpressSearch: () => void;
  searchiconPress: boolean;
  onSearchChange: (text: string) => void;
  onEventpress?: () => void;
  searchQuery?: string;
  shareArticle?: () => void;
};

const HomedetailsHeader = ({
  onPressback,
  prop,
  dimColor,
  onpressSearch,
  searchiconPress,
  onSearchChange,
  onEventpress,
  searchQuery,
  shareArticle,
}: Homedetailstype) => {
  const theme = useTheme();
  return (
    <View style={{}}>
      {prop == "EventDeatils" ? (
        searchiconPress ? (
          <View style={{ paddingHorizontal: 20 }}>
            <NewsSearchBox
              multiline={false}
              onChangeText={onSearchChange}
              onpressSearch={onpressSearch}
              EventDeatils={"EventDeatils"}
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 10,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                shadowColor: "rgba(0, 0, 0, 0.25)",
                borderRadius: 50,
                height: 30,
                width: 30,

                shadowOpacity: 1,
                shadowRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
              }}
              onPress={onPressback}
            >
              <Backarrow />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontSize: 22,
                  fontWeight: "800",
                }}
              >
                EVENTS & WORKSHOP
              </Text>
            </View>
            <TouchableOpacity onPress={onpressSearch}>
              <SearchIcon />
            </TouchableOpacity>
          </View>
        )
      ) : prop == "newsdetails" ? (
        searchiconPress ? (
          <View style={{ paddingHorizontal: 20 }}>
            <NewsSearchBox
              multiline={false}
              onChangeText={onSearchChange}
              onpressSearch={onpressSearch}
              newsdetails={"newsdetails"}
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 10,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                shadowColor: "rgba(0, 0, 0, 0.25)",
                borderRadius: 50,
                height: 30,
                width: 30,

                shadowOpacity: 1,
                shadowRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
              }}
              onPress={onPressback}
            >
              <Backarrow />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                  fontSize: 22,
                  fontWeight: "800",
                }}
              >
                NEWS & ARTICLES
              </Text>
            </View>
            <TouchableOpacity onPress={onpressSearch}>
              <SearchIcon />
            </TouchableOpacity>
          </View>
        )
      ) : prop == "homesearch" ? (
        searchiconPress ? (
          <View style={{ paddingHorizontal: 20 }}>
            <NewsSearchBox
              multiline={false}
              onChangeText={onSearchChange}
              onpressSearch={onpressSearch}
              homesearch={"homesearch"}
            />
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
              <TouchableOpacity onPress={onpressSearch}>
                <SearchIcon />
              </TouchableOpacity>
            </View>
          </View>
        )
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",

            alignItems: "center",
            paddingHorizontal: 10,
            bottom: 190,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 30,
              width: 30,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={onPressback}
          >
            <Backarrow />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "rgba(224, 79, 57, 1)",
              shadowColor: "rgba(0, 0, 0, 0.25)",
              borderRadius: 50,
              height: 30,
              width: 30,

              shadowOpacity: 1,
              shadowRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
            onPress={shareArticle}
          >
            <Shareicon />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomedetailsHeader;

const styles = StyleSheet.create({});
