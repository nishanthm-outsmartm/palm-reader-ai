import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from 'next/script'
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Palm Reader AI",
  description: "Pinata DEV Challenge - Palm Reader AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js"  />
      <Script
        async
        data-collect="outbound,emails,downloads"
        data-extensions="pdf,csv,docx,xlsx,zip"
        data-use-title="true"
        data-full-urls="false"
        src="https://scripts.simpleanalyticscdn.com/auto-events.js"
      />
    </html>
  );
}
