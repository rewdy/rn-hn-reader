import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type AppDataContextProps = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const initialAppData: AppDataContextProps = {
  favorites: [],
  toggleFavorite: () => undefined,
  isFavorite: () => false,
};

const AppDataContext = createContext<AppDataContextProps>(initialAppData);

/**
 * Context provider for app data. This includes favorites and nothing else for now.
 */
export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const { setItem, getItem } = useAsyncStorage("favoritesData");
  const [favorites, setFavorites] = useState<string[]>([]);

  //
  // Helpers to interact with async storage
  //

  /**
   * Fetches all favorites data from async storage and returns it as an array.
   */
  const getFavoritesFromStorage = async () => {
    const favoritesData = await getItem();
    return favoritesData ? JSON.parse(favoritesData) : [];
  };

  /**
   * Saves the favorites data to async storage.
   */
  const saveFavoritesToStorage = async (favoritesData: string[]) => {
    await setItem(JSON.stringify(favoritesData));
  };

  //
  // Favorite state helpers
  //

  /**
   * Adds or removes a favorite from the list of favorites.
   */
  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      // remove
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    const newFavoritesArray = Array.from(newFavorites);
    setFavorites(newFavoritesArray);
    saveFavoritesToStorage(newFavoritesArray);
  };

  /**
   * Little utility function to return if a given item is a favorite.
   */
  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: On mount load favorites
  useEffect(() => {
    // On mount, load the data into state
    const getFavoritesData = async () => {
      const favoritesData = await getFavoritesFromStorage();
      setFavorites(favoritesData);
    };

    getFavoritesData();
  }, []);

  return (
    <AppDataContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = React.useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};
