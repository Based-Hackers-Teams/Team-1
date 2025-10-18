export interface Cast {
  id: string;
  author: {
    username: string;
    displayName: string;
    pfpUrl: string;
  };
  text: string;
  timestamp: string;
  engagement: {
    likes: number;
    recasts: number;
    replies: number;
  };
  trending: boolean;
}

export interface RemixModalProps {
  cast: Cast | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  textPositions: {
    top: boolean;
    bottom: boolean;
    middle: boolean;
  };
}

export type User = {
  username: string | null;
  avatar?: string | null;
};