import { SearchBox } from "@atoms";
import { MoreArrow } from "@utils";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
type prop = {
  prop: string;
  onEventpress?: () => void;
  onSearchChange?: (text: string) => void;
  onNewspress?: () => void;
  searchQuery?: string;
};
const Homeheader = ({
  prop,
  onEventpress,
  onSearchChange,
  onNewspress,
  searchQuery,
}: prop) => {
  const theme = useTheme();
  return (
    <View>
      {prop == "header" ? (
        <>
          <View style={{ paddingHorizontal: 20 }}>
            <SearchBox multiline={false} onChangeText={onSearchChange} />
          </View>
          {searchQuery !== "" ? null : (
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
                  fontSize: 22,
                  fontWeight: "800",
                  fontFamily: theme.fonts.labelLarge.fontFamily,
                }}
              >
                EVENTS & WORKSHOP
              </Text>
              <View
                style={{ flexDirection: "row", paddingHorizontal: 20, gap: 5 }}
              >
                <Text style={{ color: "#333333", fontWeight: "500" }}>
                  more
                </Text>
                <TouchableOpacity
                  hitSlop={{ right: 10, top: 10, bottom: 10 }}
                  onPress={onEventpress}
                >
                  <MoreArrow />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      ) : prop == "newsdetail" ? (
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
              fontSize: 22,
              fontWeight: "800",
              fontFamily: theme.fonts.labelLarge.fontFamily,
            }}
          >
            News & Articles
          </Text>
          <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 5 }}>
            <Text style={{}}>more</Text>
            <TouchableOpacity
              hitSlop={{ right: 10, top: 10, bottom: 10 }}
              onPress={onNewspress}
            >
              <MoreArrow />
            </TouchableOpacity>
          </View>
        </View>
      ) : prop == "middle" ? (
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
              fontSize: 22,
              fontWeight: "800",
              fontFamily: theme.fonts.labelLarge.fontFamily,
            }}
          >
            News & Articles
          </Text>
          <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 5 }}>
            <TouchableOpacity
              hitSlop={{ right: 10, top: 10, bottom: 10 }}
              onPress={onNewspress}
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
      ) : prop == "eventsquery" ? (
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
              fontSize: 16,
              fontWeight: "800",
              fontFamily: theme.fonts.labelLarge.fontFamily,
            }}
          >
            EVENTS & WORKSHOP
          </Text>
          <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 5 }}>
            <TouchableOpacity
              hitSlop={{ right: 10, top: 10, bottom: 10 }}
              onPress={onEventpress}
            >
              <Text style={{ color: "rgba(224, 79, 57, 1)" }}>View all</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        prop == "postssquery" && (
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
                fontSize: 16,
                fontWeight: "800",
                fontFamily: theme.fonts.labelLarge.fontFamily,
              }}
            >
              News & Articles
            </Text>
            <View
              style={{ flexDirection: "row", paddingHorizontal: 20, gap: 5 }}
            >
              <TouchableOpacity
                hitSlop={{ right: 10, top: 10, bottom: 10 }}
                onPress={onNewspress}
              >
                <Text style={{ color: "rgba(224, 79, 57, 1)" }}>View all</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      )}
    </View>
  );
};

export default Homeheader;

const styles = StyleSheet.create({});
