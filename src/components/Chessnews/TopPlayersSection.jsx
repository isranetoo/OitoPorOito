import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import chessData from "../../data/chessData";

const MODES = ["Standard", "Rapid", "Blitz"];
const CATEGORIES = ["Open", "Women", "Juniors"];
const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode?.toLowerCase()}.png`;

export default function TopPlayersSection() {
  const [mode, setMode] = useState("Standard");
  const [category, setCategory] = useState("Open");
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10 text-white">
      <h4 className="text-lg font-bold mb-4 text-[#d4af37]">Top Players</h4>

      <div className="flex gap-2 mb-4">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "bg-[#d4af37] text-black px-4 py-1 rounded-full text-sm"
                : "bg-[#2c2c2c] border border-[#444] px-4 py-1 rounded-full text-sm"
            }
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={
              category === cat
                ? "bg-[#444] text-sm px-3 py-1 rounded-full border border-[#d4af37] text-[#d4af37]"
                : "bg-[#444] text-sm px-3 py-1 rounded-full"
            }
          >
            Top {cat}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#d4af37]">
            <th>#</th>
            <th>Jogador</th>
            <th className="text-right">Rating</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(chessData?.[mode]?.[category]) && chessData[mode][category].length > 0 ? (
            chessData[mode][category].slice(0, 10).map((player, idx) => (
              <tr key={player.name}>
                <td className="py-1 px-2 font-bold text-[#d4af37]">{idx + 1}</td>
                <td className="py-1 px-2 flex items-center gap-2">
                  <img
                    src={getFlagUrl(player.country)}
                    alt={player.country}
                    className="w-6 h-4 object-cover rounded-sm border border-[#444] bg-[#232526]"
                  />
                  <span className="text-white font-semibold">{player.name}</span>
                </td>
                <td className="py-1 px-2 text-right font-bold text-[#d4af37]">
                  {player.rating}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-6 text-center text-gray-400">
                Sem dados para esta modalidade/categoria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate("/ratings-players")}
          className="text-[#d4af37] font-semibold px-4 rounded hover:underline focus:outline-none"
          style={{ background: 'none', border: 'none' }}
        >
          See more
        </button>
      </div>
    </div>
  );
}
