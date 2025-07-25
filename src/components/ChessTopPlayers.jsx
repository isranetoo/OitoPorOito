import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import chessData from "../data/chessData"; // Adjust the path as necessary

const MODES = ["Standard", "Rapid", "Blitz"];
const CATEGORIES = ["Open", "Women", "Juniors"];

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

const ChessTopPlayers = () => {
  const [mode, setMode] = useState("Standard");
  const [category, setCategory] = useState("Open");
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="text-white"
    >
      {/* ...existing code... */}
      <h2 className="text-xl font-bold mb-4">Top Chess Players</h2>

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

      {/* Lista de jogadores */}
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
      {/* Botão See more */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate("/ratings-players")}
          className="text-[#d4af37] font-semibold px-4 rounded hover:underline focus:outline-none"
          style={{ background: 'none', border: 'none' }}
        >
          See more
        </button>
      </div>
    </motion.div>
  );
};

export default ChessTopPlayers;
