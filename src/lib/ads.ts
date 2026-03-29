export const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-3689941361378688";
export const ADSENSE_DEFAULT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || "";

export function shouldRenderAds(contentWordCount: number, hasContent = true) {
  return (
    ADSENSE_ENABLED &&
    hasContent &&
    contentWordCount >= 300 &&
    Boolean(ADSENSE_CLIENT_ID)
  );
}
