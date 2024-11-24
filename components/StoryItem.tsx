import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { HN_API_BASE } from "@/constants/api";
import { fetcher } from "@/helpers/fetcher";
import { timeSince, unixTimestampToDate } from "@/helpers/time";
import { getUrlParts } from "@/helpers/url";
import type { HackerNewsItem } from "@/models/hacker-news.api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type React from "react";
import { useRef } from "react";
import { Button, Pressable, StyleSheet, useColorScheme } from "react-native";
import Swipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import useSWR from "swr";
import { useAppData } from "./AppDataProvider";
import { ExternalLinkOrNot } from "./ExternalLinkOrNot";

// Styling vars
const iconSize = 14;
const rowHPad = 10;

export type StoryItemProps = {
  id: string;
};

export const StoryItem: React.FC<StoryItemProps> = ({ id }) => {
  const colorScheme = useColorScheme();
  const { data, isLoading, error } = useSWR<HackerNewsItem>(
    `${HN_API_BASE}/item/${id}.json`,
    fetcher,
  );
  const swipeableRef = useRef<SwipeableMethods>(null);
  const { isFavorite, toggleFavorite } = useAppData();

  // Render vars
  const timeString = data?.time
    ? timeSince(unixTimestampToDate(data?.time))
    : "?";
  const urlParts = getUrlParts(data?.url);
  const UrlParts = urlParts
    ? () => (
        <Text style={styles.url} numberOfLines={1} ellipsizeMode="tail">
          <Text style={{ color: Colors[colorScheme ?? "light"].gray }}>
            {urlParts.domain}
          </Text>
          <Text style={{ color: Colors[colorScheme ?? "light"].grayer }}>
            {urlParts.path}
          </Text>
        </Text>
      )
    : () => null;

  const handleFavoriteClick = () => {
    toggleFavorite(id);
    swipeableRef.current?.close();
  };

  // Swipe right action
  const RightAction = (
    progress: SharedValue<number>,
    drag: SharedValue<number>,
    methods: SwipeableMethods,
  ) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 62 }],
    }));

    return (
      <Reanimated.View style={styleAnimation}>
        <Pressable style={styles.swipeAction} onPress={handleFavoriteClick}>
          <FontAwesome
            name={isFavorite(id) ? "star" : "star-o"}
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
          <Text>{isFavorite(id) ? "Remove" : "Favorite"}</Text>
        </Pressable>
      </Reanimated.View>
    );
  };
  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={60}
      renderRightActions={RightAction}
    >
      {isLoading && <Text>Loading...</Text>}
      {data && (
        <View>
          <ExternalLinkOrNot href={data.url}>
            <Text style={styles.title}>{data.title}</Text>
          </ExternalLinkOrNot>
          <UrlParts />
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <FontAwesome
                name="arrow-up"
                size={iconSize}
                style={{
                  ...styles.rowIcon,
                  color: Colors[colorScheme ?? "light"].grayer,
                }}
              />
              <Text>{data.score}</Text>
            </View>
            <View style={styles.rowItem}>
              <FontAwesome
                name="clock-o"
                size={iconSize}
                style={{
                  ...styles.rowIcon,
                  color: Colors[colorScheme ?? "light"].grayer,
                }}
              />
              <Text>{timeString}</Text>
            </View>
          </View>
        </View>
      )}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    paddingVertical: 5,
  },
  url: {
    fontSize: 14,
    paddingVertical: 5,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: rowHPad * -1,
    marginVertical: 3,
    overflow: "hidden",
    width: "100%",
  },
  rowItem: {
    flexDirection: "row",
    marginHorizontal: rowHPad,
  },
  rowIcon: {
    paddingRight: rowHPad / 2,
  },
  swipeAction: {
    flex: 1,
    padding: 5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#FFD700", // Golden yellow
  },
});
