import { useAppData } from "@/components/AppDataProvider";
import { StoryList } from "@/components/StoryList";

export default function TabTwoScreen() {
  const { favorites } = useAppData();

  return <StoryList storyIds={favorites} onRefresh={() => null} />;
}

// const styles = StyleSheet.create({});
