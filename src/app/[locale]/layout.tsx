import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Inter, Raleway, Rubik } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Env } from '@/libs/Env';
import { routing } from '@/libs/I18nRouting';

import Provider from '@/libs/providers';
import '@/styles/global.css';

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'MYaiSells - Human-AI',
  description:
    'MYai is an advanced AI-powered platform designed to simplify complex tasks, enhance productivity, and provide intelligent solutions.',
  keywords: ['AI', 'Productivity', 'Automation', 'MYai'],
  authors: [{ name: 'VinJex' }],
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'MYaiSells - Human-AI',
    description:
      'MYai is an advanced AI-powered platform designed to simplify complex tasks, enhance productivity, and provide intelligent solutions.',
    url: Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    type: 'website',
    images: [{ url: '/assets/logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MYaiSells - Human-AI',
    description:
      'MYai is an advanced AI-powered platform designed to simplify complex tasks, enhance productivity, and provide intelligent solutions.',
    images: ['/assets/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${rubik.variable} ${raleway.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale}>
          <Provider>
            {props.children}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
