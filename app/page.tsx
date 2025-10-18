"use client";

import { TrendingCastFeed } from "@/components/trending-cast-feed";
import { Leaderboard } from "@/components/leaderboard";
// import sdk from "@farcaster/miniapp-sdk";
import { useEffect } from "react";
import { useUser } from "@/context/usercontext";
import { getUser } from "@/lib/getuser";
import Head from "next/head";

export default function Home() {
  const { user, setUser } = useUser();

  useEffect(() => {
    console.log("useEffect ran");
    getUser(setUser);
  }, []);

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content="Can you create the most viral meme ever?"
        />
        <meta
          name="description"
          content="Can your meme be the greatest!"
        />
        <meta
          name="fc:frame"
          content='{"version":"next","imageUrl": "https://res.cloudinary.com/dcw1m1rak/image/upload/v1760784780/titleimg_bma0sw.png", "button":{"title":"Forge your own meme","action":{"type":"launch_miniapp","url": "https://methodology-cartoon-wallpapers-davidson.trycloudflare.com","name":"MemeForge","splashImageUrl": "https://res.cloudinary.com/dcw1m1rak/image/upload/v1760785032/MF_birpkf.png","splashBackgroundColor":"#000"}}}'
        />
      </Head>

      <div className="min-h-screen bg-background relative">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-foreground">MemeForge </h1>
            <p className="text-muted-foreground mt-2">
              Turn trending casts into viral memes
            </p>
          </div>
        </header>

        {/* user prof */}

        <div className="w-fit flex gap-4 items-center ml-4">
          <img
            src={user?.avatar ?? "/default-avatar.png"}
            alt={`${user?.username}'s avatar`}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
          <h4 className="">{user?.username}</h4>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrendingCastFeed />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Leaderboard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
