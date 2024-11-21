import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import Collapsible from "react-native-collapsible";
import { ExpandArrow } from "@utils";

interface Notificationstype {
  notification: {
    id: string;
    title: string;
    body: string;
    metaData: string;
    createAt: string;
    user: {
      userProfile: {
        name: string;
      };
    };
  };
  onDelete: (id: string) => void;
}

const NotifiComp = (props: Notificationstype) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const theme = useTheme();
  const [pushEnabled, setPushEnabled] = useState(false);
  const { body, id, metaData, title, createAt, user } = props.notification;

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20; // Only start responding to horizontal swipes
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        // If swiped more than 100 pixels to the left, trigger delete
        if (gestureState.dx < -100) {
          // Animate the item off-screen before deleting
          Animated.timing(pan, {
            toValue: { x: -500, y: 0 }, // Swipe it off the screen to the left
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            props.onDelete(id);
          });
        } else {
          // Reset position if not swiped far enough
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }],
        backgroundColor: "white",
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowOffset: { height: 1, width: 0 },

        borderColor: "rgba(204, 204, 204, 1)",
      }}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        onPress={toggleCollapse}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 30,
        }}
      >
        <View style={{ marginLeft: 10, flexShrink: 1 }}>
          <Text
            style={{
              fontWeight: "400",
              fontSize: 16,
              color: "rgba(120, 112, 105, 1)",
              fontFamily: theme.fonts.labelLarge.fontFamily,
            }}
          >
            {title}
          </Text>
        </View>
        <View>
          <ExpandArrow />
        </View>
      </TouchableOpacity>

      <Collapsible
        collapsed={isCollapsed}
        style={{
          backgroundColor: "white",
        }}
      >
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontSize: 13,
              color: "rgba(120, 112, 105, 1)",
              marginLeft: 10,
            }}
          >
            {body}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              marginLeft: 10,
            }}
          >
            <Text style={{ color: "gray", fontSize: 12 }}>
              {new Date(createAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </Collapsible>
    </Animated.View>
  );
};

export default NotifiComp;
