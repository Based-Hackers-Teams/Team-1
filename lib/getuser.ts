import sdk from "@farcaster/miniapp-sdk";
import { Dispatch, SetStateAction } from "react";
import { User } from "./types";
type FetchedUser = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
};


type SetUserFn = Dispatch<SetStateAction<User | null>>;

export const getUser = async (setUser: (user: User | null) => void) => {
  try {
    console.log("Calling sdk.context.user()");

    const context = await sdk.context;
    const fetchedUser = context?.user as FetchedUser | undefined;

    if (!fetchedUser) {
      console.warn("No user found in SDK context");
      return;
    }

    setUser({
      username: fetchedUser.displayName || fetchedUser.username,
      avatar: fetchedUser.pfpUrl,
    });

    console.log("Fetched user:", fetchedUser);
  } catch (error: unknown) {
    console.error("Error fetching user from SDK:", error);
  }
};
