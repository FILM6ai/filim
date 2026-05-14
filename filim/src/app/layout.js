import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Home/Footer';
import Navbar from '@/components/Home/Navbar';
import Cookies from '@/components/cookies/Cookies';

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
