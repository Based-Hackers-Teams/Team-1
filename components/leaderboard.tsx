"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Flame, Crown } from "lucide-react"

interface LeaderboardUser {
  rank: number
  username: string
  displayName: string
  pfpUrl: string
  memesCreated: number
  totalEngagement: number
  trending: boolean
}

interface PopularMeme {
  id: string
  imageUrl: string
  creator: string
  likes: number
  shares: number
}

const topCreators: LeaderboardUser[] = [
  {
    rank: 1,
    username: "memequeen",
    displayName: "Meme Queen",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 127,
    totalEngagement: 45230,
    trending: true,
  },
  {
    rank: 2,
    username: "cryptomemer",
    displayName: "Crypto Memer",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 98,
    totalEngagement: 38450,
    trending: true,
  },
  {
    rank: 3,
    username: "viralmaster",
    displayName: "Viral Master",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 156,
    totalEngagement: 35890,
    trending: false,
  },
  {
    rank: 4,
    username: "farcasterking",
    displayName: "Farcaster King",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 84,
    totalEngagement: 29340,
    trending: true,
  },
  {
    rank: 5,
    username: "memeartist",
    displayName: "Meme Artist",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 112,
    totalEngagement: 27650,
    trending: false,
  },
  {
    rank: 6,
    username: "laughfactory",
    displayName: "Laugh Factory",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 93,
    totalEngagement: 24120,
    trending: false,
  },
  {
    rank: 7,
    username: "basedmemes",
    displayName: "Based Memes",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 76,
    totalEngagement: 21890,
    trending: false,
  },
  {
    rank: 8,
    username: "onchainhumor",
    displayName: "Onchain Humor",
    pfpUrl: "/placeholder.svg?height=40&width=40",
    memesCreated: 68,
    totalEngagement: 19450,
    trending: false,
  },
]

const popularMemes: PopularMeme[] = [
  {
    id: "1",
    imageUrl: "/popular-meme-1.jpg",
    creator: "memequeen",
    likes: 2340,
    shares: 567,
  },
  {
    id: "2",
    imageUrl: "/popular-meme-2.jpg",
    creator: "cryptomemer",
    likes: 1890,
    shares: 445,
  },
  {
    id: "3",
    imageUrl: "/popular-meme-3.jpg",
    creator: "viralmaster",
    likes: 1654,
    shares: 389,
  },
  {
    id: "4",
    imageUrl: "/popular-meme-4.jpg",
    creator: "farcasterking",
    likes: 1523,
    shares: 356,
  },
]

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-muted-foreground font-semibold">#{rank}</span>
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
      </div>

      <Tabs defaultValue="creators" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creators" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Creators
          </TabsTrigger>
          <TabsTrigger value="memes" className="gap-2">
            <Flame className="h-4 w-4" />
            Popular Memes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creators" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Meme Creators</CardTitle>
              <CardDescription>Ranked by total engagement and memes created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCreators.map((user) => (
                  <div
                    key={user.username}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      user.rank <= 3 ? "bg-muted/50 border-primary/20" : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10">{getRankIcon(user.rank)}</div>

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.pfpUrl || "/placeholder.svg"} alt={user.displayName} />
                        <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{user.displayName}</p>
                          {user.trending && (
                            <Badge variant="secondary" className="gap-1">
                              <Flame className="h-3 w-3" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatNumber(user.totalEngagement)}</p>
                      <p className="text-sm text-muted-foreground">{user.memesCreated} memes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Memes</CardTitle>
              <CardDescription>Top performing memes from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularMemes.map((meme, index) => (
                  <div key={meme.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img
                        src={meme.imageUrl || "/placeholder.svg"}
                        alt={`Popular meme ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <p className="text-xs font-medium mb-1">by @{meme.creator}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span>{formatNumber(meme.likes)} likes</span>
                            <span>{formatNumber(meme.shares)} shares</span>
                          </div>
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-2 right-2 gap-1">
                          <Crown className="h-3 w-3" />
                          #1
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
