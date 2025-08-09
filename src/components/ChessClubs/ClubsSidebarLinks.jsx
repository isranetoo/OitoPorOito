import React from "react";

const links = [
  "Meus clubes",
  "Encontre clubes",
  "Partidas diárias",
  "Partidas ao vivo",
  "Xadrez por Votação",
  "Criar um clube",
  "Ligas",
  "Federações",
];

export default function ClubsSidebarLinks() {
  return (
    <div className="rounded-md bg-[#2a2b29] border border-white/10">
      <h3 className="px-4 py-3 font-semibold border-b border-white/10">Clubes de xadrez</h3>
      <ul className="p-2">
        {links.map((t) => (
          <li key={t}>
            <a className="block px-2 py-2 rounded hover:bg-white/5 text-sm" href="#">{t}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
