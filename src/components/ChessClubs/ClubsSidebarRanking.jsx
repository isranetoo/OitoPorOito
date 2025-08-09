import React from "react";

const rows = [
  { pos: 1, name: "TURK CHESS PLAY...", score: 1043286 },
  { pos: 2, name: "Chess School", score: 718520 },
  { pos: 3, name: "Team Russia", score: 701837 },
  { pos: 4, name: "PHILIPPINES' FINES...", score: 651352 },
  { pos: 5, name: "THE POWER OF CH...", score: 598462 },
];

export default function ClubsSidebarRanking() {
  return (
    <div className="rounded-md bg-[#2a2b29] border border-white/10">
      <h3 className="px-4 py-3 font-semibold border-b border-white/10">Tabela de Classificação do Clube</h3>
      <div className="p-2">
        <h4 className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Confrontos
        </h4>
        <ul className="text-sm divide-y divide-white/10">
          {rows.map((r) => (
            <li key={r.pos} className="py-2 flex items-center gap-3">
              <span className="w-5 text-gray-400">#{r.pos}</span>
              <span className="flex-1 truncate">{r.name}</span>
              <span className="font-medium tabular-nums">{r.score.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
