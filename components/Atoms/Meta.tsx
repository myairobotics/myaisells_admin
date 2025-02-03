import Head from "next/head";
import React from "react";

interface MetaProps {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  favicon?: string;
}

const Meta: React.FC<MetaProps> = ({
  title,
  description = "MYai is an advanced AI-powered platform designed to simplify complex tasks, enhance productivity, and provide intelligent solutions.",
  keywords = [],
  author = "VinJex",
  image = "assets/logo.png",
  favicon = "favicon.ico",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords.join(", ")} />
      <meta name='author' content={author} />

      {/* Open Graph meta tags for social media sharing */}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta
        property='og:url'
        content={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}
      />
      <meta property='og:type' content='website' />

      {/* Twitter meta tags for social media sharing on Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Favicon */}
      <link rel='icon' type='image/x-icon' href={favicon} />

      {/* Apple Touch Icon for iOS devices */}
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-touch-icon.png'
      />

      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon-16x16.png'
      />
      <link rel='manifest' href='/site.webmanifest'></link>
    </Head>
  );
};

export default Meta;
