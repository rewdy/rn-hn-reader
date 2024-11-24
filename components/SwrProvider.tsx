import AsyncStorage from "@react-native-async-storage/async-storage";
import type React from "react";
import { SWRConfig } from "swr";

//
// Helpers
//
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

// A custom cache provider using AsyncStorage
// const asyncStorageCache = {
//   get: async (key: string) => {
//     const value = await AsyncStorage.getItem(key);
//     return value ? JSON.parse(value) : undefined;
//   },
//   set: async (key: string, value: unknown) => {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   },
//   delete: async (key: string) => {
//     await AsyncStorage.removeItem(key);
//   },
//   keys: async () => {
//     const value = await AsyncStorage.getAllKeys();
//     return value[Symbol.iterator]();
//   },
// };

/**
 * SWR Provider. Hooks up the swr library to the app cache sync
 */
export const SwrProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SWRConfig value={{ fetcher, provider: () => new Map() }}>
      {children}
    </SWRConfig>
  );
};

export default SwrProvider;
