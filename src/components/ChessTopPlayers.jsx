import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chessData from "../data/chessData"; // Adjust the path as necessary

const MODES = ["Standard", "Rapid", "Blitz"];
const CATEGORIES = ["Open", "Women", "Juniors"];

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

const ChessTopPlayers = () => {
  const [mode, setMode] = useState("Standard");
  const [category, setCategory] = useState("Open");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] text-white p-4 md:p-10 rounded-2xl max-w-4xl w-full mx-auto border-t-2 border-b-2 border-[#c29d5d]/30 shadow-xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#e7c27d] drop-shadow">
        Top Chess Players
      </h2>

      {/* Seleção de modalidade */}
      <div className="flex justify-center gap-4 mb-4">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-md transition-all font-semibold ${
              mode === m
                ? "bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black shadow-lg scale-105"
                : "bg-[#232526] text-white border border-[#c29d5d]/40 hover:bg-[#2d2d2d] hover:text-[#e7c27d] hover:scale-105"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Seleção de categoria */}
      <div className="flex justify-center gap-4 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all font-semibold ${
              category === cat
                ? "bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black shadow-lg scale-105"
                : "bg-[#232526] text-white border border-[#c29d5d]/40 hover:bg-[#2d2d2d] hover:text-[#e7c27d] hover:scale-105"
            }`}
          >
            Top {cat}
          </button>
        ))}
      </div>

      {/* Tabela com animação */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${category}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-[#c29d5d]/20 bg-[#232526] rounded-xl">
              <thead>
                <tr className="bg-[#1a1a1a] text-[#e7c27d]">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Jogador</th>
                  <th className="py-2 px-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(chessData?.[mode]?.[category]) && chessData[mode][category].length > 0 ? (
                  chessData[mode][category].map((player, idx) => (
                    <tr
                      key={player.name}
                      className="border-t border-[#c29d5d]/10 hover:bg-[#2d2d2d] transition-all"
                    >
                      <td className="py-2 px-4 font-bold text-[#e7c27d]">{idx + 1}</td>
                      <td className="py-2 px-4 flex items-center gap-2">
                        <img
                          src={getFlagUrl(player.country)}
                          alt={player.country}
                          className="w-6 h-4 object-cover rounded-sm shadow-sm border border-[#c29d5d]/30 bg-[#232526]"
                        />
                        <span className="text-white font-semibold">{player.name}</span>
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-[#e7c27d]">
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
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ChessTopPlayers;
