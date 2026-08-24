import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { hotelConfig } from "@/lib/hotel-config";

const title = "Rajput Palace | Premium Stay in Ayodhya";
const description =
  "Rajput Palace offers a premium and comfortable stay in Ayodhya, near Sabji Mandi, Sapt Sagar Colony — ideal for pilgrims, families, couples and travellers exploring Ayodhya.";

export const metadata: Metadata = {
  metadataBase: new URL(hotelConfig.siteUrl),
  title: {
    default: title,
    template: "%s | Rajput Palace, Ayodhya",
  },
  description,
  keywords: [
    "Rajput Palace Ayodhya",
    "hotel in Ayodhya",
    "Ayodhya stay",
    "Sapt Sagar Colony hotel",
    "hotel near Ram Janmabhoomi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Rajput Palace",
    locale: "en_IN",
    url: hotelConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: hotelConfig.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Near Sabji Mandi, Sapt Sagar Colony",
    addressLocality: hotelConfig.city,
    addressRegion: hotelConfig.state,
    addressCountry: "IN",
  },
  ...(hotelConfig.phone ? { telephone: hotelConfig.phone } : {}),
  url: hotelConfig.siteUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col pb-16 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileCta />
      </body>
    </html>
  );
}
