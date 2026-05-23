import type { Loop } from "@/lib/types";
import { formatLoopTime } from "@/lib/race";

interface LoopTableProps {
  loops: Loop[];
  timezone: string;
}

export function LoopTable({ loops, timezone }: LoopTableProps) {
  if (loops.length === 0) {
    return (
      <p className="text-muted text-sm text-center py-4">No loops recorded yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border text-muted text-center">
            <th className="py-2 pr-4 font-normal">#</th>
            <th className="py-2 pr-4 font-normal">TIME COMPLETED</th>
            <th className="py-2 pr-4 font-normal">DURATION</th>
            <th className="py-2 pr-4 font-normal">PACE</th>
            <th className="py-2 font-normal">CUMULATIVE KM</th>
          </tr>
        </thead>
        <tbody>
          {loops.map((loop) => (
            <tr key={loop.id} className="border-b border-border/50 text-center">
              <td className="py-2 pr-4 tabular-nums">{loop.loopCount}</td>
              <td className="py-2 pr-4 tabular-nums">
                {formatLoopTime(loop, timezone)}
              </td>
              <td className="py-2 pr-4 tabular-nums">{loop.duration}</td>
              <td className="py-2 pr-4 tabular-nums">{loop.pace}/km</td>
              <td className="py-2 tabular-nums">{loop.cumulativeKm.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
