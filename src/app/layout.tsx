import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Kafem",
  description: "Menüleriniz ve Teknoloji bir arada",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};



import AppLayoutClient from "./AppLayoutClient";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try{
                var t = localStorage.getItem('theme');
                var l = localStorage.getItem('lang');
                var d = document.documentElement;
                if(t === 'dark') { d.classList.add('dark'); d.style.colorScheme = 'dark'; }
                else { d.classList.remove('dark'); d.style.colorScheme = 'light'; }
                if(l === 'tr') { d.setAttribute('lang', 'tr'); } else { d.setAttribute('lang', 'en'); }
              }catch(e){}
            })();
          `}}
        />
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}
