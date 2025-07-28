
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DailyPuzzleBoard from "../components/DailyPuzzleBoard";

export default function Chessnews() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#e7c27d] drop-shadow">♟ Chess Today</h1>
          <div className="text-sm text-[#c29d5d] bg-[#232526] px-3 py-1 rounded shadow border border-[#c29d5d]/30">Ao Vivo na ChessTV</div>
        </header>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Coluna 1: Principal + Notícias + Artigos + Vídeos + Blog + Eventos */}
          <div className="lg:col-span-3 space-y-7">
            {/* Destaque Principal */}
            <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow-xl border border-[#c29d5d]/20">
              <img
                src="assets/img/chess-highlight.png"
                alt="Destaque"
                className="rounded-xl mb-4 w-full max-h-72 object-cover border border-[#c29d5d]/20 shadow"
              />
              <h2 className="text-2xl font-bold text-[#e7c27d] mb-2">Aronian derrota Niemann e conquista o prêmio de $200.000 em Las Vegas</h2>
            </section>

            {/* Notícias */}
            <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Notícias</h3>
              <ul className="space-y-2 text-white/90">
                <li className="border-b border-gray-700 pb-2">Tan Finishes 3rd With Black Win</li>
                <li className="border-b border-gray-700 pb-2">Girl, Aronian, Nihal, Sindarov Grab Final Spots</li>
                <li>Gukesh Scores GM Against Moradiabadi</li>
              </ul>
            </section>

            {/* Artigos */}
            <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Artigos</h3>
              <p className="mb-2 font-bold text-[#e7c27d]">"You Can Use The Engine To Improve" — Nate Solon</p>
              <ul className="text-sm list-disc list-inside space-y-1 text-white/90">
                <li>Is There Luck in Chess?</li>
                <li>5 Strategies to Win More Games at Freestyle</li>
                <li>The Best Chess Openings for White</li>
              </ul>
            </section>

            {/* Vídeos */}
            <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Vídeos</h3>
              <p className="font-bold text-[#e7c27d]">Rare Fourth Moves</p>
              <p className="text-sm text-white/80">Jan's Four Knights explicando jogadas raras</p>
            </section>

            {/* Blogs */}
            <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Blogs</h3>
              <p className="font-bold text-[#e7c27d]">N.N. My 60 Memorable Games Part I</p>
              <p className="text-sm text-white/80">Uma análise sobre os clássicos de Fischer.</p>
            </section>

            {/* Eventos */}
            <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h3 className="text-lg font-semibold mb-3 text-[#c29d5d]">Eventos</h3>
              <ul className="space-y-1 text-sm text-white/90">
                <li>📅 Freestyle Friday 2025</li>
                <li>📅 Arena Wednesday 2025</li>
                <li>📅 Bullet Brawls</li>
                <li>📅 Titled Tuesday 2025</li>
              </ul>
            </section>
          </div>

          {/* Sidebar direita */}
          <div className="space-y-7">
            {/* Stream */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h4 className="text-sm font-semibold mb-2 text-[#c29d5d]">Chessbrah is streaming</h4>
              <div className="bg-black text-center py-6 text-[#e7c27d] rounded-lg">Twitch Player</div>
            </div>

            {/* Problema Diário */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h4 className="text-sm font-semibold mb-2 text-[#c29d5d]">Problema Diário</h4>
              <div className="mb-2 rounded-lg">
                <DailyPuzzleBoard fen="r1bqkb1r/ppp2ppp/2n2n2/3pp3/2PP4/2N2NP1/PP2PP1P/R1BQKB1R b KQkq - 0 5" />
              </div>
              <p className="text-xs text-[#e7c27d] mb-2 text-center">Brancas jogam e vencem em 3 lances</p>
              <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] hover:from-[#ffe7b3] hover:to-[#e7c27d] text-sm px-4 py-2 rounded-xl text-black font-bold w-full shadow-lg transition-all duration-200">Resolver</button>
            </div>

            {/* Enquete */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h4 className="text-sm font-semibold mb-2 text-[#c29d5d]">Enquete</h4>
              <p className="text-sm mb-2 text-white/80">Qual ensinamento mais te ajudou no xadrez?</p>
              <ul className="space-y-1 text-sm text-white/90">
                <li>🔘 Atacar o centro</li>
                <li>🔘 Desenvolvimento rápido</li>
                <li>🔘 Roque rápido</li>
              </ul>
            </div>

            {/* Top Players */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h4 className="text-sm font-semibold mb-2 text-[#c29d5d]">Top Players</h4>
              <ul className="text-sm space-y-1 text-white/90">
                <li>1. Magnus Carlsen 🇳🇴 2830</li>
                <li>2. Hikaru Nakamura 🇺🇸 2785</li>
                <li>3. Ian Nepomniachtchi 🇷🇺 2760</li>
                <li>4. Ding Liren 🇨🇳 2755</li>
                <li>5. Fabiano Caruana 🇺🇸 2750</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
