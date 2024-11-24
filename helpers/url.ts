type UrlParts = {
  protocol: string;
  domain: string;
  path: string;
};

/**
 * Function that takes a full URL and returns just the domain without protocol or path
 */
export function getUrlParts(url?: string): UrlParts | undefined {
  if (!url) {
    return undefined;
  }
  const urlObj = new URL(url);
  return {
    protocol: urlObj.protocol,
    domain: urlObj.hostname,
    path: urlObj.pathname,
  };
}
