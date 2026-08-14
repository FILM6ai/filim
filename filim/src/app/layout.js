import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Home/Footer';
import Navbar from '@/components/Home/Navbar';
import Cookies from '@/components/cookies/Cookies';
import { pageMetadata, SITE_URL } from '@/utils/siteMeta';
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from '@/utils/structuredData';

// Site-wide defaults and the home page's own metadata. Every other route
// overrides this from its own layout.
export async function generateMetadata() {
  return {
    metadataBase: new URL(SITE_URL),
    ...(await pageMetadata('home', '/')),
  };
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-TPWW56VQRM'
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TPWW56VQRM', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <link rel='shortcut icon' href='/favicon.ico' />
        {/* Who FILM6 is, on every page. */}
        <JsonLd schemas={[organizationSchema(), websiteSchema()]} />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer margin='mt-0' />
        <Cookies />
      </body>
    </html>
  );
}
