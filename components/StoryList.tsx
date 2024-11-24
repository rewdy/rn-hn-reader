import { sharedStyles } from "@/constants/sharedStyles";
import type React from "react";
import { FlatList, RefreshControl, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StoryItem } from "./StoryItem";
import { View, Text } from "./Themed";
import Colors from "@/constants/Colors";

export type StoryListProps = {
  header?: React.ReactNode;
  storyIds: string[];
  isLoading?: boolean;
  onRefresh: () => void;
};

export const StoryList: React.FC<StoryListProps> = ({
  header,
  storyIds,
  onRefresh,
  isLoading = false,
}) => {
  const colorScheme = useColorScheme();

  const renderItem = ({ item }: { item: string }) => <StoryItem id={item} />;
  return (
    <GestureHandlerRootView>
      <View style={sharedStyles.container}>
        {header && (
          <>
            {header}
            <View
              style={sharedStyles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
          </>
        )}
        {isLoading && <Text>😊 Loading...</Text>}
        {storyIds.length > 0 ? (
          <FlatList
            data={storyIds}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            refreshing={isLoading}
            ItemSeparatorComponent={() => (
              <View
                style={sharedStyles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: Colors[colorScheme ?? "light"].gray }}>
              No stories found 😐
            </Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};
