import type { Metadata } from 'next';
import Script from 'next/script';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AgeGate from '@/components/AgeGate';
import CookieConsent from '@/components/CookieConsent';
import './globals.css';

export const metadata: Metadata = {
  title: 'Modern Bond — Unlock Your Best Sex Life',
  description: 'A next-generation platform for modern intimacy, connection, and personal growth.',
  icons: { icon: '/images/MB_favicon-pink.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700;1,900&family=Barlow:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.7.2/default/snipcart.css" />
      </head>
      <body>
        <AgeGate />
        <Nav />
        {children}
        <Footer />
        <CookieConsent />

        <div hidden id="snipcart" data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}></div>
        <Script src="https://cdn.snipcart.com/themes/v3.7.2/default/snipcart.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
