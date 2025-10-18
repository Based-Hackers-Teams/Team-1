// import { NextResponse } from "next/server";
// import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

// import {
//   FetchFeedFeedTypeEnum,
//   FetchFeedFilterTypeEnum,
// } from "@neynar/nodejs-sdk/build/api";
// const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || "NEYNAR_API_DOCS";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const filter = searchParams.get("filter") || "trending";

//     const config = new Configuration({ apiKey: NEYNAR_API_KEY });
//     const client = new NeynarAPIClient(config);

//     console.log("API KEY:", process.env.NEYNAR_API_KEY ?? "Not found");

//     const response = await client.fetchFeed({
//       feedType: FetchFeedFeedTypeEnum.Filter,
//       filterType: FetchFeedFilterTypeEnum.GlobalTrending,
//       limit: 20,
//     });

//     console.log(response);

//     // const response = await client.fetchFeed("filter", {
//     //   filterType: filter === "trending" ? "global_trending" : "following",
//     //   limit: 25,
//     // });

//     const casts = response.casts.map((cast: any) => {
//       const engagementScore =
//         (cast.reactions?.likes_count || 0) * 2 +
//         (cast.reactions?.recasts_count || 0) * 3 +
//         (cast.replies?.count || 0);

//       return {
//         id: cast.hash,
//         author: {
//           username: cast.author.username,
//           displayName: cast.author.display_name || cast.author.username,
//           pfpUrl: cast.author.pfp_url,
//         },
//         text: cast.text,
//         timestamp: getRelativeTime(new Date(cast.timestamp)),
//         engagement: {
//           likes: cast.reactions?.likes_count || 0,
//           recasts: cast.reactions?.recasts_count || 0,
//           replies: cast.replies?.count || 0,
//         },
//         trending: engagementScore > 50,
//       };
//     });

//     return NextResponse.json({ casts });
//   } catch (error) {
//     console.error("Error fetching casts:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch trending casts", casts: [] },
//       { status: 500 }
//     );

//     // const mockCasts = [
//     //   {
//     //     id: "1",
//     //     author: {
//     //       username: "dwr",
//     //       displayName: "Dan Romero",
//     //       pfpUrl: "/abstract-profile.png",
//     //     },
//     //     text: "Just shipped a major update to Farcaster. The future of decentralized social is here.",
//     //     timestamp: "2h ago",
//     //     engagement: {
//     //       likes: 342,
//     //       recasts: 89,
//     //       replies: 56,
//     //     },
//     //     trending: true,
//     //   },
//     //   {
//     //     id: "2",
//     //     author: {
//     //       username: "vitalik",
//     //       displayName: "Vitalik Buterin",
//     //       pfpUrl: "/ethereum-abstract.png",
//     //     },
//     //     text: "Ethereum is not just a blockchain, it's a movement. Let's build the future together.",
//     //     timestamp: "4h ago",
//     //     engagement: {
//     //       likes: 1203,
//     //       recasts: 234,
//     //       replies: 145,
//     //     },
//     //     trending: true,
//     //   },
//     //   {
//     //     id: "3",
//     //     author: {
//     //       username: "jessepollak",
//     //       displayName: "Jesse Pollak",
//     //       pfpUrl: "/foundational-structure.png",
//     //     },
//     //     text: "Base is bringing the next billion users onchain. The momentum is incredible.",
//     //     timestamp: "6h ago",
//     //     engagement: {
//     //       likes: 567,
//     //       recasts: 123,
//     //       replies: 78,
//     //     },
//     //     trending: true,
//     //   },
//     // ];

//     // return NextResponse.json({ casts: mockCasts });
//   }
// }

import axios from "axios";
import { NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function GET() {
  try {
    console.log("🔑 API Key:", NEYNAR_API_KEY ? "Found" : "Missing");

    // Uncomment this section when you have API access
    // const response = await axios.get(
    //   "https://api.neynar.com/v2/farcaster/feed/trending",
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       api_key: NEYNAR_API_KEY!,
    //     },
    //     params: {
    //       limit: 20, // number of trending casts to fetch
    //     },
    //   }
    // );

    // const casts = response.data.casts.map((cast: any) => ({
    //   id: cast.hash,
    //   author: {
    //     username: cast.author.username,
    //     displayName: cast.author.display_name || cast.author.username,
    //     pfpUrl: cast.author.pfp_url,
    //   },
    //   text: cast.text,
    //   timestamp: new Date(cast.timestamp).toISOString(),
    //   engagement: {
    //     likes: cast.reactions?.likes_count || 0,
    //     recasts: cast.reactions?.recasts_count || 0,
    //     replies: cast.replies?.count || 0,
    //   },
    // }));

    // return NextResponse.json({ casts });

    // 🧱 Mock data fallback for free plan or failed API
    const mockCasts = [
      {
        id: "1",
        author: {
          username: "dwr",
          displayName: "Dan Romero",
          pfpUrl: "/abstract-profile.png",
        },
        text: "Just shipped a major update to Farcaster. The future of decentralized social is here.",
        timestamp: "2h ago",
        engagement: {
          likes: 342,
          recasts: 89,
          replies: 56,
        },
        trending: true,
      },
      {
        id: "2",
        author: {
          username: "vitalik",
          displayName: "Vitalik Buterin",
          pfpUrl: "/ethereum-abstract.png",
        },
        text: "Ethereum is not just a blockchain, it's a movement. Let's build the future together.",
        timestamp: "4h ago",
        engagement: {
          likes: 1203,
          recasts: 234,
          replies: 145,
        },
        trending: true,
      },
      {
        id: "3",
        author: {
          username: "jessepollak",
          displayName: "Jesse Pollak",
          pfpUrl: "/foundational-structure.png",
        },
        text: "Base is bringing the next billion users onchain. The momentum is incredible.",
        timestamp: "6h ago",
        engagement: {
          likes: 567,
          recasts: 123,
          replies: 78,
        },
        trending: true,
      },
    ];

    return NextResponse.json({ casts: mockCasts });
  } catch (error: any) {
    console.error(
      "❌ Error fetching trending casts:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
}

// import { NextResponse } from "next/server";
// import axios from "axios";

// const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

// export async function GET() {
//   try {
//     console.log("🔑 API Key:", NEYNAR_API_KEY ? "Found" : "Missing");

//     const response = await axios.get(
//       "https://api.neynar.com/v2/farcaster/feed/trending",
//       {
//         headers: {
//           "Content-Type": "application/json",
//           api_key: NEYNAR_API_KEY!,
//         },
//         params: {
//           limit: 20, // number of trending casts to fetch
//         },
//       }
//     );

//     const casts = response.data.casts.map((cast: any) => ({
//       id: cast.hash,
//       author: {
//         username: cast.author.username,
//         displayName: cast.author.display_name || cast.author.username,
//         pfpUrl: cast.author.pfp_url,
//       },
//       text: cast.text,
//       timestamp: new Date(cast.timestamp).toISOString(),
//       engagement: {
//         likes: cast.reactions?.likes_count || 0,
//         recasts: cast.reactions?.recasts_count || 0,
//         replies: cast.replies?.count || 0,
//       },
//     }));

//     return NextResponse.json({ casts });
//   } catch (error: any) {
//     console.error(
//       "❌ Error fetching trending casts:",
//       error.response?.data || error.message
//     );
//     return NextResponse.json(
//       { error: error.response?.data || error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }
