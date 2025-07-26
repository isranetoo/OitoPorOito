import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { motion } from "framer-motion";

const stockfishUrl = "/stockfish/stockfish.js";

export default function ChessBoard() {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(5);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const stockfishRef = useRef(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMovesMap, setPossibleMovesMap] = useState({});
  const [lastMove, setLastMove] = useState({ from: null, to: null });

  useEffect(() => {
    stockfishRef.current = new Worker(stockfishUrl);
    stockfishRef.current.postMessage("uci");
    stockfishRef.current.postMessage(`setoption name Skill Level value ${stockfishLevel}`);
    stockfishRef.current.postMessage("isready");
    return () => stockfishRef.current.terminate();
  }, [stockfishLevel]);

  const makeAIMove = () => {
    stockfishRef.current.onmessage = (e) => {
      if (e.data.startsWith("bestmove")) {
        const move = e.data.split(" ")[1];
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        game.move({ from, to, promotion: "q" });
        setLastMove({ from, to });
        setFen(game.fen());
        setIsUserTurn(true);
        setSelectedSquare(null);
        setPossibleMovesMap({});
      }
    };
    stockfishRef.current.postMessage(`position fen ${game.fen()}`);
    stockfishRef.current.postMessage("go depth 15");
  };

  const handleMove = (from, to) => {
    const move = game.move({ from, to, promotion: "q" });
    if (move) {
      setLastMove({ from, to });
      setFen(game.fen());
      setIsUserTurn(false);
      setTimeout(() => makeAIMove(), 400);
    }
  };

  const handleSquareClick = (x, y) => {
    if (!isUserTurn || game.isGameOver()) return;
    const square = "abcdefgh"[x] + (8 - y);

    if (!selectedSquare) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        const moveInfo = {};
        moves.forEach((m) => {
          moveInfo[m.to] = { isCapture: !!m.captured };
        });
        setPossibleMovesMap(moveInfo);
      }
    } else {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMovesMap({});
      } else {
        const isLegal = possibleMovesMap[square];
        if (isLegal) {
          handleMove(selectedSquare, square);
        }
        setSelectedSquare(null);
        setPossibleMovesMap({});
      }
    }
  };

  const pieceMap = {
    bK: "bK.png", bQ: "bQ.png", bR: "bR.png", bN: "bN.png", bB: "bB.png", bP: "bP.png",
    wK: "wK.png", wQ: "wQ.png", wR: "wR.png", wN: "wN.png", wB: "wB.png", wP: "wP.png",
  };

  const getPieceImage = (piece, coord) => {
    if (!piece) return null;
    const key = (piece.color === "w" ? "w" : "b") + piece.type.toUpperCase();
    const img = pieceMap[key];
    if (!img) return null;
    return (
      <motion.img
        layoutId={coord + "-" + key}
        src={`/assets/pieces/${img}`}
        alt={key}
        className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 pointer-events-none select-none"
        draggable={false}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0.6 }}
        transition={{ duration: 0.25 }}
      />
    );
  };

  const renderBoard = () => {
    const board = game.board();

    return (
      <div className="relative">
        <div className="grid grid-cols-8 w-[380px] md:w-[650px] border-4 border-[#c29d5d] rounded-2xl shadow-2xl overflow-hidden">
          {board.flat().map((square, idx) => {
            const x = idx % 8;
            const y = Math.floor(idx / 8);
            const isLight = (x + (8 - y)) % 2 === 0;
            const coord = "abcdefgh"[x] + (8 - y);
            const isSelected = selectedSquare === coord;
            const isLastMoveFrom = coord === lastMove.from;
            const isLastMoveTo = coord === lastMove.to;
            const move = possibleMovesMap[coord];
            const isMoveOption = move !== undefined;
            const isCapture = move?.isCapture;

            return (
              <div
                key={coord}
                onClick={() => handleSquareClick(x, y)}
                className={`aspect-square relative flex items-center justify-center text-3xl cursor-pointer select-none transition-all duration-100
                  ${isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"}
                  ${isLastMoveFrom || isLastMoveTo ? "border-4 border-yellow-500/50" : "border-0"}
                  ${isSelected ? "ring-4 ring-yellow-400 z-10" : "ring-0"}
                `}
              >
                {/* Jogadas possíveis (círculo de destino) */}
                {isMoveOption && !isCapture && (
                  <div className="absolute w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-black/30 z-10" />
                )}
                {isMoveOption && isCapture && (
                  <div className="absolute w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-[3px] border-red-500/70 z-10" />
                )}
                {getPieceImage(square, coord)}
              </div>
            );
          })}
        </div>

        {/* Notação horizontal A-H */}
        <div className="absolute bottom-[-24px] left-0 w-full grid grid-cols-8 text-center text-sm text-white/70 font-medium">
          {"abcdefgh".split("").map((letter) => (
            <div key={letter}>{letter.toUpperCase()}</div>
          ))}
        </div>

        {/* Notação vertical 8-1 */}
        <div className="absolute top-0 left-[-20px] h-full grid grid-rows-8 text-sm text-white/70 font-medium">
          {[8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
            <div key={num} className="flex items-center justify-center h-full">
              {num}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {renderBoard()}
      {game.isGameOver() && (
        <div className="mt-2 text-lg text-white font-semibold">
          {game.isCheckmate()
            ? `Xeque-mate! ${game.turn() === "w" ? "Preto" : "Branco"} venceu.`
            : "Empate!"}
        </div>
      )}
    </div>
  );
}
