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
        <h1 className="text-center text-lg font-mono tracking-widest uppercase text-muted mb-10">
          {statusLabel(status)}
        </h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="text-center">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Loops Completed
            </p>
            <p className="text-7xl font-mono tabular-nums leading-none">
              {String(loopCount).padStart(2, "0")}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Total Distance
            </p>
            <p className="text-7xl font-mono tabular-nums leading-none">
              {loopCount === 0 ? (
                <span>0</span>
              ) : (
                <span>{totalDistance}</span>
              )}
              <span className="text-2xl text-muted ml-1">km</span>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Next Loop Start
            </p>
            <p className="text-4xl font-mono leading-none mb-4">
              <CountdownTimer config={config} finished={finished} />
            </p>
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Elapsed Time
            </p>
            <p className="text-4xl font-mono leading-none">
              <ElapsedTimer config={config} finished={finished} />
            </p>
          </div>
        </div>

        {/* Race info card */}
        {config.title && (
          <div className="fact-card mb-10">
            <h2 className="text-sm font-mono text-muted uppercase tracking-widest mb-3">
              {config.title}
            </h2>
            <div className="flex flex-col gap-1 text-sm text-text/80">
              {config.startDate && config.startTime && (
                <p>
                  <span className="text-muted">Start:</span>{" "}
                  {config.startDate} at {config.startTime}
                </p>
              )}
              {config.location && (
                <p>
                  <span className="text-muted">Location:</span> {config.location}
                </p>
              )}
              {config.summary && (
                <p className="mt-2 text-text/70">{config.summary}</p>
              )}
            </div>
          </div>
        )}

        {/* Loop table */}
        <h2 className="text-center text-sm font-mono text-muted uppercase tracking-widest mb-4">
          Loop Information
        </h2>
        <div className="mb-10">
          <LoopTable loops={sortedLoops} />
        </div>

        {/* Videos */}
        {((videoMode === "profile" && tiktokUsername) ||
          (videoMode === "urls" && videos.length > 0)) && (
          <>
            <h2 className="text-center text-sm font-mono text-muted uppercase tracking-widest mb-6">
              Updates
            </h2>
            <div className="mb-10">
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
