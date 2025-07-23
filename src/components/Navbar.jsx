// components/Navbar.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full flex items-center justify-between bg-gradient-to-r from-[#232526] via-[#121212] to-[#232526] px-10 py-4 shadow-lg sticky top-0 z-20 border-b border-[#c29d5d]/30"
    >
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 object-contain drop-shadow-lg rounded-full border border-[#c29d5d] bg-[#232526] p-1" />
        <img src="/assets/oitoporoito.png" alt="OitoPorOito" className="h-10 object-contain" />
      </div>
      <div className="flex gap-7 text-[15px]">
        {['🎮 Play','🧩 Puzzles','📘 Learn','👀 Watch','📰 News','👥 Social'].map((item, idx) => (
          <div
            key={item}
            className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-[#232526] to-[#2d2d2d] shadow-lg border-2 border-[#c29d5d]/40 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-3 pr-2 py-1 rounded-lg bg-[#333] text-white text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
          />
        </div>
        <a href="/signup">
          <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-1.5 px-5 rounded-xl shadow-lg font-bold hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">Sign Up</button>
        </a>
        <a href="/login">
          <button className="bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-1.5 px-5 rounded-xl shadow-lg border-2 border-[#c29d5d]/50 font-bold hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">Log In</button>
        </a>
      </div>
    </motion.nav>
  );
}
