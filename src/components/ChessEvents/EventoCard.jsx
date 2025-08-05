import React from "react";

export default function EventoCard({ img, titulo, data }) {
  return (
    <div className="flex items-center bg-[#2a2a2a] rounded-lg p-3 gap-4 hover:bg-[#333] cursor-pointer">
      <img src={img} alt={titulo} className="w-16 h-16 object-contain rounded" />
      <div>
        <h3 className="font-semibold">{titulo}</h3>
        <p className="text-sm text-gray-400">{data}</p>
      </div>
    </div>
  );
}