import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type AppSettings = {
  openNativeSafari: boolean;
};

const defaultSettings: AppSettings = {
  openNativeSafari: false,
};

const AppSettingsContext = createContext<{
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const useAppSettings = () => useContext(AppSettingsContext);

/**
 * App settings provider. Syncs to async storage so, if you like your settings,
 * you can keep them!
 */
export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings);
  const { setItem, getItem } = useAsyncStorage("app-settings");

  /**
   * Set settings wrapper that also updates the async storage
   */
  const setSettings = (newSettings: AppSettings) => {
    setSettingsState(newSettings);
    setItem(JSON.stringify(newSettings));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const loadSettings = async () => {
      const storedSettings = await getItem();
      if (storedSettings) {
        setSettingsState(JSON.parse(storedSettings));
      }
    };

    loadSettings();
  }, []);

  return (
    <AppSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
