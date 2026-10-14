import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Home/Footer';
import Navbar from '@/components/Home/Navbar';
import Cookies from '@/components/cookies/Cookies';
import { pageMetadata, fetchSeo, SITE_URL } from '@/utils/siteMeta';
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from '@/utils/structuredData';

// Site-wide defaults and the home page's own metadata. Every other route
// overrides this from its own layout.
export async function generateMetadata() {
  const seo = await fetchSeo();
  const verify = cleanCode(seo.googleVerification);
  return {
    metadataBase: new URL(SITE_URL),
    ...(await pageMetadata('home', '/')),
    // Google Search Console's "HTML tag" method: the code from
    // <meta name="google-site-verification" content="...">.
    ...(verify ? { verification: { google: verify } } : {}),
  };
}

// Francois may paste the whole tag Search Console shows, or just the code.
const cleanCode = (value) => {
  const text = String(value || '').trim();
  const inTag = text.match(/content=["']([^"']+)["']/i);
  const code = (inTag ? inTag[1] : text).trim();
  return /^[A-Za-z0-9_-]{10,100}$/.test(code) ? code : '';
};

// WAIMF's Google Analytics property (never FILM6's G-TPWW56VQRM).
const WAIMF_GA_ID = 'G-46QCWE41XQ';

// Only a real GA4 measurement ID is ever written into a script.
const cleanGaId = (value) => {
  const id = String(value || '').trim().toUpperCase();
  return /^G-[A-Z0-9]{4,20}$/.test(id) ? id : '';
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({ children }) {
  // The panel's SEO tab wins; WAIMF's own property (sent by Francois on
  // 14 Oct) is the default so the tag is on every page without a panel step.
  const gaId = cleanGaId((await fetchSeo()).gaId) || WAIMF_GA_ID;
  return (
    <html lang='en'>
      <head>
        {/* WAIMF's own Google Analytics property, set in the panel (WAIMF site >
            SEO & Analytics). Never the FILM6 one: that would file waimf.org
            visits under film6.ai. Consent starts DENIED (visitors are in the
            EU) and is granted by the cookie banner's Accept, or straight away
            for a visitor who accepted before. */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' });
                  if (document.cookie.indexOf('mySiteCookieConsent=true') !== -1) {
                    gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });
                  }
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
        <link rel='shortcut icon' href='/favicon.ico' />
        {/* Who WAIMF is, on every page. */}
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
