import "./globals.css";
import Providers from "@/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Gelato",
  description:
    "Explore EIP-7702 gas sponsorship and account abstraction in this interactive playground",
  openGraph: {
    title: "Gelato",
    description:
      "Explore EIP-7702 gas sponsorship and account abstraction in this interactive playground",
    images: [
      "",
    ],
  },
  icons: {
    icon: "https://raas.staging.gelato.network/images/favicon.ico",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
