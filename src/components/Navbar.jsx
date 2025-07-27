
// components/Navbar.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label: '🎮 Play', href: '/play' },
    { label: '🧩 Puzzles' },
    { label: '📘 Learn' },
    { label: '👀 Watch' },
    { label: '📰 News' },
    { label: '👥 Social' }
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#232526] via-[#121212] to-[#232526] px-2 sm:px-4 md:px-10 py-2 sm:py-3 md:py-4 shadow-lg sticky top-0 z-20 border-b border-[#c29d5d]/30 gap-2 sm:gap-3 md:gap-0"
    >
      <div className="flex items-center mb-2 md:mb-0 w-full md:w-auto justify-between gap-4">
        {/* Hamburguer menu only on iPad/mobile */}
        <button
          className="flex lg:hidden items-center justify-center p-2 rounded-lg border border-[#c29d5d]/40 bg-[#232526] hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-[#c29d5d] ml-2 sm:ml-4"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#c29d5d]">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <a href="/">
            <img src="/assets/logo.png" alt="Logo" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain drop-shadow-lg rounded-full border border-[#c29d5d] bg-[#232526] p-1" />
          </a>
          <a href="/">
            <img src="/assets/oitoporoito.png" alt="OitoPorOito" className="h-7 sm:h-8 md:h-10 object-contain" />
          </a>
        </div>
      </div>

      {/* Menu de navegação - desktop (aparece só em lg+) */}
      <div className="hidden lg:flex flex-wrap justify-center gap-2 md:gap-7 text-[14px] md:text-[15px] mb-2 md:mb-0">
        {navItems.map((item) => (
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-bold bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow-lg border-2 border-[#c29d5d]/40 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-xs md:text-base"
            >
              {item.label}
            </a>
          ) : (
            <div
              key={item.label}
              className="flex items-center gap-2 cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-bold bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow-lg border-2 border-[#c29d5d]/40 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-xs md:text-base"
            >
              {item.label}
            </div>
          )
        ))}
      </div>

      {/* Search + Auth buttons - desktop (lg+) */}
      {/* Os botões de login/registro não aparecem em md, só no menu hamburguer */}
      <div className="hidden lg:flex items-center gap-2 md:gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-2 pr-2 py-1 rounded-lg bg-[#333] text-white text-xs md:text-sm w-24 md:w-32 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
          />
        </div>
        <a href="/signup">
          <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-1 px-3 md:py-1.5 md:px-5 rounded-xl shadow-lg font-bold hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-xs md:text-base">Sign Up</button>
        </a>
        <a href="/login">
          <button className="bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-1 px-3 md:py-1.5 md:px-5 rounded-xl shadow-lg border-2 border-[#c29d5d]/50 font-bold hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-xs md:text-base">Log In</button>
        </a>
      </div>

      {/* Mobile/iPad menu (hamburguer) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 right-0 m-4">
            <button
              className="p-2 rounded-lg border border-[#c29d5d]/40 bg-[#232526] hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#c29d5d]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full gap-8" onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-xs mx-auto rounded-2xl border-2 border-[#c29d5d]/60 bg-[#232526] bg-opacity-95 shadow-2xl p-8 flex flex-col gap-4">
              {navItems.map((item) => (
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow-lg border-2 border-[#c29d5d]/40 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-base text-center justify-center"
                  >
                    {item.label}
                  </a>
                ) : (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow-lg border-2 border-[#c29d5d]/40 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-base text-center justify-center"
                  >
                    {item.label}
                  </div>
                )
              ))}
              <div className="flex flex-col gap-3 w-full mt-6">
                <a href="/signup">
                  <button className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-2 rounded-xl shadow-lg font-bold hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-base">Sign Up</button>
                </a>
                <a href="/login">
                  <button className="w-full bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-2 rounded-xl shadow-lg border-2 border-[#c29d5d]/50 font-bold hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] text-base">Log In</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
