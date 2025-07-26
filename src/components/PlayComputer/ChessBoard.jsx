import React from "react";

export default function ChessBoard() {
  const rows = Array.from({ length: 8 }, (_, i) => 8 - i);
  const cols = "abcdefgh".split("");

  return (
    <div className="grid grid-cols-8 w-[380px] h-[380px] md:w-[650px] md:h-[650px] border-4 border-[#c29d5d] rounded-2xl shadow-2xl overflow-hidden">
      {rows.map((row) =>
        cols.map((col, i) => {
          const isLight = (i + row) % 2 === 0;
          return (
            <div
              key={`${col}${row}`}
              className={`w-full h-full ${
                isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
