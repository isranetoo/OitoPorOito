
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Mock de categorias e tópicos
const categories = [
  {
    id: "geral",
    title: "Discussão Geral sobre Xadrez",
    threads: [
      { id: 1, title: "the intellectuals of chess.com", time: "há 4 mins", replies: 2 },
      { id: 2, title: "Why when I click F...", time: "há 14 mins", replies: 50 },
      { id: 3, title: "How long until AI...", time: "há 18 mins", replies: 63 },
    ],
  },
  {
    id: "iniciantes",
    title: "Para Iniciantes",
    threads: [
      { id: 4, title: "Primeiros passos no xadrez", time: "há 2 mins", replies: 1 },
      { id: 5, title: "Como não cair em armadilhas?", time: "há 10 mins", replies: 7 },
      { id: 6, title: "Livros recomendados", time: "há 20 mins", replies: 3 },
    ],
  },
  {
    id: "partidas",
    title: "Análise de Partidas",
    threads: [
      { id: 7, title: "Minha partida contra o Stockfish", time: "há 8 mins", replies: 12 },
      { id: 8, title: "Erro no final de torre", time: "há 15 mins", replies: 5 },
      { id: 9, title: "Como melhorar cálculo?", time: "há 25 mins", replies: 9 },
    ],
  },
];

const recent = [
  { title: "why is Chess.com giving so easy puzzles?", author: "marinkatomab", time: "há 4 mins" },
  { title: "I am so bad at chess! Can someone gimme tips?", author: "ARAVARCHESS001", time: "há 5 mins" },
  { title: "Chess960: vale a pena?", author: "lucasfischer", time: "há 7 mins" },
];

export default function ChessForum() {
  // Para dados reais, descomente e adapte:
  // const [cats, setCats] = useState([]);
  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch('/api/forums/home');
  //     const json = await res.json();
  //     setCats(json.categories);
  //   })();
  // }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white">
      <Navbar />
      <Header />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 w-full">
        {/* Coluna principal */}
        <section className="space-y-6">
          {categories.map((cat) => (
            <ForumSection key={cat.id} section={cat} />
          ))}
        </section>
        {/* Sidebar */}
        <aside className="space-y-6">
          <ForumSidebar />
        </aside>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div className="border-b border-[#c29d5d]/20 bg-[#232526]/80 shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7c27d]/10 border border-[#c29d5d]/30 text-2xl">💬</span>
        <h1 className="text-3xl font-bold text-[#e7c27d] drop-shadow">Fóruns</h1>
      </div>
    </div>
  );
}

function ForumSection({ section }) {
  return (
    <div className="rounded-2xl bg-[#232526]/80 border border-[#c29d5d]/20 shadow-lg overflow-hidden">
      {/* Cabeçalho da seção */}
      <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] border-b border-[#c29d5d]/10">
        <h2 className="font-semibold text-lg text-[#e7c27d] drop-shadow">{section.title}</h2>
        <span className="text-gray-400 group inline-flex items-center gap-1 text-sm cursor-pointer hover:underline">
          ver mais
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18l6-6-6-6"/></svg>
        </span>
      </div>

      {/* Linhas */}
      <ul className="divide-y divide-[#c29d5d]/10">
        {section.threads.map((t) => (
          <ThreadRow key={t.id} thread={t} />
        ))}
      </ul>
    </div>
  );
}

function ThreadRow({ thread }) {
  return (
    <li className="px-6 py-4 flex items-center gap-3 hover:bg-[#e7c27d]/5 transition-colors">
      <a className="flex-1 truncate hover:underline cursor-pointer text-base text-white">{thread.title}</a>
      <span className="w-24 shrink-0 text-right text-sm text-gray-300">{thread.time}</span>
      <span className="w-10 shrink-0 inline-flex items-center justify-end gap-1 text-[#e7c27d]">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/></svg>
        <span className="tabular-nums font-bold">{thread.replies}</span>
      </span>
    </li>
  );
}

function ForumSidebar() {
  return (
    <>
      {/* Bloco: navegação rápida */}
      <div className="rounded-md bg-[#2a2b29] border border-white/10">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <h3 className="font-semibold">Fóruns</h3>
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18l6-6-6-6"/></svg>
        </div>

        <ul className="p-2">
          {["Meus tópicos", "Temas quentes", "Sem resposta", "Seguindo"].map((i) => (
            <li key={i}>
              <a className="block px-2 py-2 rounded hover:bg-white/5 text-sm cursor-pointer">{i}</a>
            </li>
          ))}
        </ul>

        <div className="p-3">
          <button className="w-full rounded-md bg-[#e7c27d] hover:bg-[#d6b95b] text-black font-semibold py-2">
            Novo tópico
          </button>
        </div>

        <div className="px-3 pb-3">
          <select className="w-full bg-[#1f201e] border border-white/10 rounded px-3 py-2 text-sm">
            <option>-- Categoria --</option>
            <option>Geral</option>
            <option>Iniciantes</option>
            <option>Partidas</option>
          </select>
        </div>
      </div>

      {/* Bloco: busca */}
      <div className="rounded-md bg-[#2a2b29] border border-white/10 p-3">
        <div className="relative">
          <input
            className="w-full rounded bg-[#1f201e] border border-white/10 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Buscar tópicos do fórum..."
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Bloco: Mais Recente */}
      <div className="rounded-md bg-[#2a2b29] border border-white/10">
        <h3 className="px-4 py-3 font-semibold border-b border-white/10">Mais Recente</h3>
        <ul className="p-2 text-sm divide-y divide-white/10">
          {recent.map((r, i) => (
            <li key={i} className="py-2">
              <a className="hover:underline block cursor-pointer">{r.title}</a>
              <span className="text-xs text-gray-400">{r.author} • {r.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
