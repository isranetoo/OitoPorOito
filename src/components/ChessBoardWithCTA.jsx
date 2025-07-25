
import React from "react";
import { motion } from "framer-motion";

export default function ChessBoardWithCTA() {
  // Mapeamento dos nomes das peças para arquivos de imagem
  const pieceMap = {
    bK: "bK.png", bQ: "bQ.png", bR: "bR.png", bN: "bN.png", bB: "bB.png", bP: "bP.png",
    wK: "wK.png", wQ: "wQ.png", wR: "wR.png", wN: "wN.png", wB: "wB.png", wP: "wP.png",
  };

  // Matriz das peças iniciais usando nomes de forma simplificada
  const piecePositions = {
    0: ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    1: ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    6: ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    7: ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="grid grid-cols-8 grid-rows-8 w-[80vw] sm:w-[70vw] md:w-[480px] max-w-[480px] h-[80vw] sm:h-[70vw] md:h-[480px] max-h-[480px] min-w-[180px] min-h-[180px] border-2 border-white"
        style={{ aspectRatio: '1 / 1' }}
      >
        {Array.from({ length: 64 }, (_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isLight = (row + col) % 2 === 0;
          const piece = piecePositions[row] ? piecePositions[row][col] : "";
          return (
            <div
              key={i}
              className={`w-full h-full flex items-center justify-center select-none ${isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"}`}
            >
              {piece && (
                <img
                  src={`/assets/pieces/${pieceMap[piece]}`}
                  alt={piece}
                  className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 lg:w-14 lg:h-14 pointer-events-none"
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-96 bg-[#1e1e1e] p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Play Chess Online</h1>
        <h2 className="text-2xl font-semibold mb-4">on the #1 Site!</h2>
        <div className="text-sm mb-6 text-gray-400">
          <span className="font-bold text-white">18,867,311</span> Games Today <br />
          <span className="font-bold text-white">136,285</span> Playing Now
        </div>
        <button className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-2.5 rounded-xl text-lg font-bold mb-3 shadow-lg hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">
          ▶ Play Online
        </button>
        <button className="w-full bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-2.5 rounded-xl text-lg font-bold shadow-lg border-2 border-[#c29d5d]/50 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">
          🤖 Play Computer
        </button>
      </motion.section>
    </div>
  );
}
