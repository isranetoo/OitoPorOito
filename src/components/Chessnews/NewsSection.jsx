import React from "react";

export default function NewsSection() {
  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
      <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Notícias</h3>
      <ul className="space-y-2 text-white/90">
        <li className="border-b border-gray-700 pb-2">Tan Finishes 3rd With Black Win</li>
        <li className="border-b border-gray-700 pb-2">Girl, Aronian, Nihal, Sindarov Grab Final Spots</li>
        <li>Gukesh Scores GM Against Moradiabadi</li>
      </ul>
    </section>
  );
}
