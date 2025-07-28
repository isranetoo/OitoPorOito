import React from "react";

export default function ArticlesSection() {
  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
      <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Artigos</h3>
      <p className="mb-2 font-bold text-[#e7c27d]">"You Can Use The Engine To Improve" — Nate Solon</p>
      <ul className="text-sm list-disc list-inside space-y-1 text-white/90">
        <li>Is There Luck in Chess?</li>
        <li>5 Strategies to Win More Games at Freestyle</li>
        <li>The Best Chess Openings for White</li>
      </ul>
    </section>
  );
}
