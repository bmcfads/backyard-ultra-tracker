import type { Yard } from "@/lib/types";
import { formatYardTime } from "@/lib/race";

interface YardTableProps {
  yards: Yard[];
  timezone: string;
}

export function YardTable({ yards, timezone }: YardTableProps) {
  if (yards.length === 0) {
    return (
      <p className="text-muted text-sm text-center py-4">No yards recorded yet.</p>
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
          {yards.map((yard) => (
            <tr key={yard.id} className="border-b border-border/50 text-center">
              <td className="py-2 pr-4 tabular-nums">{yard.yardCount}</td>
              <td className="py-2 pr-4 tabular-nums">
                {formatYardTime(yard, timezone)}
              </td>
              <td className="py-2 pr-4 tabular-nums">{yard.duration}</td>
              <td className="py-2 pr-4 tabular-nums">{yard.pace}/km</td>
              <td className="py-2 tabular-nums">{yard.cumulativeKm.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
