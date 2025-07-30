import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full bg-[#232526]/80 rounded-2xl shadow-2xl border-t-2 border-b-2 border-[#c29d5d]/30 p-8 flex flex-col items-center">
          <img
            src="/assets/logo-oitoporoito.png"
            alt="OitoPorOito Logo"
            className="w-20 h-20 mb-4 drop-shadow-lg"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-[#e7c27d] mb-4 text-center">404 - Página não encontrada</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 text-center">
            Ops! Parece que você se perdeu no tabuleiro. <br />A página que você procura não existe ou foi movida.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-bold px-6 py-2 rounded-xl shadow-lg hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] mb-4"
          >
            Voltar para a página inicial
          </button>
          <a
            href="mailto:suporte@oitoporoito.com"
            className="text-[#c29d5d] underline hover:text-[#e7c27d] transition-colors text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            Entrar em contato com o suporte
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
