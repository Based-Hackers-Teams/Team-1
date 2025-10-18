"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import sdk from "@farcaster/miniapp-sdk";

type FarcasterContextType = {
  sdkReady: boolean;
};

const FarcasterContext = createContext<FarcasterContextType | undefined>(
  undefined
);

export const FarcasterProvider = ({ children }: { children: ReactNode }) => {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      try {
        console.log("Initializing Farcaster MiniApp SDK...");
        await sdk.actions.ready();
        setSdkReady(true);
      } catch (error) {
        console.error("Failed to initialize SDK:", error);
      }
    };

    initSDK();
  }, []);

  return (
    <FarcasterContext.Provider value={{ sdkReady }}>
      {children}
    </FarcasterContext.Provider>
  );
};

export const useFarcaster = () => {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error("useFarcaster must be used within a FarcasterProvider");
  }
  return context;
};
