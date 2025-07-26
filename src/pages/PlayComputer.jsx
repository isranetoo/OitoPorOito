
import React from "react";

import ChessBoard from "../components/PlayComputer/ChessBoard";
import BotSidebar from "../components/PlayComputer/BotSidebar";
import PlayerInfo from "../components/PlayComputer/PlayerInfo";
import Navbar from "../components/Navbar";

export default function PlayComputer() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 px-2 md:px-8">
          {/* Coluna do tabuleiro e infos */}
          <div className="flex flex-col items-center w-full md:w-auto">
            {/* Header do bot */}
            <PlayerInfo
              avatar="/assets/img/anna-rudolf.jpg"
              name="Jimmy"
              rating={600}
              flagUrl="https://flagcdn.com/w40/us.png"
              flagAlt="USA"
              isBot={true}
            />
            {/* Tabuleiro */}
            <ChessBoard />
            {/* Footer do usuário */}
            <PlayerInfo
              avatar="/assets/img/puzzle1.png"
              name="Guest"
              rating={0}
              flagUrl={null}
              flagAlt="Indefinida"
              isBot={false}
            />
          </div>
          {/* Sidebar dos bots */}
          <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
            <BotSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
