
import React from "react";
import ChessBoard from "../components/PlayComputer/ChessBoard";
import BotSidebar from "../components/PlayComputer/BotSidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PlayComputer() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 px-2 md:px-8">
          <div className="flex items-center justify-center w-full md:w-auto">
            <ChessBoard />
          </div>
          <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
            <BotSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
