import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const barlow = localFont({
  src: [
    { path: "../fonts/barlow-semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/barlow-extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-barlow",
});

const atkinson = localFont({
  src: [
    { path: "../fonts/atkinson-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/atkinson-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/atkinson-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/atkinson-bolditalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-atkinson",
});

export const metadata: Metadata = {
  title: "Backyard Ultra Tracker",
  description: "Live tracking for a backyard ultra race.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${atkinson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
