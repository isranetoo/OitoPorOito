import React from "react";

export default function PollSection() {
  return (
    <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
      <h4 className="text-sm font-semibold mb-2 text-[#c29d5d]">Enquete</h4>
      <p className="text-sm mb-2 text-white/80">Qual ensinamento mais te ajudou no xadrez?</p>
      <ul className="space-y-1 text-sm text-white/90">
        <li>🔘 Atacar o centro</li>
        <li>🔘 Desenvolvimento rápido</li>
        <li>🔘 Roque rápido</li>
      </ul>
    </div>
  );
}
