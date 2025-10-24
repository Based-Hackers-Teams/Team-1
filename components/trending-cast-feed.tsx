"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { RemixModal } from "@/components/remix-modal";
import type { Cast } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TrendingCastFeed() {
  const [selectedCast, setSelectedCast] = useState<Cast | null>(null);
  const [filter, setFilter] = useState<"all" | "trending">("trending");

  const { data, error, isLoading, mutate } = useSWR(
    `/api/casts?filter=${filter}`,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  const casts: Cast[] = data?.casts || [];
  const filteredCasts =
    filter === "trending" ? casts.filter((cast) => cast.trending) : casts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Trending Casts</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => mutate()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as "all" | "trending")}
          >
            <TabsList>
              <TabsTrigger
                value="trending"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="all">All Casts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load casts</p>
          <Button onClick={() => mutate()}>Try Again</Button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCasts.map((cast) => (
            <Card
              key={cast.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={cast.author.pfpUrl || "/placeholder.svg"}
                        alt={cast.author.displayName}
                      />
                      <AvatarFallback>
                        {cast.author.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {cast.author.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{cast.author.username}
                      </p>
                    </div>
                  </div>
                  {cast.trending && (
                    <Badge
                      variant="secondary"
                      className="gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-foreground leading-relaxed">{cast.text}</p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {cast.engagement.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat2 className="h-4 w-4" />
                      {cast.engagement.recasts}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {cast.engagement.replies}
                    </span>
                  </div>
                  <span>{cast.timestamp}</span>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setSelectedCast(cast)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Forge Meme
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredCasts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No casts found</p>
        </div>
      )}

      <RemixModal
        cast={selectedCast}
        open={!!selectedCast}
        onOpenChange={(open) => !open && setSelectedCast(null)}
      />
    </div>
  );
}
