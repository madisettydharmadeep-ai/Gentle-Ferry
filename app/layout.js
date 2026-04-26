import './globals.css';
import { WeatherProvider } from './contexts/WeatherContext';

const APP_URL = 'https://gentleferry.com';

export const metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: 'Gentle Ferry — Your private daily journal',
    template: '%s | Gentle Ferry',
  },
  description:
    'Gentle Ferry is a calm, private journaling app. Write about your day, attach photos saved to your own Google Drive, highlight memories, and organise entries into collections.',
  keywords: [
    'journal app', 'daily journal', 'private journal', 'digital diary',
    'memory keeper', 'photo journal', 'google drive journal',
    'journaling app', 'personal journal', 'mood tracker journal',
    'Gentle Ferry', 'online journal', 'minimalist journal app',
  ],
  authors: [{ name: 'Gentle Ferry' }],
  creator: 'Gentle Ferry',
  publisher: 'Gentle Ferry',
  category: 'Lifestyle',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Gentle Ferry',
    title: 'Gentle Ferry — Your private daily journal',
    description:
      'A calm, private space to write about your day, attach photos, highlight memories and organise them into collections. Your photos live in your own Google Drive.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gentle Ferry — Your private daily journal',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'Gentle Ferry — Your private daily journal',
    description:
      'A calm, private space to write your days, attach photos to Google Drive, and keep memories forever.',
    images: ['/og-image.png'],
    creator: '@gentleferry',
  },

  // Canonical + robots
  alternates: { canonical: APP_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // PWA / icons
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',

  // Google Search Console verification
  verification: {
    google: '2smjZ7m53bObxRYwPrEUxy52mOJ62HkcVBFt8FS3usM',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Gentle Ferry',
              url: APP_URL,
              description:
                'A calm, private journaling app. Write about your day, attach photos to your Google Drive, highlight memories, and organise entries into collections.',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Daily journal entries',
                'Photo attachment via Google Drive',
                'Mood tracking',
                'Memory collections',
                'Text highlighting',
                'People and places tagging',
              ],
            }),
          }}
        />
      </head>
      <body>
        <WeatherProvider>
          {children}
        </WeatherProvider>
      </body>
    </html>
  );
}
