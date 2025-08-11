import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try{
                var t = localStorage.getItem('theme');
                var d = document.documentElement;
                if(t === 'dark') { d.classList.add('dark'); d.style.colorScheme = 'dark'; }
                else { d.classList.remove('dark'); d.style.colorScheme = 'light'; }
              }catch(e){}
            })();
          `}}
        />
        {children}
      </body>
    </html>
  );
}
