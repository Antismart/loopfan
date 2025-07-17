import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "@/components/providers/Web3Provider";
import Header from "@/components/Header";
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
  title: "LoopFan - Decentralized Creator Wallet",
  description: "The first truly decentralized creator wallet app. Keep 100% of your earnings with zero middlemen.",
  keywords: "creator economy, web3, blockchain, Base, tips, NFT memberships, decentralized",
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
        <Web3Provider>
          <Header />
          <main>{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
