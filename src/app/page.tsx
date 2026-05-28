import { getRaceData } from "@/lib/kv";
import { getRunnerStatus, sortYards, statusLabel } from "@/lib/race";
import { YARD_DISTANCE_KM } from "@/lib/constants";
import { CountdownTimer, ElapsedTimer } from "@/components/Timers";
import { YardTable } from "@/components/YardTable";
import { YouTubeSection } from "@/components/YouTubeSection";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

async function fetchYouTubePlaylist(playlistId: string): Promise<string[]> {
  if (!playlistId || !process.env.YOUTUBE_API_KEY) return [];
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (
      data.items
        ?.map((item: { snippet: { resourceId: { videoId: string } } }) =>
          item.snippet.resourceId.videoId
        )
        .filter(Boolean) ?? []
    );
  } catch {
    return [];
  }
}

export default async function DisplayPage() {
  const data = await getRaceData();
  const { config, finished, yards, youtubePlaylistId } = data;

  const status = getRunnerStatus(config, finished);
  const sortedYards = sortYards(yards);
  const yardCount = sortedYards.length;
  const totalDistance = (yardCount * YARD_DISTANCE_KM).toFixed(2);
  const youtubeVideoIds = await fetchYouTubePlaylist(youtubePlaylistId);

  return (
    <div className="min-h-screen flex flex-col">
      <AutoRefresh />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {/* Status header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {status === "in_progress" && (
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-brand" />
            </span>
          )}
          <h1 className="text-center uppercase leading-none">
            {statusLabel(status)}
          </h1>
        </div>

        {config.subtitle && (
          <p className="text-sm text-muted text-center mb-10">{config.subtitle}</p>
        )}
        {!config.subtitle && <div className="mb-10" />}

        <hr className="border-border mb-10" />

        {/* Stats: yards completed */}
        <div className="text-center mb-14">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">
            Yards Completed
          </p>
          <p className="text-8xl font-heading tabular-nums leading-none">
            {String(yardCount).padStart(2, "0")}
          </p>
        </div>

        {/* Stats: distance + timers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">
              Total Distance
            </p>
            <p className="text-5xl font-heading tabular-nums leading-none">
              {yardCount === 0 ? (
                <span>0</span>
              ) : (
                <span>{totalDistance}</span>
              )}
              <span className="text-xl text-muted ml-1">km</span>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">
              Next Yard Starts In
            </p>
            <p className="text-5xl font-heading leading-none">
              <CountdownTimer config={config} finished={finished} />
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">
              Elapsed Time
            </p>
            <p className="text-5xl font-heading leading-none">
              <ElapsedTimer config={config} finished={finished} yards={sortedYards} />
            </p>
          </div>
        </div>

        {/* Race info card */}
        {config.title && (
          <div className="fact-card mb-10 text-center">
            <h4 className="uppercase mb-4">
              {config.title}
            </h4>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-sm text-text/80">
              {config.startDate && config.startTime && (
                <p>
                  📅&nbsp;&nbsp;{config.startDate} at {config.startTime}
                </p>
              )}
              {config.location && (
                <p>
                  📍 {config.location}
                </p>
              )}
            </div>
            {config.summary && (
              <>
                <hr className="mt-6 border-border" />
                <p className="mt-6 text-sm text-text/70">
                  {config.summary.split("\n").map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </p>
              </>
            )}
          </div>
        )}

        {/* Yard table */}
        <h2 className="text-center mb-4">
          Yard Information
        </h2>
        <div className="mb-10">
          <YardTable yards={sortedYards} timezone={config.timezone || "UTC"} />
        </div>

        {/* Videos */}
        {youtubePlaylistId && (
          <>
            <h2 className="text-center mb-4">
              Video Updates
            </h2>
            <div className="mb-2">
              <YouTubeSection videoIds={youtubeVideoIds} />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
