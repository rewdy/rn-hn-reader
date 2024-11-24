import { StoryList } from "@/components/StoryList";
import { Text, View } from "@/components/Themed";
import { HN_API_BASE } from "@/constants/api";
import { sharedStyles } from "@/constants/sharedStyles";
import { fetcher } from "@/helpers/fetcher";
import useSWR from "swr";

export default function TabOneScreen() {
  const { data, isValidating, error, mutate } = useSWR<string[]>(
    `${HN_API_BASE}/topstories.json`,
    fetcher,
  );

  const onRefresh = () => {
    mutate();
  };

  return error ? (
    <View>
      <Text>Error loading data: {error}</Text>
    </View>
  ) : (
    <StoryList
      header={<Text style={sharedStyles.title}>🗞️ Top Stories</Text>}
      storyIds={data || []}
      onRefresh={onRefresh}
      isLoading={isValidating}
    />
  );
}
