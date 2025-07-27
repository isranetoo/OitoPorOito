
import React from "react";
import { motion } from "framer-motion";
import PlayerInfoPlay from "./PlayerInfoPlay";
import ChessBoardStatic from "./ChessBoardStatic";

export default function ChessHome() {
  const menuItems = [
    { title: "Jogue online", desc: "Jogar contra uma pessoa com habilidades parecidas", icon: "⚡" },
    { title: "Jogar Com Bots", desc: "Desafie um bot de Fácil até Mestre", icon: "🤖" },
    { title: "Jogar contra o Treinador", desc: "Aprenda enquanto joga com o Treinador", icon: "👨‍🏫" },
    { title: "Jogar com um amigo", desc: "Convide um amigo para uma partida de xadrez", icon: "🤝" },
    { title: "Torneios", desc: "Entre em uma Arena onde qualquer um pode vencer", icon: "🏅" },
    { title: "Variantes de Xadrez", desc: "Encontre novas formas divertidas de jogar xadrez", icon: "🎲" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white">
      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 px-2 md:px-8">
          {/* Coluna do tabuleiro e infos */}
          <div className="flex flex-col items-center w-full md:w-auto">
            {/* Header do bot */}
            <PlayerInfoPlay
              avatar={"/assets/logo-oitoporoito.png"}
              name={"Gust"}
              rating={"2200"}
              flagUrl={"/assets/img/hikaru-nakamura.jpg"}
              flagAlt={"Brasil"}
              isBot={true}
            />
            {/* Tabuleiro */}
            <ChessBoardStatic />
            {/* Footer do usuário */}
            <PlayerInfoPlay
              avatar={"/assets/img/puzzle1.png"}
              name={"Guest"}
              rating={"0"}
              flagUrl={null}
              flagAlt={"Indefinida"}
              isBot={false}
            />
          </div>
          {/* Sidebar/menu */}
          <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0 w-full max-w-xs md:max-w-sm">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] p-7 md:p-8 rounded-2xl shadow-2xl border-t-2 border-b-2 border-[#c29d5d]/30 flex flex-col gap-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2 text-[#e7c27d] drop-shadow">
                ♟️ Jogue Xadrez
              </h2>

              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#1e1e1e] p-4 rounded-xl mb-2 hover:bg-[#333] transition-all cursor-pointer border border-[#c29d5d]/20 shadow-lg"
                >
                  <h3 className="font-semibold flex items-center gap-2 text-lg text-[#c29d5d]">
                    <span>{item.icon}</span> {item.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">{item.desc}</p>
                </div>
              ))}

              <div className="mt-6 flex justify-between text-sm text-gray-400">
                <span className="hover:text-[#c29d5d] cursor-pointer transition-colors">📜 Histórico de Partidas</span>
                <span className="hover:text-[#c29d5d] cursor-pointer transition-colors">📊 Tabela de classificação</span>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}
