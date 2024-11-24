import { Text } from "@/components/Themed";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type React from "react";
import { Platform } from "react-native";
import { useAppSettings } from "./AppSettingsProvider";

export type ExternalLinkOrNotProps = Omit<
  React.ComponentProps<typeof Link>,
  "href"
> & {
  href?: string;
};

/**
 * Takes a href prop and renders as an external link if it exists, otherwise
 * passes through the children in a Text component.
 *
 * @returns
 */
export const ExternalLinkOrNot: React.FC<ExternalLinkOrNotProps> = (props) => {
  const { settings } = useAppSettings();

  return props.href ? (
    <Link
      target="_blank"
      {...props}
      // @ts-expect-error: External URLs are not typed.
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== "web" && !settings.openNativeSafari) {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  ) : (
    <Text>{props.children}</Text>
  );
};
