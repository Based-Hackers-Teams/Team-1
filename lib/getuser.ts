// import sdk from "@farcaster/miniapp-sdk";
// import { Dispatch, SetStateAction } from "react";
// import { User } from "./types";

// type FetchedUser = {
//   fid: number;
//   username: string;
//   displayName: string;
//   pfpUrl?: string;
// };

// type SetUserFn = Dispatch<SetStateAction<User | null>>;

// export const getUser = async (setUser: SetUserFn) => {
//   try {
//     console.log("Calling sdk.context.user()");

//     const context = await sdk.context;
//     const fetchedUser = context?.user as FetchedUser | undefined;

//     if (!fetchedUser) {
//       console.warn("No user found in SDK context");
//       return;
//     }

//     setUser({
//       username: fetchedUser.username,
//       avatar: fetchedUser.pfpUrl,
//       fid: fetchedUser.fid,
//     });

//     try {
//       const res = await fetch("/api/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fid: fetchedUser.fid,
//           username: fetchedUser.username,
//           pfp_url: fetchedUser.pfpUrl,
//           display_name: fetchedUser.displayName,
//         }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         console.error("Error saving user to Supabase:", err);
//       } else {
//         console.log("✅ User synced to Supabase");
//       }
//     } catch (err) {
//       console.error("Error creating user:", err);
//     }

//     console.log("Fetched user:", fetchedUser);
//   } catch (error: unknown) {
//     console.error("Error fetching user from SDK:", error);
//   }
// };

import sdk from "@farcaster/miniapp-sdk";
import { User } from "./types";

type FetchedUser = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
};
type SetUserFn = (user: User | null) => void;

export const getUser = async (setUser: SetUserFn) => {
  try {
    console.log("Calling sdk.context.user()");

    const context = await sdk.context;
    const fetchedUser = context?.user as FetchedUser | undefined;

    if (!fetchedUser) {
      console.warn("No user found in SDK context");
      return;
    }

    // Update app state
    setUser({
      username: fetchedUser.username,
      avatar: fetchedUser.pfpUrl ?? null,
      fid: fetchedUser.fid,
    });

    // Check if user is already synced
    const syncedKey = `user_synced_${fetchedUser.fid}`;
    const alreadySynced = localStorage.getItem(syncedKey);

    if (alreadySynced) {
      console.log("✅ User already synced, skipping API call");
      return;
    }

    // Send to API route only once
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fid: fetchedUser.fid,
        username: fetchedUser.username,
        pfp_url: fetchedUser.pfpUrl,
        display_name: fetchedUser.displayName,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Error syncing user:", err);
    } else {
      console.log("✅ User synced to Supabase");
      localStorage.setItem(syncedKey, "true");
    }
  } catch (error: unknown) {
    console.error("Error fetching user from SDK:", error);
  }
};
