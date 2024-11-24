import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Switch } from "react-native";

import { useAppSettings } from "@/components/AppSettingsProvider";
import { Text, View } from "@/components/Themed";

export default function Settings() {
  const { settings, setSettings } = useAppSettings();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.settingRow}>
        <View>
          <Text>Use in-app browser:</Text>
        </View>
        <View>
          <Switch
            value={!settings.openNativeSafari}
            onValueChange={() => {
              setSettings({
                ...setSettings,
                openNativeSafari: !settings.openNativeSafari,
              });
            }}
          />
        </View>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: "100%",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
