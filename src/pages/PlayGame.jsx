
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Bolt, Bot, Users, Handshake, Trophy, Dice5 } from "lucide-react";

export default function PlayGame() {
  const rows = [...Array(8)].map((_, i) => 8 - i);
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const options = [
    { icon: <Bolt size={20} />, title: "Jogue online", desc: "Jogar contra uma pessoa com habilidades parecidas" },
    { icon: <Bot size={20} />, title: "Jogar com Bots", desc: "Desafie um bot de fácil até Mestre" },
    { icon: <Users size={20} />, title: "Jogar contra o Treinador", desc: "Aprenda enquanto joga com o Treinador" },
    { icon: <Handshake size={20} />, title: "Jogar com um amigo", desc: "Convide um amigo para uma partida de xadrez" },
    { icon: <Trophy size={20} />, title: "Torneios", desc: "Entre em um Arena onde qualquer um pode vencer" },
    { icon: <Dice5 size={20} />, title: "Variantes de Xadrez", desc: "Encontre novas formas divertidas de jogar xadrez" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e1e] text-white">
      <Navbar />
      <main className="flex flex-1 flex-col items-center bg-[#2c2c2c] px-8 pt-8 pb-8">
        <div className="flex w-full max-w-[1400px] items-start gap-12 justify-center">
          {/* Tabuleiro */}
          <div className="flex flex-col items-center w-[440px]">
            <div className="bg-[#f0d9b5] border-4 border-gray-700 rounded-xl shadow-lg">
              <div className="grid grid-cols-8 grid-rows-8 w-[400px] h-[400px] rounded-lg overflow-hidden">
                {rows.map((row) =>
                  cols.map((col, i) => {
                    const isDark =
                      (row % 2 === 0 && i % 2 !== 0) ||
                      (row % 2 !== 0 && i % 2 === 0);
                    return (
                      <div
                        key={`${col}${row}`}
                        className={`w-full h-full ${
                          isDark ? "bg-[#769656]" : "bg-[#eeeed2]"
                        }`}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <div className="text-sm text-center text-gray-400 mt-2">
              <span className="font-bold text-white">OitoPorOito</span> (1036) 🇧🇷
            </div>
          </div>
          {/* Sidebar */}
          <div className="w-full max-w-sm bg-[#232526] p-8 rounded-2xl shadow-xl border border-[#c29d5d]/30">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#e7c27d]">♟️ Jogue Xadrez</h2>
            <div className="flex flex-col gap-4">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  className="flex items-start gap-3 text-left bg-[#383838] hover:bg-[#4c4c4c] p-4 rounded-lg shadow transition-all"
                >
                  <div className="mt-1">{opt.icon}</div>
                  <div>
                    <div className="font-semibold">{opt.title}</div>
                    <div className="text-sm text-gray-400">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-400 flex justify-between">
              <span>📜 Histórico de Partidas</span>
              <span>📊 Tabela de classificação</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
