import React from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChessPuzzleCard from './components/ChessPuzzleCard';
import ChessLessonCard from './components/ChessLessonCard';
import ChessNewsGrid from "./components/ChessNewsGrid";
import DownloadAppScreen from "./components/DownloadAppScreen";
import ChessTopPlayers from './components/ChessTopPlayers';
import ChessBoardWithCTA from './components/ChessBoardWithCTA';

function App() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      <Navbar />

      <main className="flex flex-col items-center bg-[#2c2c2c] px-8 pt-8">
        {/* CONTAINER PRINCIPAL */}
        <div className="flex w-full max-w-[1650px] items-start gap-[90px] ">
          
          {/* LADO ESQUERDO: Top Players */}
          <div className="w-[280px] ">
            <ChessTopPlayers />
          </div>

          {/* CENTRO: Tabuleiro + Cards */}
          <div className="flex flex-col w-[900px] items-center gap-8 ">
            {/* TABULEIRO */}
            <ChessBoardWithCTA />

            {/* CARDS ABAIXO */}
            <div className="w-full ">
              <ChessPuzzleCard />
            </div>
            <div className="w-full ">
              <ChessLessonCard />
            </div>
            <div className="w-full ">
              <ChessNewsGrid />
            </div>
            <div className="mt-4 w-full ">
              <DownloadAppScreen />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
