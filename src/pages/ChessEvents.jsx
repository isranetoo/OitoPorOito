

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StreamersList from "../components/ChessEvents/StreamersList";
import RankingList from "../components/ChessEvents/RankingList";
import SocialLinks from "../components/ChessEvents/SocialLinks";

import chessData from "../data/chessData";
import EventoCard from "../components/ChessEvents/EventoCard";


function ChessTVSchedule() {
  const hours = [
    "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM",
    "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
    "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
  ];

  return (
    <div className="bg-[#1e1e1e] rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Programação do ChessTV</h2>
        <a href="#" className="text-blue-400 text-sm">Programação Completa</a>
      </div>
      <div className="grid grid-cols-4 border-t border-gray-600">
        <div className="col-span-1">
          {hours.map((h, i) => (
            <div key={i} className="border-b border-gray-700 py-1">{h}</div>
          ))}
        </div>
        <div className="col-span-3 border-l border-gray-700">
          {hours.map((_, i) => (
            <div key={i} className="border-b border-gray-700 py-1"></div>
          ))}
        </div>
      </div>
    </div>
  );
}



export default function ChessEvents() {
  const rankings = chessData.rankings;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181818] via-[#232526] to-[#181818] text-white">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row gap-8 px-2 sm:px-6 md:px-16 py-8 text-white max-w-7xl w-full mx-auto">
        {/* Esquerda */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-[#c29d5d]">Eventos</h2>
            <div className="flex flex-col gap-4">
              <EventoCard
                img="/assets/img/speedchess.png"
                titulo="Women's Speed Chess Championship 2025"
                data="3 de ago. - 29 de set. 2025"
              />
              <EventoCard
                img="/assets/img/titledTuesday.png"
                titulo="Titled Tuesday 2025"
                data="2 de jun. - 30 de dez. 2025"
              />
              <EventoCard
                img="/assets/img/kaggle.png"
                titulo="Kaggle Game Arena Chess Exhibition Tournament 2025"
                data="4 de ago. de 2025 - 7 de ago. de 2025"
              />
              <EventoCard
                img="/assets/img/FreeStyleChess.png"
                titulo="Freestyle Friday 2025"
                data="24 de jan. de 2025 - 26 de dez. de 2025"
              />
            </div>
          </div>
          <ChessTVSchedule />
        </div>

        {/* Direita (Sidebar) */}
        <aside className="w-full md:w-80 flex flex-col gap-8">
          <SocialLinks />
          <StreamersList />
          <RankingList rankings={rankings} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}