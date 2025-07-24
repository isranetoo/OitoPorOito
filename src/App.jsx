import React from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Board from "./components/Board";
import CTA from "./components/CTA";
import ChessPuzzleCard from './components/ChessPuzzleCard';
import ChessLessonCard from './components/ChessLessonCard';
import ChessNewsGrid from "./components/ChessNewsGrid";
import DownloadAppScreen from "./components/DownloadAppScreen";

function App() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      <Navbar />
      <main className="flex flex-col justify-center items-center bg-[#2c2c2c] p-8">
        <div className="flex gap-12 items-center">
          <Board />
          <CTA />
        </div>
        <div className="mt-8 w-full">
          <ChessPuzzleCard />
          
        </div>
        <div className="mt-8 w-full">
          <ChessLessonCard />
          
        </div>
        <div className="mt-8 w-full">
          <ChessNewsGrid />
          
        </div>
        <DownloadAppScreen />
      </main>
      <Footer />
    </div>
  );
}

export default App;
