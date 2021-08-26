import Head from "next/head";
import config from "../next-config";

export default function SEO({
  keywords,
  description = "Official dashboard for Syndicate Protocol",
  title,
  customSecondaryTitle = null,
  image = "/images/social/logoBanner.png"
}) {
  const siteTitle = config.title;
  const imageAbsolutePath = process.env.NEXT_BASE_URL + image

  return (
    <Head>
      <title>{`${title} | ${customSecondaryTitle ? customSecondaryTitle : siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageAbsolutePath} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content={config.social.twitter} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image0" content={imageAbsolutePath} />
      <link rel="manifest" href="/manifest.json"></link>
    </Head>
  );
}
