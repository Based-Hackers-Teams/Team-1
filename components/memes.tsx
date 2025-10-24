"use client";

import useSWR from "swr";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useUser } from "@/context/usercontext";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Memes() {
  const { user } = useUser();
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const allKey = "/api/memes";
  const mineKey = user ? `/api/memes?mine=true&fid=${user.fid}` : null;

  const {
    data: allData,
    error: allError,
    isLoading: allLoading,
    mutate: mutateAll,
  } = useSWR(allKey, fetcher, {
    refreshInterval: 30000,
  });

  const {
    data: mineData,
    error: mineError,
    isLoading: mineLoading,
    mutate: mutateMine,
  } = useSWR(mineKey, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });

  const memes = filter === "all" ? allData?.memes || [] : mineData?.memes || [];
  const isLoading = filter === "all" ? allLoading : mineLoading;
  const error = filter === "all" ? allError : mineError;

  const handleAction = async (
    memeId: string,
    action: "like" | "repost" | "comment",
    commentText?: string
  ) => {
    if (!user?.fid) return;

    // Optimistic update: bump local counts
    const optimisticUpdate = (list: any[]) =>
      list.map((m) =>
        m.id === memeId
          ? {
              ...m,
              __optimistic: true,
              [`${action}s`]: (m[`${action}s`] || 0) + 1,
            }
          : m
      );

    if (filter === "all")
      mutateAll(
        (current: any) => ({ memes: optimisticUpdate(current?.memes || []) }),
        false
      );
    if (filter === "mine")
      mutateMine(
        (current: any) => ({ memes: optimisticUpdate(current?.memes || []) }),
        false
      );

    try {
      const res = await fetch("/api/memes/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          meme_id: memeId,
          user_id: user.fid,
          comment: commentText,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Action failed");

      // Revalidate after action
      mutateAll();
      mutateMine();
    } catch (err) {
      console.error("Action error:", err);
      // revert optimistic
      mutateAll();
      mutateMine();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Memes</h2>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as any)}
        >
          <TabsList>
            <TabsTrigger value="all">All Memes</TabsTrigger>
            <TabsTrigger value="mine">My Memes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load memes</p>
          <Button
            onClick={() => {
              mutateAll();
              mutateMine();
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memes.map((m: any) => (
            <Card
              key={m.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={m.creator?.pfp_url || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {m.creator?.display_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {m.creator?.display_name || "Unknown"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{m.creator?.username || "unknown"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </CardHeader>

              <CardContent>
                <img
                  src={m.image_url}
                  alt={m.text || "meme"}
                  className="w-full rounded-md object-cover max-h-72"
                />
                {m.text && <p className="mt-2 text-foreground">{m.text}</p>}
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button
                    className="flex items-center gap-2"
                    onClick={() => handleAction(m.id, "like")}
                  >
                    <Heart className="h-4 w-4" />
                    <span>{m.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-2"
                    onClick={() => handleAction(m.id, "repost")}
                  >
                    <Repeat2 className="h-4 w-4" />
                    <span>{m.reposts}</span>
                  </button>
                  <button
                    className="flex items-center gap-2"
                    onClick={() => handleAction(m.id, "reply", "Nice meme!")}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{m.replies}</span>
                  </button>
                </div>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(m.image_url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && memes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No memes found</p>
        </div>
      )}
    </div>
  );
}
