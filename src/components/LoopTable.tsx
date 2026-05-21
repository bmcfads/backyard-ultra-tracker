import type { Loop } from "@/lib/types";

interface LoopTableProps {
  loops: Loop[];
}

export function LoopTable({ loops }: LoopTableProps) {
  if (loops.length === 0) {
    return (
      <p className="text-muted text-sm text-center py-4">No loops recorded yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border text-muted text-left">
            <th className="py-2 pr-4 font-normal">#</th>
            <th className="py-2 pr-4 font-normal">Time Completed</th>
            <th className="py-2 pr-4 font-normal">Duration</th>
            <th className="py-2 pr-4 font-normal">Pace</th>
            <th className="py-2 font-normal">Cumulative km</th>
          </tr>
        </thead>
        <tbody>
          {loops.map((loop) => (
            <tr key={loop.id} className="border-b border-border/50">
              <td className="py-2 pr-4 tabular-nums">{loop.loopCount}</td>
              <td className="py-2 pr-4 tabular-nums">
                {loop.date} {loop.time}
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
