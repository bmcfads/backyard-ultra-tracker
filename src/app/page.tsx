import { getRaceData } from "@/lib/kv";
import { getRunnerStatus, sortLoops, statusLabel } from "@/lib/race";
import { LOOP_DISTANCE_KM } from "@/lib/constants";
import { CountdownTimer, ElapsedTimer } from "@/components/Timers";
import { LoopTable } from "@/components/LoopTable";
import { TikTokSection } from "@/components/TikTokSection";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const data = await getRaceData();
  const { config, finished, loops, videoMode, tiktokUsername, videos } = data;

  const status = getRunnerStatus(config, finished);
  const sortedLoops = sortLoops(loops);
  const loopCount = sortedLoops.length;
  const totalDistance = (loopCount * LOOP_DISTANCE_KM).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {/* Status header */}
        <h1 className="text-center uppercase leading-none mb-10">
          {statusLabel(status)}
        </h1>

        <hr className="border-border mb-10" />

        {/* Stats: loops completed */}
        <div className="text-center mb-14">
          <p className="text-xs text-muted uppercase tracking-widest mb-2">
            Loops Completed
          </p>
          <p className="text-8xl font-heading tabular-nums leading-none">
            {String(loopCount).padStart(2, "0")}
          </p>
        </div>

        {/* Stats: distance + timers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">
              Total Distance
            </p>
            <p className="text-5xl font-heading tabular-nums leading-none">
              {loopCount === 0 ? (
                <span>0</span>
              ) : (
                <span>{totalDistance}</span>
              )}
              <span className="text-xl text-muted ml-1">km</span>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">
              Next Loop Start
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
              <ElapsedTimer config={config} finished={finished} />
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

        {/* Loop table */}
        <h2 className="text-center mb-4">
          Loop Information
        </h2>
        <div className="mb-10">
          <LoopTable loops={sortedLoops} />
        </div>

        {/* Videos */}
        {((videoMode === "profile" && tiktokUsername) ||
          (videoMode === "urls" && videos.length > 0)) && (
          <>
            <h2 className="text-center mb-4">
              Updates
            </h2>
            <div className="mb-4">
              <TikTokSection
                videoMode={videoMode}
                tiktokUsername={tiktokUsername}
                videos={videos}
              />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
