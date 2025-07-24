import React from "react";
import { motion } from "framer-motion";

export default function Board() {
  // Mapeamento dos nomes das peças para arquivos de imagem
  const pieceMap = {
    bK: "bK.png", bQ: "bQ.png", bR: "bR.png", bN: "bN.png", bB: "bB.png", bP: "bP.png",
    wK: "wK.png", wQ: "wQ.png", wR: "wR.png", wN: "wN.png", wB: "wB.png", wP: "wP.png",
  };

  // Matriz das peças iniciais usando nomes de forma simplificada
  const piecePositions = {
    // Peças pretas nas linhas superiores
    0: ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    1: ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    // Peças brancas nas linhas inferiores
    6: ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    7: ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
  };

  return (
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
        // Obtém a peça diretamente da estrutura piecePositions
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
  );
}
