"use client";

import { TrendingCastFeed } from "@/components/trending-cast-feed";
import { Leaderboard } from "@/components/leaderboard";
import { useState, useEffect } from "react";
import { useUser } from "@/context/usercontext";
import { getUser } from "@/lib/getuser";
import { Memes } from "@/components/memes";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export default function Home() {
  const { user, setUser } = useUser();
  const [showMemes, setShowMemes] = useState(false);

  useEffect(() => {
    getUser(setUser);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background relative">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-foreground">MemeForge </h1>
            <p className="text-muted-foreground mt-2">
              Turn trending casts into viral memes
            </p>
          </div>
        </header>

        {/* user prof */}

        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar ?? "/drake-hotline-bling-meme-template.png"}
                alt={`${user?.username}'s avatar`}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
              <h4 className="">@{user?.username}</h4>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMemes(!showMemes)}
              className="gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {showMemes ? "Hide Memes" : "Show Memes"}
            </Button>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          {showMemes ? (
            <Memes />
          ) : (
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
          )}
        </main>
      </div>
    </>
  );
}
