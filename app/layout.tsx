import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";
import { UserProvider } from "@/context/usercontext";
import { FarcasterProvider } from "@/context/farcastercontext";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MemeForge",
  description: "Can your meme be the greatest!",
  openGraph: {
    title: "Can you create the most viral meme ever?",
    description: "Can your meme be the greatest!",
    images: [
      "https://res.cloudinary.com/dcw1m1rak/image/upload/v1760784780/titleimg_bma0sw.png",
    ],
  },
  other: {
    "fc:frame":
      '{"version":"next","imageUrl": "https://res.cloudinary.com/dcw1m1rak/image/upload/v1760784780/titleimg_bma0sw.png", "button":{"title":"Forge your own meme","action":{"type":"launch_miniapp","url": "https://memeforge-1.vercel.app/","name":"MemeForge","splashImageUrl": "https://res.cloudinary.com/dcw1m1rak/image/upload/v1760785032/MF_birpkf.png","splashBackgroundColor":"#000"}}}',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <FarcasterProvider>
          <UserProvider>
            {children}
            <Toaster />
            <Analytics />
          </UserProvider>
        </FarcasterProvider>
      </body>
    </html>
  );
}
