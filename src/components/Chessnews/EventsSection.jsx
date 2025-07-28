import React from "react";

export default function EventsSection() {
  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
      <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Eventos</h3>
      <ul className="space-y-1 text-sm text-white/90">
        <li>📅 Freestyle Friday 2025</li>
        <li>📅 Arena Wednesday 2025</li>
        <li>📅 Bullet Brawls</li>
        <li>📅 Titled Tuesday 2025</li>
      </ul>
    </section>
  );
}
