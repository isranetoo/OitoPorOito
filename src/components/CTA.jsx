import React from "react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-96 bg-[#1e1e1e] p-8 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-2">Play Chess Online</h1>
      <h2 className="text-2xl font-semibold mb-4">on the #1 Site!</h2>
      <div className="text-sm mb-6 text-gray-400">
        <span className="font-bold text-white">18,867,311</span> Games Today <br />
        <span className="font-bold text-white">136,285</span> Playing Now
      </div>
      <button className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-2.5 rounded-xl text-lg font-bold mb-3 shadow-lg hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">
        ▶ Play Online
      </button>
      <button className="w-full bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-2.5 rounded-xl text-lg font-bold shadow-lg border-2 border-[#c29d5d]/50 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">
        🤖 Play Computer
      </button>
    </motion.section>
  );
}
