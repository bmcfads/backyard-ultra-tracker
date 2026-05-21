"use client";

import Script from "next/script";
import type { VideoMode } from "@/lib/types";

interface TikTokSectionProps {
  videoMode: VideoMode;
  tiktokUsername: string;
  videos: string[];
}

export function TikTokSection({ videoMode, tiktokUsername, videos }: TikTokSectionProps) {
  if (videoMode === "profile" && tiktokUsername) {
    return (
      <>
        <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
        <div className="flex justify-center">
          <blockquote
            className="tiktok-embed"
            cite={`https://www.tiktok.com/@${tiktokUsername}`}
            data-unique-id={tiktokUsername}
            data-embed-type="creator"
            style={{ maxWidth: 780, minWidth: 288 }}
          >
            <section>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.tiktok.com/@${tiktokUsername}`}
              >
                @{tiktokUsername}
              </a>
            </section>
          </blockquote>
        </div>
      </>
    );
  }

  if (videoMode === "urls" && videos.length > 0) {
    return (
      <>
        <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
        <div className="flex flex-col items-center gap-6">
          {videos.map((url, i) => {
            const videoId = extractTikTokId(url);
            if (!videoId) return null;
            return (
              <blockquote
                key={i}
                className="tiktok-embed"
                cite={url}
                data-video-id={videoId}
                style={{ maxWidth: 605, minWidth: 325 }}
              >
                <section>
                  <a target="_blank" rel="noopener noreferrer" href={url}>
                    TikTok video
                  </a>
                </section>
              </blockquote>
            );
          })}
        </div>
      </>
    );
  }

  return null;
}

function extractTikTokId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}
