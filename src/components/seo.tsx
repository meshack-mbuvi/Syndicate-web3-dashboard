import Head from 'next/head';

const config = {
  title: 'Syndicate',
  author: {
    name: 'Syndicate Inc.',
    summary: "Syndicate Protocol's web3 dashboard"
  },
  description: 'Invest in anything—together, and on-chain with Syndicate.',
  social: {
    twitter: 'SyndicateDAO'
  }
};

interface IProps {
  title: string;
  keywords: string[];
  description?: string;
  customSecondaryTitle?: string;
  image?: string;
}

const SEO: React.FC<IProps> = ({
  keywords,
  description = 'Invest in anything—together, and on-chain with Syndicate',
  title,
  customSecondaryTitle = null,
  image = '/images/social/logoBanner.png'
}) => {
  const siteTitle = config.title;
  const imageAbsolutePath = process.env.NEXT_BASE_URL + image;

  return (
    <Head>
      <title>{`${title} | ${
        customSecondaryTitle ? customSecondaryTitle : siteTitle
      }`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(',')} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageAbsolutePath} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:creator" content={config.social.twitter} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image0" content={imageAbsolutePath} />

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Syndicate" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#000"></meta>

      <link rel="manifest" href="/manifest.json" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/pwa-icons/apple-icon-180x180.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="192x192"
        href="/images/pwa-icons/apple-icon-192x192.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="512x512"
        href="/images/pwa-icons/apple-icon-512x512.png"
      />

      <link
        rel="apple-touch-startup-image"
        media="(orientation: portrait)"
        href="/images/pwa-icons/apple-splash-1125-2436.png"
      />
      <link
        rel="apple-touch-startup-image"
        media="(orientation: landscape)"
        href="/images/pwa-icons/apple-splash-2436-1125.png"
      />
    </Head>
  );
};

export default SEO;
