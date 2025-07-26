import React from "react";

export default function BotCard({ name }) {
  return (
    <div
      className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#232526] via-[#444] to-[#232526] border-2 border-[#c29d5d]/60 flex items-center justify-center text-white text-lg font-bold shadow-md hover:scale-105 hover:border-[#e7c27d] transition-all duration-200 cursor-pointer select-none"
      title={name}
    >
      {name.charAt(0)}
    </div>
  );
}
