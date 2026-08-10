export type MediaItem = {
  kind: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
};

export type MemoryItem = {
  id: string;
  title: string;
  note: string;
  media: MediaItem[];
};

export type BirthdayContent = {
  memories: MemoryItem[];
  finaleVideo: string;
};
