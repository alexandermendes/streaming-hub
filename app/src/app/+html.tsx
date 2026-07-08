import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

/**
 * Web-only root HTML wrapper (runs in Node during static rendering only).
 *
 * On wide screens (desktop / tablet) we frame the app in a centred,
 * phone-width "device" viewport so the concept reads as an app rather than a
 * full-bleed website. Real phone browsers keep the native full-screen layout,
 * so the media query leaves anything under 768px untouched.
 *
 * The <style> sits after <ScrollViewStyleReset /> (which emits the
 * `#root,body,html{height:100%}` reset) so it wins on source order.
 */
/**
 * Social share / Open Graph metadata. `og:image` must be an absolute URL for
 * unfurlers (Slack, iMessage, X, etc.), so we point at the deployed Pages
 * origin. The image lives in `public/og.png`, which the web export copies to
 * the `dist/` root — served at `${SITE_URL}og.png`.
 */
const SITE_URL = "https://immediate-media.github.io/streaming-hub-demo/";
const OG_IMAGE = `${SITE_URL}og.png`;
const OG_TITLE = "Binge Buddy";
const OG_DESCRIPTION =
  "Every subscription, one buddy. Track streaming deals, expiries, spend and your watchlist — all in one place.";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content={OG_DESCRIPTION} />
        <meta name="theme-color" content="#060a06" />

        {/* Open Graph — link unfurls (Slack, iMessage, Facebook, LinkedIn…) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={OG_TITLE} />
        <meta property="og:title" content={OG_TITLE} />
        <meta property="og:description" content={OG_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1672" />
        <meta property="og:image:height" content="941" />
        <meta
          property="og:image:alt"
          content="Binge Buddy — the streaming subscription manager"
        />

        {/* Twitter/X card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={OG_TITLE} />
        <meta name="twitter:description" content={OG_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: appViewportFrame }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const appViewportFrame = `
@media (min-width: 768px) {
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(120% 120% at 50% 0%, #12180f 0%, #060806 60%, #030403 100%);
  }

  #root {
    flex: 0 0 auto;
    width: 400px;
    max-width: 100%;
    height: min(872px, calc(100dvh - 104px));
    max-height: 850px;
    border-radius: 46px;
    overflow: hidden;
    background: #060a06;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 30px 60px -20px rgba(0, 0, 0, 0.75);
    padding: 20px 0 15px 0;
    position: relative;
  }
}
`;
